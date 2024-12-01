import { useParams } from "react-router-dom";

const Submission = () => {
  const {id} = useParams()
  return <div>Submission id: {id}</div>;
};

export default Submission;
