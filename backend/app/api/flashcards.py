from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, Dict, Any
from app.services.flashcard_service import FlashcardService

router = APIRouter(prefix="/flashcards", tags=["Revision Flashcards"])
flashcard_service = FlashcardService()


@router.get("/{document_id}")
def get_document_flashcards(
    document_id: str,
    concept_id: Optional[str] = Query(None, description="Optional concept filter")
):
    """Retrieves all flashcards for a document, with optional filter by concept."""
    try:
        cards = flashcard_service.get_flashcards(document_id, concept_id=concept_id)
        if not cards:
            # Auto-seed initial flashcards if none exist yet
            cards = flashcard_service.generate_flashcards(document_id, concept_id=concept_id)
        return {
            "document_id": document_id,
            "concept_id": concept_id,
            "total": len(cards),
            "flashcards": cards
        }
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.get("/{document_id}/concept/{concept_id}")
def get_concept_flashcards(document_id: str, concept_id: str):
    """Retrieves flashcards specifically for a given concept."""
    try:
        cards = flashcard_service.get_flashcards(document_id, concept_id=concept_id)
        if not cards:
            cards = flashcard_service.generate_flashcards(document_id, concept_id=concept_id)
        return {
            "document_id": document_id,
            "concept_id": concept_id,
            "total": len(cards),
            "flashcards": cards
        }
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.post("/{document_id}/generate")
def generate_new_flashcards(
    document_id: str,
    payload: Optional[Dict[str, Any]] = Body(default={}, example={"concept_id": "gradient_descent", "count": 6})
):
    """Generates new high-yield revision flashcards using document knowledge graph and LLM."""
    concept_id = payload.get("concept_id") if payload else None
    count = payload.get("count", 6) if payload else 6
    try:
        cards = flashcard_service.generate_flashcards(document_id, concept_id=concept_id, count=count)
        return {
            "document_id": document_id,
            "concept_id": concept_id,
            "generated_count": len(cards),
            "flashcards": cards
        }
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.post("/{document_id}/{card_id}/review")
def review_flashcard(
    document_id: str,
    card_id: str,
    payload: Dict[str, Any] = Body(..., example={"rating": "mastered"})
):
    """Updates mastery status of a card: 'mastered' | 'revising' | 'unreviewed'."""
    rating = payload.get("rating", "revising")
    try:
        res = flashcard_service.record_review(document_id, card_id, rating=rating)
        return res
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))
