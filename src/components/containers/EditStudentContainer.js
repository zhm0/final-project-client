/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's 'connect' function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditStudentView from '../views/EditStudentView';
import { 
  editStudentThunk,
  fetchStudentThunk,
  fetchAllCampusesThunk
} from '../../store/thunks';

class EditStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: '', 
      lastname: '',
      email: '',
      imgUrl: '',
      gpa: '',
      campusId: '', 
      id: '',
      redirect: false, 
      redirectId: null,
      firstnameInput: '', 
      lastnameInput: '',
      emailInput: '',
      imgUrlInput: '',
      gpaInput: '',
      campusIdInput: ''
    };
  }

  // Get the specific student data and all campuses from back-end database
  componentDidMount() {
    // Get student ID and all campuses from URL (API link)
    this.props.fetchStudent(this.props.match.params.id);
    this.props.fetchAllCampuses();
    this.setState({
      firstname: this.props.student.firstname,
      lastname: this.props.student.lastname,
      email: this.props.student.email,
      imgUrl: this.props.student.imgUrl,
      gpa: this.props.student.gpa,
      campusId: this.props.student.campusId,
      id: this.props.student.id
    })
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

    let student = {
      firstname: '',
      lastname: '',
      email: '',
      imgUrl: '',
      id: this.state.id
    }
    
    if (this.state.firstnameInput === '' && this.state.lastnameInput === '' && this.state.emailInput === '' && this.state.gpaInput === '' && this.state.imgUrlInput === '' && this.state.campusIdInput  === '') {
        alert('You must edit something otherwise go back!');
    }
    else if (this.state.emailInput !== '' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.emailInput)) {
        alert('That is not a valid email!');
    }
    else if (this.state.gpaInput !== '' && (this.state.gpa > 4 || this.state.gpa < 0)) {
        alert('Enter a valid GPA or leave it blank! (Between 0.0 and 4.0)');
    }
    else if (this.state.campusIdInput !== '' && this.props.allCampuses.find(campus => campus.id == this.state.campusIdInput) === undefined) {
        alert('Enter a valid campus ID or leave it blank! (You can check all campuses for valid IDs)');
    }
    else {
  
      if (this.state.campusIdInput) {
        student.campusId = this.state.campusIdInput;
      }

      if (this.state.gpaInput) {
        student.gpa = this.state.gpaInput;
      }
      this.state.firstnameInput === '' ? student.firstname = this.state.firstname : student.firstname = this.state.firstnameInput;
      this.state.lastnameInput === '' ? student.lastname = this.state.lastname : student.lastname = this.state.lastnameInput;
      this.state.emailInput === '' ? student.email = this.state.email : student.email = this.state.emailInput
      this.state.imgUrlInput === '' ? student.imgUrl = this.state.imgUrl : student.imgUrl = this.state.imgUrlInput;
    
      // Edit student in back-end database
      await this.props.editStudent(student);
      // Update state, and trigger redirect to show the new student
      this.setState({
        firstname: '', 
        lastname: '',
        email: '',
        imgUrl: '',
        gpa: '',
        campusId: '', 
        firstnameInput: '', 
        lastnameInput: '',
        emailInput: '',
        imgUrlInput: '',
        gpaInput: '',
        redirect: true, 
        redirectId: this.props.student.id
      });
    }
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render edit student input form
  render() {
    // Redirect to edit student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}      
          currentStudent={this.props.student}
        />
      </div>          
    );
  }
}
// The following 2 input arguments are passed to the 'connect' function used by 'CampusContainer' component to connect to Redux Store.
// 1. The 'mapState' argument specifies the data from Redux Store that the component needs.
// The 'mapState' is called when the Store State changes, and it returns a data object of 'campus'.
const mapState = (state) => {
  return {
    student: state.student,  // Get the State object from Reducer 'campus'
    allCampuses: state.allCampuses
  };
};

const mapDispatch = (dispatch) => {
    return({
        fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
        editStudent: (student) => dispatch(editStudentThunk(student)),
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    })
}

// Export store-connected container by default
// EditStudentContainer uses 'connect' function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);