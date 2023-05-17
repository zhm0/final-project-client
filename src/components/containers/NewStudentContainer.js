/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { 
  addStudentThunk,
  fetchAllCampusesThunk
} from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "",
      email: "",
      imgUrl: "",
      gpa: "",
      campusId: "", 
      redirect: false, 
      redirectId: null
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.props.fetchAllCampuses();
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    if (!/\S/.test(this.state.firstname)) {
      alert("You must enter a first name!");
    }
    else if (!/\S/.test(this.state.lastname)) {
      alert("You must enter a last name!");
    }
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
      alert("You must enter a valid email!");
    }
    else if (this.state.gpa > 4 || this.state.gpa < 0) {
      alert("Enter a valid GPA or leave it blank! (Between 0.0 and 4.0)");
    }
    else if (this.state.campusId != "" && this.props.allCampuses.find(campus => campus.id == this.state.campusId) === undefined) {
      alert("Enter a valid campus ID or leave it blank! (You can check all campuses for valid IDs)");
    }
    else {
      let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        imgUrl: this.state.imgUrl,
        gpa: this.state.gpa,
      };

      if (student.gpa === "") {
        student.gpa = null;
      }

      if (this.state.campusId) {
        student.campusId = this.state.campusId;
      }

      // Add new student in back-end database
      let newStudent = await this.props.addStudent(student);

      // Update state, and trigger redirect to show the new student
      this.setState({
        firstname: "", 
        lastname: "", 
        email: "",
        imgUrl: "",
        gpa: "",
        campusId: null, 
        redirect: true, 
        redirectId: newStudent.id
      });
    }
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
        />
      </div>          
    );
  }
}

const mapState = (state) => {
  return {
    allCampuses: state.allCampuses,  // Get the State object from Reducer "allCampuses"
  };
};

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(NewStudentContainer);