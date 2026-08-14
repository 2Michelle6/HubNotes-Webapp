import { useEffect, useMemo, useState } from "react";
import { Camera, Flame, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActivityHeatmap from "../components/ActivityHeatmap";
import { getLocalDateKey, POINTS_PER_LEVEL } from "../data/activity";
import { useStudyData } from "../data/StudyData";

function getActivityDate(event) {
  return event.date || getLocalDateKey(new Date(event.occurredAt));
}

function getStreak(events) {
  const activeDays = new Set(events.map(getActivityDate));
  let streak = 0;
  const date = new Date();
  while (activeDays.has(getLocalDateKey(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function getRecentCourses(courses, events) {
  const byId = new Map(courses.map((course) => [course.id, course]));
  const seen = new Set();
  return [...events]
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .flatMap((event) => {
      if (!event.courseId || seen.has(event.courseId)) return [];
      const course = byId.get(event.courseId);
      if (!course) return [];
      seen.add(event.courseId);
      return [{ course, occurredAt: event.occurredAt }];
    })
    .slice(0, 5);
}

function getRecentDecks(courses, events) {
  const decks = new Map(
    courses.flatMap((course) =>
      course.decks.map((deck) => [`${course.id}:${deck.id}`, { course, deck }]),
    ),
  );
  const seen = new Set();
  return [...events]
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .flatMap((event) => {
      if (!event.courseId || !event.deckId) return [];
      const key = `${event.courseId}:${event.deckId}`;
      if (seen.has(key) || !decks.has(key)) return [];
      seen.add(key);
      return [{ ...decks.get(key), occurredAt: event.occurredAt }];
    })
    .slice(0, 5);
}

function formatVisitedAt(occurredAt) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(occurredAt));
}

export default function Home() {
  const { courses, activityEvents } = useStudyData();
  const navigate = useNavigate();
  const [image, setImage] = useState(
    () => localStorage.getItem("hubnotes-profile-image") || "",
  );
  useEffect(
    () => localStorage.setItem("hubnotes-profile-image", image),
    [image],
  );

  const stats = useMemo(() => {
    const existingCardIds = new Set(
      courses.flatMap((course) =>
        course.decks.flatMap((deck) => deck.cards.map((card) => card.id)),
      ),
    );
    const masteredCardIds = new Set(
      activityEvents
        .filter(
          (event) =>
            event.type === "card_answered" &&
            event.details?.correct &&
            existingCardIds.has(event.cardId),
        )
        .map((event) => event.cardId),
    );
    const points = activityEvents.reduce(
      (total, event) => total + (Number(event.points) || 0),
      0,
    );
    return {
      points,
      masteredCards: masteredCardIds.size,
      streak: getStreak(activityEvents),
      level: Math.floor(points / POINTS_PER_LEVEL) + 1,
      levelProgress: ((points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL) * 100,
    };
  }, [activityEvents, courses]);
  const recentCourses = useMemo(
    () => getRecentCourses(courses, activityEvents),
    [activityEvents, courses],
  );
  const recentDecks = useMemo(
    () => getRecentDecks(courses, activityEvents),
    [activityEvents, courses],
  );

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
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
          <Flame size={16} /> {stats.streak} day{stats.streak === 1 ? "" : "s"}
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
              <span className="level-pill">Level {stats.level} Scholar</span>
            </div>
          </div>
          <div>
            <b>{stats.points} XP</b>
            <div className="progress-bar-outer">
              <div
                className="progress-bar-inner"
                style={{ width: `${stats.levelProgress}%` }}
              />
            </div>
            <small>
              {POINTS_PER_LEVEL - (stats.points % POINTS_PER_LEVEL)} XP to next
              level
            </small>
          </div>
          <div className="quick-stat-box">
            <b>{stats.masteredCards}</b>
            <br />
            Cards Mastered
          </div>
        </section>

        <ActivityHeatmap events={activityEvents} />

        <section className="recent-activity-section">
          <div className="section-header">
            <div>
              <h2>Recent study activity</h2>
              <p>Open a course or deck to keep this list up to date.</p>
            </div>
          </div>
          <div className="recent-activity-grid">
            <section className="recent-list-card">
              <h3>Last Visited Courses</h3>
              {recentCourses.length ? (
                <ul>
                  {recentCourses.map(({ course, occurredAt }) => (
                    <li key={course.id}>
                      <button onClick={() => navigate(`/courses/${course.id}`)}>
                        <span>
                          <strong>{course.title}</strong>
                          <small>{course.code}</small>
                        </span>
                        <time>{formatVisitedAt(occurredAt)}</time>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">No course visits yet.</p>
              )}
            </section>
            <section className="recent-list-card">
              <h3>Last Visited Decks</h3>
              {recentDecks.length ? (
                <ul>
                  {recentDecks.map(({ course, deck, occurredAt }) => (
                    <li key={`${course.id}:${deck.id}`}>
                      <button
                        onClick={() =>
                          navigate(`/decks/${course.id}/${deck.id}`)
                        }
                      >
                        <span>
                          <strong>{deck.title}</strong>
                          <small>
                            {course.code} · {deck.cards.length} cards
                          </small>
                        </span>
                        <time>{formatVisitedAt(occurredAt)}</time>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">No deck visits yet.</p>
              )}
            </section>
          </div>
        </section>
      </main>
    </section>
  );
}
