import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from app.services.knowledge_graph_service import KnowledgeGraphService
from app.core.supabase_client import supabase

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PROGRESS_DIR = BASE_DIR / "processed" / "progress"
PROGRESS_DIR.mkdir(parents=True, exist_ok=True)


class ConceptService:
    def __init__(self):
        self.graph_service = KnowledgeGraphService()

    def _get_local_progress_path(self, document_id: str, user_id: str) -> Path:
        safe_user = user_id.replace("@", "_").replace(".", "_") if user_id else "default"
        return PROGRESS_DIR / f"{safe_user}_{document_id}_progress.json"

    def get_user_progress(self, document_id: str, user_id: Optional[str] = None) -> Dict[str, str]:
        """Loads study progress status for concepts of a document:
        'learned' | 'revising' | 'not_started'
        """
        user_key = user_id or "default"
        progress_map = {}

        # 1. Try Supabase
        if supabase:
            try:
                query = supabase.table("concept_progress").select("concept_id, status").eq("document_id", document_id)
                if user_id:
                    query = query.eq("user_id", user_id)
                res = query.execute()
                if res.data:
                    for item in res.data:
                        progress_map[item["concept_id"]] = item.get("status", "not_started")
                    return progress_map
            except Exception as e:
                # Local fallback
                pass

        # 2. Local JSON cache fallback
        local_path = self._get_local_progress_path(document_id, user_key)
        if local_path.exists():
            try:
                with open(local_path, "r", encoding="utf-8") as f:
                    progress_map = json.load(f)
            except Exception:
                progress_map = {}

        return progress_map

    def update_study_progress(
        self, document_id: str, concept_id: str, status: str, user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Updates status of a concept: 'learned', 'revising', or 'not_started'."""
        valid_statuses = {"learned", "revising", "not_started"}
        if status not in valid_statuses:
            status = "not_started"

        user_key = user_id or "default"

        # 1. Supabase attempt
        if supabase:
            try:
                supabase.table("concept_progress").upsert({
                    "user_id": user_key,
                    "document_id": document_id,
                    "concept_id": concept_id,
                    "status": status
                }).execute()
            except Exception as err:
                print(f"[ConceptService] Supabase update note (fallback to local): {err}")

        # 2. Update local cache
        local_path = self._get_local_progress_path(document_id, user_key)
        progress_data = {}
        if local_path.exists():
            try:
                with open(local_path, "r", encoding="utf-8") as f:
                    progress_data = json.load(f)
            except Exception:
                progress_data = {}

        progress_data[concept_id] = status
        with open(local_path, "w", encoding="utf-8") as f:
            json.dump(progress_data, f, indent=2)

        return {
            "document_id": document_id,
            "concept_id": concept_id,
            "status": status,
            "success": True
        }

    def get_all_concepts(self, document_id: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Returns all concepts from the document knowledge graph with their study progress."""
        graph = self.graph_service.load_cached_graph(document_id)
        if not graph:
            graph = self.graph_service.generate_graph(document_id)

        progress_map = self.get_user_progress(document_id, user_id)
        nodes = graph.get("nodes", [])

        enriched_nodes = []
        counts = {"learned": 0, "revising": 0, "not_started": 0}

        for n in nodes:
            nid = n.get("id")
            st = progress_map.get(nid, "not_started")
            counts[st] = counts.get(st, 0) + 1
            node_copy = dict(n)
            node_copy["status"] = st
            enriched_nodes.append(node_copy)

        total = len(enriched_nodes)
        completion_percent = round((counts["learned"] / total * 100), 1) if total > 0 else 0

        return {
            "document": graph.get("document", {}),
            "concepts": enriched_nodes,
            "stats": {
                "total": total,
                "learned": counts["learned"],
                "revising": counts["revising"],
                "not_started": counts["not_started"],
                "completion_percent": completion_percent
            }
        }

    def get_concept(self, document_id: str, concept_id: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Returns concept metadata, definition, importance, citations, and connected nodes."""
        details = self.graph_service.get_node_details(document_id, concept_id)
        progress_map = self.get_user_progress(document_id, user_id)
        node = details.get("node", {})
        node["status"] = progress_map.get(concept_id, "not_started")

        # Format related concepts list
        related_concepts = []
        for out in details.get("outgoing_connections", []):
            related_concepts.append({
                "id": out.get("target_id"),
                "label": out.get("target_label"),
                "type": out.get("target_type"),
                "relationship": out.get("relationship"),
                "direction": "outgoing"
            })
        for inc in details.get("incoming_connections", []):
            related_concepts.append({
                "id": inc.get("source_id"),
                "label": inc.get("source_label"),
                "type": inc.get("source_type"),
                "relationship": inc.get("relationship"),
                "direction": "incoming"
            })

        # Calculate importance percentage
        raw_imp = float(node.get("importance", 0.75))
        importance_percent = int(round(raw_imp * 100))

        # Format appears in
        source_pages = node.get("source_pages", [1])
        pages_str = ", ".join(f"Page {p}" for p in source_pages) if source_pages else "Page 1"
        appears_in = f"{details.get('node', {}).get('document_title', 'Document Notes')} — {pages_str}"

        return {
            "concept": node,
            "definition": node.get("description", "Concept extracted from document analysis."),
            "importance_percent": importance_percent,
            "appears_in": appears_in,
            "source_pages": source_pages,
            "source_excerpt": node.get("source_excerpt") or node.get("description"),
            "related_concepts": related_concepts,
            "parent": details.get("parent"),
            "total_connections": details.get("total_connections", 0),
            "status": node.get("status", "not_started")
        }

    def get_concept_tree(self, document_id: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Builds a hierarchical nested tree structure (Root -> Topics -> Subtopics -> Concepts)
        for recursive tree rendering in KnowledgeTree.jsx."""
        graph = self.graph_service.load_cached_graph(document_id)
        if not graph:
            graph = self.graph_service.generate_graph(document_id)

        progress_map = self.get_user_progress(document_id, user_id)
        nodes = graph.get("nodes", [])

        node_dict = {}
        for n in nodes:
            nid = n.get("id")
            node_copy = dict(n)
            node_copy["status"] = progress_map.get(nid, "not_started")
            node_copy["children"] = []
            node_dict[nid] = node_copy

        # Build tree using parent_id
        root_candidates = []
        for n in nodes:
            nid = n.get("id")
            pid = n.get("parent_id")
            if pid and pid in node_dict and pid != nid:
                node_dict[pid]["children"].append(node_dict[nid])
            else:
                root_candidates.append(node_dict[nid])

        # If a single root exists, use it. Otherwise create a virtual root from document
        if len(root_candidates) == 1:
            tree_root = root_candidates[0]
        else:
            doc_meta = graph.get("document", {})
            tree_root = {
                "id": "root_virtual",
                "label": doc_meta.get("title", "Document Knowledge Roadmap"),
                "type": "root",
                "description": doc_meta.get("summary", "Complete hierarchical concept tree."),
                "level": 0,
                "importance": 1.0,
                "status": "learned" if all(n["status"] == "learned" for n in node_dict.values()) else "revising",
                "children": root_candidates
            }

        return {
            "document": graph.get("document", {}),
            "tree": tree_root,
            "total_nodes": len(nodes)
        }
