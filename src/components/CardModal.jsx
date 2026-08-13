import { useState } from "react";
import { X } from "lucide-react";

export default function CardModal({ onClose, onSubmit }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    onSubmit({ question: question.trim(), answer: answer.trim() });
    onClose();
  };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="card-modal"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
        aria-label="Add flashcard"
      >
        <button
          type="button"
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2>Add a card</h2>
        <label>
          Question (front)
          <textarea
            className="brutal-input"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Answer (back)
          <textarea
            className="brutal-input"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            required
          />
        </label>
        <button className="btn-brutal btn-primary" type="submit">
          Add card
        </button>
      </form>
    </div>
  );
}
