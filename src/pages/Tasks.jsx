import DeckList from "../components/DeckList";
import { useStudyData } from "../data/StudyData";
export default function Tasks() {
  const { courses } = useStudyData();
  return (
    <section className="content-page">
      <div className="page-heading">
        <p className="eyebrow-badge">Study tools</p>
        <h1>Your decks</h1>
        <p>Practice cards organised by course.</p>
      </div>
      {courses.map((course) => (
        <section className="content-section" key={course.id}>
          <div className="section-title">
            <div>
              <p className="deck-course">{course.code}</p>
              <h2>{course.title}</h2>
            </div>
          </div>
          <DeckList course={course} showCourseName={false} />
        </section>
      ))}
    </section>
  );
}
