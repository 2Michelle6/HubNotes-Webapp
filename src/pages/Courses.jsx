import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Gamepad2, Plus, Search, X } from "lucide-react";
import { useStudyData } from "../data/StudyData";

export default function Courses() {
  const { courses, createCourse } = useStudyData();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({ title: "", code: "", overview: "" });
  const filtered = courses.filter((course) =>
    `${course.title} ${course.code}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const submit = (event) => {
    event.preventDefault();
    const course = createCourse(draft);
    setIsOpen(false);
    setDraft({ title: "", code: "", overview: "" });
    navigate(`/courses/${course.id}`);
  };
  return (
    <section className="courses-page-container">
      <header className="courses-top-bar">
        <h1 className="title-card-box">Your Courses</h1>
        <button className="btn-neo btn-primary" onClick={() => setIsOpen(true)}>
          <Plus size={16} /> Add New Course
        </button>
      </header>
      <div className="course-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search course title or code..."
        />
      </div>
      <div className="courses-grid-neo">
        {filtered.map((course) => (
          <article className="course-card-neo" key={course.id}>
            <div className="course-card-top">
              <span className="course-icon-badge">
                {course.image ? <img src={course.image} alt="" /> : "📚"}
              </span>
              <span className="course-code-pill">{course.code}</span>
            </div>
            <h2>{course.title}</h2>
            <p className="course-description">{course.overview}</p>
            <div className="course-stats">
              <BookOpen size={14} /> {course.notes.length} Notes ·{" "}
              {course.decks.length} Decks
            </div>
            <div className="course-actions">
              <Link className="btn-neo btn-orange" to={`/courses/${course.id}`}>
                View Notes
              </Link>
              <Link
                className="btn-neo btn-primary"
                to={`/courses/${course.id}`}
              >
                <Gamepad2 size={15} /> Study
              </Link>
            </div>
          </article>
        ))}
        <button
          className="course-card-neo create-course-card-neo"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={28} />
          <strong>Create Course</strong>
          <span>Start a new subject folder</span>
        </button>
      </div>
      {isOpen && (
        <div className="modal-backdrop">
          <form className="card-modal course-form" onSubmit={submit}>
            <button
              type="button"
              className="icon-button modal-close"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
            <h2>Create a course</h2>
            <label>
              Course title
              <input
                className="brutal-input"
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                placeholder="Optional"
              />
            </label>
            <label>
              Course code
              <input
                className="brutal-input"
                value={draft.code}
                onChange={(event) =>
                  setDraft({ ...draft, code: event.target.value })
                }
                placeholder="Optional"
              />
            </label>
            <label>
              Overview
              <textarea
                className="brutal-input"
                value={draft.overview}
                onChange={(event) =>
                  setDraft({ ...draft, overview: event.target.value })
                }
                placeholder="Optional"
              />
            </label>
            <button className="btn-neo btn-primary" type="submit">
              Create Course
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
