import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStudyData } from '../data/StudyData';
export default function Courses() { const { courses } = useStudyData(); return <section className="content-page"><div className="page-heading"><p className="eyebrow-badge">Your study space</p><h1>Your courses</h1></div><div className="course-grid">{courses.map((course) => <article className="course-card" key={course.id}><p>{course.code}</p><h2>{course.title}</h2><span>{course.decks.length} active deck{course.decks.length === 1 ? '' : 's'}</span><Link className="btn-brutal btn-primary" to={`/courses/${course.id}`}>Open course <ArrowRight size={17} /></Link></article>)}</div></section>; }
