import { createContext, useContext, useEffect, useState } from 'react';

const StudyDataContext = createContext();

const initialCourses = [
  { id: 'ist4035', title: 'Advanced Web Design', code: 'IST 4035', overview: 'Plan, build, and refine responsive web applications.', notes: [{ id: 'n1', title: 'Week 1 ideas', body: 'Review the project brief and list the main user flows.' }], decks: [{ id: 'web-basics', title: 'Web basics', cards: [{ id: 'c1', question: 'What does HTML provide?', answer: 'The structure and meaning of web content.' }, { id: 'c2', question: 'What does CSS control?', answer: 'The presentation and layout of web content.' }] }] },
  { id: 'csc2100', title: 'Data Structures', code: 'CSC 2100', overview: 'Organise data efficiently and choose the right structure for each problem.', notes: [], decks: [{ id: 'structures', title: 'Core structures', cards: [{ id: 'c3', question: 'What is a stack?', answer: 'A last-in, first-out collection.' }] }] },
];

function readCourses() {
  try { return JSON.parse(localStorage.getItem('hubnotes-courses')) || initialCourses; } catch { return initialCourses; }
}

export function StudyProvider({ children }) {
  const [courses, setCourses] = useState(readCourses);
  useEffect(() => localStorage.setItem('hubnotes-courses', JSON.stringify(courses)), [courses]);

  const updateCourse = (courseId, changes) => setCourses((items) => items.map((course) => course.id === courseId ? { ...course, ...changes } : course));
  const updateNote = (courseId, noteId, changes) => setCourses((items) => items.map((course) => course.id !== courseId ? course : { ...course, notes: course.notes.map((note) => note.id === noteId ? { ...note, ...changes } : note) }));
  const addNote = (courseId) => setCourses((items) => items.map((course) => course.id !== courseId ? course : { ...course, notes: [...course.notes, { id: crypto.randomUUID(), title: 'Untitled note', body: '' }] }));
  const addCard = (courseId, deckId, card) => setCourses((items) => items.map((course) => course.id !== courseId ? course : { ...course, decks: course.decks.map((deck) => deck.id !== deckId ? deck : { ...deck, cards: [...deck.cards, { ...card, id: crypto.randomUUID() }] }) }));
  const updateCard = (courseId, deckId, cardId, changes) => setCourses((items) => items.map((course) => course.id !== courseId ? course : { ...course, decks: course.decks.map((deck) => deck.id !== deckId ? deck : { ...deck, cards: deck.cards.map((card) => card.id === cardId ? { ...card, ...changes } : card) }) }));

  return <StudyDataContext.Provider value={{ courses, updateCourse, updateNote, addNote, addCard, updateCard }}>{children}</StudyDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStudyData = () => useContext(StudyDataContext);
