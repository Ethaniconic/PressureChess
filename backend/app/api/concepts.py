from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, Dict, Any
from app.services.concept_service import ConceptService
from app.services.tutor_service import TutorService

router = APIRouter(prefix="/concepts", tags=["Concepts & AI Tutor"])
concept_service = ConceptService()
tutor_service = TutorService()


@router.get("/{document_id}")
def get_document_concepts(
    document_id: str,
    user_id: Optional[str] = Query(None, description="User ID for study progress")
):
    """Returns all concepts extracted from the document with study status and completion metrics."""
    try:
        data = concept_service.get_all_concepts(document_id, user_id=user_id)
        return data
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.get("/{document_id}/tree")
def get_document_concept_tree(
    document_id: str,
    user_id: Optional[str] = Query(None, description="User ID for study progress")
):
    """Returns a recursive hierarchical study roadmap tree (Root -> Topics -> Subtopics -> Concepts)."""
    try:
        tree = concept_service.get_concept_tree(document_id, user_id=user_id)
        return tree
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.get("/{document_id}/{concept_id}")
def get_concept_details(
    document_id: str,
    concept_id: str,
    user_id: Optional[str] = Query(None, description="User ID for study progress")
):
    """Returns deep concept details: definition, importance percentage, appears_in citation, and related concepts."""
    try:
        details = concept_service.get_concept(document_id, concept_id, user_id=user_id)
        return details
    except ValueError as val_err:
        raise HTTPException(status_code=404, detail=str(val_err))
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.post("/{document_id}/{concept_id}/progress")
def update_concept_progress(
    document_id: str,
    concept_id: str,
    payload: Dict[str, Any] = Body(..., example={"status": "learned", "user_id": "optional"}),
):
    """Updates study progress status for a concept: 'learned' | 'revising' | 'not_started'."""
    status = payload.get("status", "not_started")
    user_id = payload.get("user_id")
    try:
        res = concept_service.update_study_progress(document_id, concept_id, status, user_id=user_id)
        return res
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.post("/{document_id}/{concept_id}/tutor")
def ask_tutor_explain_concept(
    document_id: str,
    concept_id: str,
    payload: Optional[Dict[str, Any]] = Body(default={}, example={"question": "Can you explain backpropagation intuitive example?"})
):
    """Invokes DocuMind Tutor to produce a structured 4-part engineering explanation."""
    custom_question = payload.get("question") if payload else None
    try:
        explanation = tutor_service.explain_concept(document_id, concept_id, custom_question=custom_question)
        return explanation
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))
