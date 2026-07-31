import { useParams } from 'react-router-dom';

export default function CourseDetail() {
  const { id } = useParams();
  return <h2>Course View: {id}</h2>;
}