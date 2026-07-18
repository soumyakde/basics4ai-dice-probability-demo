"""
Basics4AI — Dice Probability Challenge
========================================
Facilitator-led activity: 4 groups work through 4 sequential probability
worksheets (rolling one die, two dice together, sums of 7, at-least-one-6).
The facilitator reads out each group's answer and types it in on one
shared device/screen; numeric/list/yes-no answers are auto-checked for
mathematical equivalence, open-ended reasoning and the dice-drawing bonus
are marked correct/incorrect by the facilitator directly. +1 per correct
answer, -1 per incorrect, one shot per question (no retries) — the
correct answer and reasoning are always shown before moving on.

Entirely client-side: static/checkers.js (answer-equivalence checking),
worksheets.js (question/answer-key data), and game.js (flow + scoring)
hold all the logic. This backend only serves static files — no session
state, no persistence, no backend needed at all since it's a single
device with no cross-device sync (unlike the Sudoku demo's live
leaderboard, which does need one).
"""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Basics4AI Dice Probability Challenge")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


@app.get("/")
def serve_index():
    return FileResponse(BASE_DIR / "static" / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 9100)))
