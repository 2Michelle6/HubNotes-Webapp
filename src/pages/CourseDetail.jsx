import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  ImagePlus,
  Paperclip,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import DeckList from "../components/DeckList";
import { useStudyData } from "../data/StudyData";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageInput = useRef(null);
  const fileInput = useRef(null);
  const {
    courses,
    updateCourse,
    updateNote,
    addNote,
    addDeck,
    deleteCourse,
    recordCourseVisit,
  } = useStudyData();
  const [editing, setEditing] = useState(false);
  const [files, setFiles] = useState([]);
  const [deckTitle, setDeckTitle] = useState("");
  const course = courses.find((item) => item.id === id);
  useEffect(() => {
    recordCourseVisit(id);
  }, [id, recordCourseVisit]);
  if (!course) return <p>Course not found.</p>;
  const saveImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateCourse(id, { image: String(reader.result) });
    reader.readAsDataURL(file);
  };
  const removeCourse = () => {
    if (
      window.confirm("are you sure you want to delete this course permanently?")
    ) {
      deleteCourse(id);
      navigate("/courses");
    }
  };
  const createDeck = () => {
    addDeck(id, deckTitle);
    setDeckTitle("");
  };
  return (
    <section className="course-detail-container">
      <header className="detail-header-neo">
        <div className="header-left">
          <button className="icon-btn-neo" onClick={() => navigate("/courses")}>
            <ArrowLeft />
          </button>
          <button
            className="course-image-badge"
            onClick={() => imageInput.current?.click()}
          >
            {course.image ? (
              <img src={course.image} alt="Course" />
            ) : (
              <ImagePlus />
            )}
          </button>
          <input
            ref={imageInput}
            className="visually-hidden"
            type="file"
            accept="image/*"
            onChange={saveImage}
          />
          <div>
            {editing ? (
              <div className="course-edit-fields">
                <input
                  value={course.code}
                  onChange={(event) =>
                    updateCourse(id, { code: event.target.value })
                  }
                />
                <input
                  value={course.title}
                  onChange={(event) =>
                    updateCourse(id, { title: event.target.value })
                  }
                />
                <textarea
                  value={course.overview}
                  onChange={(event) =>
                    updateCourse(id, { overview: event.target.value })
                  }
                />
              </div>
            ) : (
              <>
                <span className="course-code-pill">{course.code}</span>
                <h1>{course.title}</h1>
                <p>{course.overview}</p>
              </>
            )}
            <button
              className="edit-details-btn"
              onClick={() => setEditing(!editing)}
            >
              <Edit3 size={14} /> {editing ? "Done" : "Edit"}
            </button>
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn-neo btn-primary">
            <Save size={16} /> Save Notes
          </button>
          <button className="btn-neo btn-danger" onClick={removeCourse}>
            <Trash2 size={16} /> Delete Course
          </button>
        </div>
      </header>
      <div className="workspace-grid">
        <section className="resources-panel-neo">
          <div className="panel-header">
            <h3>Course Files</h3>
            <button
              className="icon-btn-neo"
              onClick={() => fileInput.current?.click()}
            >
              <Upload size={16} />
            </button>
          </div>
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            multiple
            onChange={(event) =>
              setFiles([...files, ...Array.from(event.target.files || [])])
            }
          />
          <button
            className="upload-dropzone"
            onClick={() => fileInput.current?.click()}
          >
            <Paperclip /> Upload PDFs, PowerPoints, or files
          </button>
          {files.map((file) => (
            <p className="resource-row" key={file.name}>
              › 📄 {file.name}
            </p>
          ))}
        </section>
        <section className="editor-panel-neo">
          <div className="panel-header">
            <h3>Compiler Notes</h3>
            <button className="btn-neo btn-primary" onClick={() => addNote(id)}>
              <Plus size={15} /> Add note
            </button>
          </div>
          {course.notes.map((note) => (
            <div className="note-editor" key={note.id}>
              <input
                value={note.title}
                onChange={(event) =>
                  updateNote(id, note.id, { title: event.target.value })
                }
              />
              <textarea
                value={note.body}
                onChange={(event) =>
                  updateNote(id, note.id, { body: event.target.value })
                }
                placeholder="Start typing your notes here..."
              />
            </div>
          ))}
        </section>
        <section className="decks-panel-neo">
          <div className="panel-header">
            <h3>Active Decks</h3>
          </div>
          <div className="new-deck-row">
            <input
              value={deckTitle}
              onChange={(event) => setDeckTitle(event.target.value)}
              placeholder="New deck name"
            />
            <button className="icon-btn-neo" onClick={createDeck}>
              <Plus size={16} />
            </button>
          </div>
          <DeckList course={course} />
        </section>
      </div>
    </section>
  );
}
