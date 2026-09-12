from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, users, games, engine, academy, puzzles, analysis, multiplayer, beta

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PressureChess Foundation API with Supabase & python-chess support"
)

# Enable CORS for Mobile & Web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(games.router)
app.include_router(engine.router)
app.include_router(academy.router)
app.include_router(puzzles.router)
app.include_router(analysis.router)
app.include_router(multiplayer.router)
app.include_router(beta.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }
