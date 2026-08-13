import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import CardModal from "../components/CardModal";
import { useStudyData } from "../data/StudyData";
export default function DeckDetail() {
  const { courseId, deckId } = useParams();
  const { courses, addCard, updateCard } = useStudyData();
  const [isAdding, setIsAdding] = useState(false);
  const course = courses.find((item) => item.id === courseId);
  const deck = course?.decks.find((item) => item.id === deckId);
  if (!deck) return <h2>Deck not found.</h2>;
  return (
    <section className="content-page">
      <div className="page-heading">
        <p className="eyebrow-badge">{course.code}</p>
        <h1>Edit: {deck.title}</h1>
        <p>Edit a question or answer directly; changes save automatically.</p>
      </div>
      <button
        className="btn-brutal btn-primary"
        onClick={() => setIsAdding(true)}
      >
        <Plus size={17} /> Add card
      </button>
      {isAdding && (
        <CardModal
          onClose={() => setIsAdding(false)}
          onSubmit={(card) => addCard(course.id, deck.id, card)}
        />
      )}
      <div className="card-editor-grid">
        {deck.cards.map((card, index) => (
          <article className="flashcard-editor" key={card.id}>
            <span>Card {index + 1}</span>
            <label>
              Question (front)
              <textarea
                className="brutal-input"
                value={card.question}
                onChange={(event) =>
                  updateCard(course.id, deck.id, card.id, {
                    question: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Answer (back)
              <textarea
                className="brutal-input"
                value={card.answer}
                onChange={(event) =>
                  updateCard(course.id, deck.id, card.id, {
                    answer: event.target.value,
                  })
                }
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
