/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Fragment } from "react";
import { Link } from "react-router-dom";

const ListStudents = (props) => {
  const { students, deleteStudent } = props;
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
        <button onClick={() => deleteStudent(student.id)}>Remove From Campus(WRONG DELETE CURRENTLY)</button>  
        <hr/>          
      </div>
      );
      })}
    <Link to={`/newstudent`}>
      <button>Add New Student</button>
    </Link>
    <Link to={`/newstudent`}>
      <button>Add Existing Student</button>
    </Link>
  </Fragment>
  );

}

// Take in props data to construct the component
const CampusView = (props) => {
  const { campus, deleteCampus } = props;
  
  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      <Link to={`/campus/${campus.id}/editcampus`}>
        <button>Edit Campus</button>
      </Link>
      <Link to={'/campuses'}>
        <button onClick={() => deleteCampus(campus.id)}>Delete Campus</button> 
      </Link>
      <h2>Students</h2>
      <ListStudents students={campus.students} deleteStudent={props.deleteStudent}/>
    </div>
  );
};

export default CampusView;