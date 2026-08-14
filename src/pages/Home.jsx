import { useEffect, useState } from "react";
import { Camera, Flame, Gamepad2, Plus, Search } from "lucide-react";
import { useStudyData } from "../data/StudyData";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const { courses } = useStudyData();
  const navigate = useNavigate();
  const [image, setImage] = useState(
    () => localStorage.getItem("hubnotes-profile-image") || "",
  );
  useEffect(
    () => localStorage.setItem("hubnotes-profile-image", image),
    [image],
  );
  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(String(reader.result));
      reader.readAsDataURL(file);
    }
  };
  return (
    <section className="dashboard-container">
      <header className="dash-nav">
        <h1>Your Home</h1>
        <label className="search-box">
          <Search size={16} />
          <input placeholder="Search decks, tags, or topics..." />
        </label>
        <span className="streak-badge">
          <Flame size={16} /> 5 Days
        </span>
      </header>
      <main className="dash-main">
        <section className="stats-banner">
          <div className="profile-info">
            <div className="avatar-wrap">
              {image ? (
                <img src={image} className="profile-image" alt="Profile" />
              ) : (
                <span className="profile-placeholder">🎓</span>
              )}
              <label className="avatar-button">
                <Camera size={14} />
                <input type="file" accept="image/*" onChange={selectImage} />
              </label>
            </div>
            <div>
              <h2>Welcome back, Guest Scholar!</h2>
              <span className="level-pill">🏆 Level 3 Scholar</span>
            </div>
          </div>
          <div>
            <b>XP Progress</b>
            <div className="progress-bar-outer">
              <div className="progress-bar-inner" style={{ width: "75%" }} />
            </div>
          </div>
          <div className="quick-stat-box">
            <b>128</b>
            <br />
            Cards Mastered
          </div>
        </section>
        <div className="section-header">
          <div>
            <h2>Your Study Decks</h2>
            <p>Select a deck to review or play in mini-game mode</p>
          </div>
          <button className="btn-neo btn-primary">
            <Plus size={16} /> New Deck
          </button>
        </div>
        <div className="decks-grid">
          {courses.flatMap((course) =>
            course.decks.map((deck) => (
              <article className="deck-card" key={deck.id}>
                <div className="deck-header">
                  <span className="deck-category">{course.code}</span>
                  <span>{deck.cards.length} Cards</span>
                </div>
                <h3>{deck.title}</h3>
                <b>
                  Mastery <span className="right">{deck.mastery || 0}%</span>
                </b>
                <div className="progress-bar-outer">
                  <div
                    className="progress-bar-inner"
                    style={{ width: `${deck.mastery || 0}%` }}
                  />
                </div>
                <div className="deck-card-actions">
                  <button className="btn-neo btn-orange">Review</button>
                  <button
                    className="btn-neo btn-primary"
                    onClick={() => navigate(`/play/${course.id}/${deck.id}`)}
                  >
                    <Gamepad2 size={15} /> Play Game
                  </button>
                </div>
              </article>
            )),
          )}
          <button className="deck-card create-course-card-neo">
            <Plus size={28} /> <h3>Create New Deck</h3>
            <span>Add notes, flashcards, or upload study material</span>
          </button>
        </div>
      </main>
    </section>
  );
}
