import { useParams } from "react-router-dom";

const Assignment = () => {
  const { id } = useParams();
  return <div>Assignment id: {id}</div>;
};

export default Assignment;
