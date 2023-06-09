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

const GpaDisplay = (props) => {
  const { gpa } = props;
  if (gpa) {
    return (
      <p>GPA: {gpa}</p>
    );
  }
  return (null);
}

const StudentView = (props) => {
  const { student } = props;

  // Render a single Student view 
  return (
    <div>
      <br/>
      <img src={student.imgUrl} alt="Broken link to profile picture of student" style={{width: '240px'}}></img>
      <h1>{student.firstname + " " + student.lastname}</h1>
      <CampusCheck student={student}/>
      <GpaDisplay gpa={student.gpa}/>
      <p>{student.email}</p>
      <Link style={{position: "relative", right: "10%"}} to={`/student/${student.id}/edit`}>
        <button style={{position: "relative", padding: "2px"}}>Edit Student</button>
      </Link>
      <Link style={{position: "relative", left: "10%"}} to={'/students'}>
        <button style={{position: "relative", padding: "2px"}}onClick={() => props.deleteStudent(student.id)}>Delete Student</button>
      </Link>
    </div>
  );

};

export default StudentView;