/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Fragment } from "react";
import { Link } from "react-router-dom";

const ListStudents = (props) => {
  const { students, handleClick } = props;
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
        <button onClick={() => handleClick(student.id)}>Remove From Campus</button>  
        <hr/>          
      </div>
      );
      })}
    <Link to={`/newstudent`}>
      <button>Add New Student</button>
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
      <img src={campus.imgUrl} alt="Image not found" style={{width: '480px'}}></img>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      <p>ID: {campus.id}</p>
      <Link style={{position: "relative", right: "10%"}} to={`/campus/${campus.id}/edit`}>
        <button style={{position: "relative", padding: "3px"}}>Edit Campus</button>
      </Link>
      <Link style={{position: "relative", left: "10%"}} to={'/campuses'}>
        <button style={{position: "relative", padding: "3px"}} onClick={() => deleteCampus(campus.id)}>Delete Campus</button> 
      </Link>
      <h2>Students</h2>
      <ListStudents students={campus.students} deleteStudent={props.deleteStudent} handleClick={props.handleClick}/>
    </div>
  );
};

export default CampusView;