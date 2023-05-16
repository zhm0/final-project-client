/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Fragment } from "react";
import { Link } from "react-router-dom";

const ListStudents = (props) => {
  const { students } = props;
  if (!students.length) {
    return (
      <div>
        <p>There are no students.</p>
        <Link to={`/newstudent`}>
          <button>Add New Student</button>
        </Link>
      </div>
      );
  }

  return (
  <Fragment>
    {students.map( student => {
      let name = student.firstname + " " + student.lastname;
      return (
      <div key={student.id}>
        <Link to={`/student/${student.id}`}>
          <h3>{name}</h3>
        </Link>             
      </div>
      );
      })}
  </Fragment>
  );

}

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus} = props;
  
  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      <h2>Students</h2>
      <ListStudents students={campus.students}/>
    </div>
  );
};

export default CampusView;