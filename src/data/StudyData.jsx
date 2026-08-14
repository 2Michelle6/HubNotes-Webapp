import { createContext, useContext, useEffect, useState } from "react";

const StudyDataContext = createContext();
const initialCourses = [
  {
    id: "ist4035",
    title: "Advanced Web Design",
    code: "IST 4035",
    overview: "Plan, build, and refine responsive web applications.",
    image: "",
    notes: [
      {
        id: "n1",
        title: "Week 1 ideas",
        body: "Review the project brief and list the main user flows.",
      },
    ],
    decks: [
      {
        id: "web-basics",
        title: "Web basics",
        mastery: 0,
        cards: [
          {
            id: "c1",
            question: "What does HTML provide?",
            answer: "The structure and meaning of web content.",
          },
        ],
      },
    ],
  },
  {
    id: "csc2100",
    title: "Data Structures",
    code: "CSC 2100",
    overview:
      "Organise data efficiently and choose the right structure for each problem.",
    image: "",
    notes: [],
    decks: [
      { id: "structures", title: "Core structures", mastery: 0, cards: [] },
    ],
  },
];
const newId = () => crypto.randomUUID();
function readCourses() {
  try {
    return (
      JSON.parse(localStorage.getItem("hubnotes-courses")) || initialCourses
    );
  } catch {
    return initialCourses;
  }
}

export function StudyProvider({ children }) {
  const [courses, setCourses] = useState(readCourses);
  useEffect(
    () => localStorage.setItem("hubnotes-courses", JSON.stringify(courses)),
    [courses],
  );
  const updateCourse = (courseId, changes) =>
    setCourses((items) =>
      items.map((course) =>
        course.id === courseId ? { ...course, ...changes } : course,
      ),
    );
  const createCourse = (values = {}) => {
    const course = {
      id: newId(),
      title: values.title?.trim() || "Untitled course",
      code: values.code?.trim() || "No code yet",
      overview:
        values.overview?.trim() || "Add a course overview to get started.",
      image: "",
      notes: [],
      decks: [{ id: newId(), title: "Untitled deck", mastery: 0, cards: [] }],
    };
    setCourses((items) => [...items, course]);
    return course;
  };
  const deleteCourse = (courseId) =>
    setCourses((items) => items.filter((course) => course.id !== courseId));
  const addNote = (courseId) =>
    updateCourse(courseId, {
      notes: [
        ...courses.find((course) => course.id === courseId).notes,
        { id: newId(), title: "Untitled note", body: "" },
      ],
    });
  const updateNote = (courseId, noteId, changes) => {
    const course = courses.find((item) => item.id === courseId);
    updateCourse(courseId, {
      notes: course.notes.map((note) =>
        note.id === noteId ? { ...note, ...changes } : note,
      ),
    });
  };
  const addDeck = (courseId, title = "Untitled deck") => {
    const course = courses.find((item) => item.id === courseId);
    updateCourse(courseId, {
      decks: [
        ...course.decks,
        {
          id: newId(),
          title: title.trim() || "Untitled deck",
          mastery: 0,
          cards: [],
        },
      ],
    });
  };
  const addCard = (courseId, deckId, card) => {
    const course = courses.find((item) => item.id === courseId);
    updateCourse(courseId, {
      decks: course.decks.map((deck) =>
        deck.id === deckId
          ? { ...deck, cards: [...deck.cards, { ...card, id: newId() }] }
          : deck,
      ),
    });
  };
  const updateCard = (courseId, deckId, cardId, changes) => {
    const course = courses.find((item) => item.id === courseId);
    updateCourse(courseId, {
      decks: course.decks.map((deck) =>
        deck.id === deckId
          ? {
              ...deck,
              cards: deck.cards.map((card) =>
                card.id === cardId ? { ...card, ...changes } : card,
              ),
            }
          : deck,
      ),
    });
  };
  const recordGameSession = (courseId, deckId, result) => {
    setCourses((items) =>
      items.map((course) =>
        course.id !== courseId
          ? course
          : {
              ...course,
              decks: course.decks.map((deck) => {
                if (deck.id !== deckId) return deck;
                const previousStats = deck.gameStats || {
                  sessions: 0,
                  coinsCollected: 0,
                  correctAnswers: 0,
                  incorrectAnswers: 0,
                };
                return {
                  ...deck,
                  gameStats: {
                    sessions: previousStats.sessions + 1,
                    coinsCollected:
                      previousStats.coinsCollected +
                      (result.coinsCollected || 0),
                    correctAnswers:
                      previousStats.correctAnswers +
                      (result.correctAnswers || 0),
                    incorrectAnswers:
                      previousStats.incorrectAnswers +
                      (result.incorrectAnswers || 0),
                  },
                  lastGameSession: result,
                };
              }),
            },
      ),
    );
  };
  return (
    <StudyDataContext.Provider
      value={{
        courses,
        updateCourse,
        createCourse,
        deleteCourse,
        addNote,
        updateNote,
        addDeck,
        addCard,
        updateCard,
        recordGameSession,
      }}
    >
      {children}
    </StudyDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStudyData = () => useContext(StudyDataContext);
