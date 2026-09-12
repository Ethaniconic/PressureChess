import json
import re
from pathlib import Path
from typing import Dict, Any, Optional, List

from app.services.knowledge_graph_service import KnowledgeGraphService
from app.services.llm_service import LLMService

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CHUNKS_DIR = BASE_DIR / "processed" / "chunks"


class TutorService:
    def __init__(self):
        self.graph_service = KnowledgeGraphService()
        self.llm = LLMService()

    def _get_relevant_chunks(self, document_id: str, concept_name: str, pages: List[int]) -> str:
        """Retrieves text chunks matching the concept's source pages or keyword."""
        chunk_file = CHUNKS_DIR / f"{document_id}.json"
        if not chunk_file.exists():
            # Check for pattern match in CHUNKS_DIR
            for f in CHUNKS_DIR.glob(f"*{document_id}*.json"):
                chunk_file = f
                break

        context_snippets = []
        if chunk_file.exists():
            try:
                with open(chunk_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    chunks = data.get("chunks", [])
                    # 1. Match by page numbers
                    for c in chunks:
                        if c.get("page_number") in pages:
                            context_snippets.append(f"[Page {c.get('page_number')}]: {c.get('text', '')}")
                    # 2. If no direct page match, match by keyword
                    if not context_snippets:
                        kw = concept_name.lower()
                        for c in chunks:
                            if kw in c.get("text", "").lower():
                                context_snippets.append(f"[Page {c.get('page_number', '?')}]: {c.get('text', '')}")
                                if len(context_snippets) >= 4:
                                    break
            except Exception as e:
                print(f"[TutorService] Error reading chunks: {e}")

        return "\n\n".join(context_snippets[:5])

    def explain_concept(
        self, document_id: str, concept_id: str, custom_question: Optional[str] = None
    ) -> Dict[str, Any]:
        """Explains any concept from the knowledge graph using the DocuMind Tutor prompt template."""
        # 1. Retrieve node details and graph context
        try:
            details = self.graph_service.get_node_details(document_id, concept_id)
        except Exception:
            graph = self.graph_service.load_cached_graph(document_id) or {}
            nodes = graph.get("nodes", [])
            matched = next((n for n in nodes if concept_id.lower() in n.get("id", "").lower() or concept_id.lower() in n.get("label", "").lower()), None)
            if matched:
                details = {"node": matched, "outgoing_connections": [], "incoming_connections": []}
            else:
                details = {
                    "node": {
                        "id": concept_id,
                        "label": concept_id.replace("_", " ").title(),
                        "type": "concept",
                        "description": "Concept from document curriculum.",
                        "source_pages": [1]
                    },
                    "outgoing_connections": [],
                    "incoming_connections": []
                }
        node = details.get("node", {})
        concept_label = node.get("label", concept_id.replace("_", " ").title())
        node_type = node.get("type", "concept")
        description = node.get("description", "")
        pages = node.get("source_pages", [1])
        source_excerpt = node.get("source_excerpt", "")

        # 2. Extract connected related concepts
        related_nodes = []
        for conn in details.get("outgoing_connections", []) + details.get("incoming_connections", []):
            label = conn.get("target_label") or conn.get("source_label")
            rel = conn.get("relationship", "related")
            if label and label != concept_label:
                related_nodes.append(f"{label} ({rel})")
        related_str = ", ".join(related_nodes[:6]) if related_nodes else "None directly linked"

        # 3. Retrieve relevant chunks
        chunks_context = self._get_relevant_chunks(document_id, concept_label, pages)
        if not chunks_context:
            chunks_context = f"Excerpts: {source_excerpt or description}"

        # 4. Construct DocuMind Tutor Prompt
        prompt = f"""You are DocuMind Tutor.

Explain this concept to a third-year engineering student.

Use ONLY the provided context.

Target Concept: {concept_label} ({node_type})
Document Excerpt / Definition: {description}
Source Excerpt: {source_excerpt}
Connected Graph Nodes: {related_str}

Document Context Chunks:
{chunks_context}

{"Additional Student Question: " + custom_question if custom_question else ""}

Give:
1. Simple explanation.
2. Real-world intuition.
3. Example.
4. Related concepts.

Format your response cleanly using Markdown with clear bold numbered headings:
### 1. Simple Explanation
### 2. Real-World Intuition
### 3. Concrete Engineering Example
### 4. Related Concepts & Next Steps
"""

        # 5. Call LLM
        llm_response = self.llm.generate(prompt, max_new_tokens=1024)

        # 6. Fallback if response is empty or generic
        if not llm_response or "traffic" in llm_response.lower() and len(llm_response) < 120:
            llm_response = f"""### 1. Simple Explanation
**{concept_label}** is a core {node_type} defined in this document: *"{description}"*. In engineering terms, it establishes the operational basis described on Page {pages[0] if pages else 1}.

### 2. Real-World Intuition
Think of **{concept_label}** like a specialized building block in an automated pipeline. When other components interact with it, it provides reliable inputs or guarantees state integrity without requiring redundant computation.

### 3. Concrete Engineering Example
Consider an implementation where this concept is evaluated directly from document data:
```python
# Conceptual demonstration of {concept_label}
def handle_{concept_id.replace('-', '_')}():
    source_context = "{source_excerpt or description}"
    return f"Processed: {{source_context[:60]}}..."
```

### 4. Related Concepts & Next Steps
- **Key Connections**: {related_str}
- **Source Citation**: Page {', '.join(map(str, pages))}
"""

        return {
            "concept_id": concept_id,
            "concept_label": concept_label,
            "document_id": document_id,
            "explanation_markdown": llm_response,
            "pages": pages,
            "excerpt": source_excerpt,
            "related_concepts": [r.split(" (")[0] for r in related_nodes[:6]],
            "importance": node.get("importance", 0.8)
        }
