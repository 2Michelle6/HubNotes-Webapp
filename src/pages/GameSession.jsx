import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import GodotGameFrame from "../components/GodotGameFrame";
import { useStudyData } from "../data/StudyData";
import { createGameStartMessage } from "../game/gameProtocol";

export default function GameSession() {
  const { courseId, deckId } = useParams();
  const navigate = useNavigate();
  const { courses, recordDeckVisit, recordGameSession, recordGameStarted } =
    useStudyData();
  const [sessionId] = useState(() => crypto.randomUUID());
  const [status, setStatus] = useState("Loading game...");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const gameStartedRef = useRef(false);
  const gameCompletedRef = useRef(false);
  const course = courses.find((item) => item.id === courseId);
  const deck = course?.decks.find((item) => item.id === deckId);

  const startMessage = useMemo(
    () =>
      course && deck
        ? createGameStartMessage({ sessionId, course, deck })
        : null,
    [course, deck, sessionId],
  );

  const handleMessage = useCallback(
    (message) => {
      if (message.type === "game.ready") {
        setStatus("Starting your study session...");
      }
      if (message.type === "game.started") {
        setStatus("Collect coins to answer questions.");
        if (!gameStartedRef.current) {
          gameStartedRef.current = true;
          recordGameStarted(courseId, deckId);
        }
      }
      if (
        message.type === "game.completed" &&
        message.sessionId === sessionId &&
        !gameCompletedRef.current
      ) {
        gameCompletedRef.current = true;
        setResult(message.result);
        setStatus("Study session complete");
        recordGameSession(courseId, deckId, {
          sessionId,
          completedAt: new Date().toISOString(),
          ...message.result,
        });
      }
    },
    [courseId, deckId, recordGameSession, recordGameStarted, sessionId],
  );
  useEffect(() => {
    recordDeckVisit(courseId, deckId);
  }, [courseId, deckId, recordDeckVisit]);

  if (!course || !deck) {
    return (
      <section className="content-page">
        <h1>Deck not found.</h1>
      </section>
    );
  }

  if (deck.cards.length === 0) {
    return (
      <section className="content-page game-session-page">
        <h1>{deck.title} has no cards yet.</h1>
        <p>Add at least one flashcard before starting the game.</p>
        <button
          className="btn-neo btn-primary"
          onClick={() => navigate(`/decks/${courseId}/${deckId}`)}
        >
          Add cards
        </button>
      </section>
    );
  }

  return (
    <section className="game-session-page">
      <header className="game-session-header">
        <button
          className="icon-btn-neo"
          onClick={() => navigate(`/courses/${courseId}`)}
          aria-label="Back to course"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow-badge">{course.code}</p>
          <h1>{deck.title}</h1>
          <p>{status}</p>
        </div>
      </header>

      {error ? <p className="game-session-error">{error}</p> : null}
      {!result ? (
        <div className="godot-game-shell">
          <GodotGameFrame
            startMessage={startMessage}
            onMessage={handleMessage}
            onError={setError}
          />
        </div>
      ) : (
        <section className="game-result-card">
          <h2>Session complete</h2>
          <p>
            {result.correctAnswers} correct - {result.incorrectAnswers}{" "}
            incorrect
          </p>
          <p>
            You kept {result.coinsCollected} coin
            {result.coinsCollected === 1 ? "" : "s"}.
          </p>
          <button
            className="btn-neo btn-primary"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Back to course
          </button>
        </section>
      )}
    </section>
  );
}
