import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Play, Plus } from 'lucide-react';
import CardModal from './CardModal';
import { useStudyData } from '../data/StudyData';

export default function DeckList({ course, showCourseName = false }) {
  const { addCard } = useStudyData();
  const [activeDeck, setActiveDeck] = useState(null);
  return <>
    {activeDeck && <CardModal onClose={() => setActiveDeck(null)} onSubmit={(card) => addCard(course.id, activeDeck.id, card)} />}
    <div className="deck-list">
      {course.decks.map((deck) => <article className="deck-card" key={deck.id}>
        {showCourseName && <p className="deck-course">{course.code}</p>}
        <h3>{deck.title}</h3><p>{deck.cards.length} card{deck.cards.length === 1 ? '' : 's'}</p>
        <div className="deck-actions"><button className="btn-brutal btn-primary compact-btn" type="button" onClick={() => window.alert(`Study mode for ${deck.title} is ready for your next session.`)}><Play size={16} /> Play</button><button className="icon-button" type="button" onClick={() => setActiveDeck(deck)} aria-label={`Add a card to ${deck.title}`}><Plus size={19} /></button><Link className="icon-button" to={`/decks/${course.id}/${deck.id}`} aria-label={`Edit ${deck.title}`}><Pencil size={18} /></Link></div>
      </article>)}
    </div>
  </>;
}
