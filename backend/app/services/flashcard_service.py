import json
import re
import uuid
from pathlib import Path
from typing import Dict, Any, List, Optional

from app.services.knowledge_graph_service import KnowledgeGraphService
from app.services.llm_service import LLMService
from app.core.supabase_client import supabase

BASE_DIR = Path(__file__).resolve().parent.parent.parent
FLASHCARD_DIR = BASE_DIR / "processed" / "flashcards"
FLASHCARD_DIR.mkdir(parents=True, exist_ok=True)


class FlashcardService:
    def __init__(self):
        self.graph_service = KnowledgeGraphService()
        self.llm = LLMService()

    def _get_flashcards_path(self, document_id: str) -> Path:
        return FLASHCARD_DIR / f"{document_id}_flashcards.json"

    def get_flashcards(self, document_id: str, concept_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieves stored flashcards for a document or specific concept."""
        # 1. Try local storage first
        path = self._get_flashcards_path(document_id)
        cards: List[Dict[str, Any]] = []

        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    cards = data.get("flashcards", [])
            except Exception as err:
                print(f"[FlashcardService] Error loading cards: {err}")

        # If no local cards and Supabase available, attempt fetch
        if not cards and supabase:
            try:
                query = supabase.table("flashcards").select("*").eq("document_id", document_id)
                res = query.execute()
                if res.data:
                    cards = res.data
            except Exception:
                pass

        if concept_id:
            return [c for c in cards if c.get("concept_id") == concept_id]
        return cards

    def generate_flashcards(
        self, document_id: str, concept_id: Optional[str] = None, count: int = 6
    ) -> List[Dict[str, Any]]:
        """Generates 5-10 high-yield flashcards using document knowledge graph nodes and LLM."""
        graph = self.graph_service.load_cached_graph(document_id)
        if not graph:
            graph = self.graph_service.generate_graph(document_id)

        nodes = graph.get("nodes", [])
        if not nodes:
            raise ValueError(f"No concept nodes found for document: {document_id}")

        target_nodes = []
        if concept_id:
            target_nodes = [n for n in nodes if n.get("id") == concept_id]
            # Include child/connected nodes if available
            children = [n for n in nodes if n.get("parent_id") == concept_id]
            target_nodes.extend(children)
        else:
            # Select top high-importance nodes across topics and concepts
            sorted_nodes = sorted(nodes, key=lambda n: float(n.get("importance", 0.7)), reverse=True)
            target_nodes = sorted_nodes[:10]

        if not target_nodes:
            target_nodes = nodes[:6]

        concept_summaries = []
        for n in target_nodes[:8]:
            concept_summaries.append(
                f"- Concept: {n.get('label')} ({n.get('type')})\n"
                f"  Definition: {n.get('description')}\n"
                f"  Source Page: {n.get('source_pages', [1])}\n"
                f"  Excerpt: {n.get('source_excerpt', '')}"
            )
        context_str = "\n\n".join(concept_summaries)

        prompt = f"""You are DocuMind Flashcard Generator.
Generate between 5 and 10 high-yield revision flashcards based on the document concepts below.

Concepts & Knowledge Context:
{context_str}

Guidelines:
1. Every card must have a clear, engaging, non-trivial Question.
2. The Answer must be concise yet thorough (2-4 sentences), explaining core intuition and mechanics.
3. Include difficulty: "easy" | "medium" | "hard".
4. Link each card to its corresponding concept_id.

Respond ONLY with valid JSON in this structure:
{{
  "flashcards": [
    {{
      "concept_id": "<node_id>",
      "concept_label": "<Concept Name>",
      "question": "What is ...?",
      "answer": "...",
      "difficulty": "medium",
      "key_takeaway": "1 sentence quick takeaway"
    }}
  ]
}}
"""
        generated_cards = []
        try:
            raw_response = self.llm.generate(prompt, max_new_tokens=2048)
            cleaned = re.sub(r"^```(?:json)?", "", raw_response.strip(), flags=re.MULTILINE)
            cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE).strip()
            start = cleaned.find("{")
            end = cleaned.rfind("}")
            if start != -1 and end != -1:
                parsed = json.loads(cleaned[start : end + 1])
                generated_cards = parsed.get("flashcards", [])
        except Exception as e:
            print(f"[FlashcardService] LLM generation note (using rule-based fallback): {e}")

        # Rule-based fallback if LLM returned fewer than 3 cards
        if len(generated_cards) < 3:
            generated_cards = []
            for n in target_nodes[:8]:
                lbl = n.get("label", "Concept")
                desc = n.get("description", "Fundamental topic discussed in the material.")
                p = n.get("source_pages", [1])
                p_str = f"Page {p[0]}" if p else "Document"
                generated_cards.append({
                    "concept_id": n.get("id"),
                    "concept_label": lbl,
                    "question": f"What is the primary role and definition of {lbl}?",
                    "answer": f"{desc} Referenced in {p_str}.",
                    "difficulty": "medium",
                    "key_takeaway": f"{lbl} is vital for understanding the overall system workflow."
                })

        # Add IDs, timestamps, and default review status
        final_cards = []
        for c in generated_cards:
            cid = c.get("id") or str(uuid.uuid4())[:8]
            final_cards.append({
                "id": cid,
                "document_id": document_id,
                "concept_id": c.get("concept_id") or (target_nodes[0].get("id") if target_nodes else "general"),
                "concept_label": c.get("concept_label") or "Core Topic",
                "question": c.get("question"),
                "answer": c.get("answer"),
                "difficulty": c.get("difficulty", "medium"),
                "key_takeaway": c.get("key_takeaway", ""),
                "status": "unreviewed",
                "times_reviewed": 0
            })

        # Merge with existing cards (avoiding exact question duplicates)
        existing = self.get_flashcards(document_id)
        existing_questions = {e.get("question", "").strip().lower() for e in existing}
        merged = list(existing)
        for fc in final_cards:
            if fc.get("question", "").strip().lower() not in existing_questions:
                merged.append(fc)

        # Save to disk
        save_path = self._get_flashcards_path(document_id)
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump({"document_id": document_id, "flashcards": merged}, f, indent=2)

        # Sync to Supabase if configured
        if supabase:
            try:
                for c in final_cards:
                    supabase.table("flashcards").upsert(c).execute()
            except Exception as s_err:
                print(f"[FlashcardService] Supabase card upsert note: {s_err}")

        return merged if not concept_id else [c for c in merged if c.get("concept_id") == concept_id]

    def record_review(self, document_id: str, card_id: str, rating: str) -> Dict[str, Any]:
        """Records review outcome: 'mastered' (green) or 'revising' (yellow)."""
        valid_ratings = {"mastered", "revising", "unreviewed"}
        rating = rating if rating in valid_ratings else "revising"

        path = self._get_flashcards_path(document_id)
        cards = self.get_flashcards(document_id)
        matched_card = None

        for c in cards:
            if c.get("id") == card_id:
                c["status"] = rating
                c["times_reviewed"] = c.get("times_reviewed", 0) + 1
                matched_card = c
                break

        if path.exists() and matched_card:
            with open(path, "w", encoding="utf-8") as f:
                json.dump({"document_id": document_id, "flashcards": cards}, f, indent=2)

        if supabase and matched_card:
            try:
                supabase.table("flashcards").update({
                    "status": rating,
                    "times_reviewed": matched_card.get("times_reviewed", 1)
                }).eq("id", card_id).execute()
            except Exception:
                pass

        return {
            "success": True,
            "card_id": card_id,
            "status": rating,
            "card": matched_card
        }
