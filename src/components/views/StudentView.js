/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */

import { Link } from "react-router-dom";

const CampusCheck = (props) => {
  const { student } = props;
  if (student.campusId) {
    return (
      <Link to={`/campus/${student.campusId}`}>
        <h3>{student.campus.name}</h3>
      </Link>
    );
  }
  
  return (
    <h3>Currently not enrolled in college (Edit to enroll)</h3>
  )
}

const StudentView = (props) => {
  const { student } = props;

  // Render a single Student view 
  return (
    <div>
      <br/>
      <img src={student.imageUrl} alt="Broken link to profile picture of student" style={{width: '240px'}}></img>
      <h1>{student.firstname + " " + student.lastname}</h1>
      <CampusCheck student={student}/>
      <p>{student.email}</p>
      <p>{student.gpa}</p>
      <Link to={`/student/${student.id}/edit`}>
        <button>Edit Student</button>
      </Link>
      <Link to={'/students'}>
        <button onClick={() => props.deleteStudent(student.id)}>Delete Student</button>
      </Link>
    </div>
  );

};

export default StudentView;