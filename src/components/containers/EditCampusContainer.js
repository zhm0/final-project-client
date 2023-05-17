/*==================================================
EditCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditCampusView from '../views/EditCampusView';
import { 
  editCampusThunk,
  fetchCampusThunk
} from '../../store/thunks';

class EditCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      name: '',
      address: '', 
      description: '', 
      imgUrl: '',
      id: '', 
      redirect: false, 
      redirectId: null,
      nameInput: '',
      addressInput: '',
      descriptionInput: '',
      imgUrlInput: '',
    };
  }

  // Get the specific campus data from back-end database
  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id);
    this.setState({
      name: this.props.campus.name,
      address: this.props.campus.address,
      description: this.props.campus.description,
      imgUrl: this.props.campus.imgUrl,
      id: this.props.campus.id
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

    let campus = {
      name: '',
      address: '',
      description: '',
      imgUrl: '',
      id: this.state.id
    }
    
    if (this.state.nameInput === '' && this.state.addressInput === '' && this.state.descriptionInput === '' && this.state.imgUrlInput === '') {
      alert("You must edit something otherwise go back!")
    }
    else if (!/\S/.test(this.state.nameInput) && this.state.nameInput !== '') {
      alert("You cannot just use spaces for name!")
    }
    else if (!/\S/.test(this.state.addressInput) && this.state.addressInput !== '') {
      alert("You cannot just use spaces for address!")
    }
    else if (!/\S/.test(this.state.descriptionInput) && this.state.descriptionInput !== '') {
      alert("You cannot just use spaces for description!")
    }
    else if (!/\S/.test(this.state.imgUrlInput) && this.state.imgUrlInput !== '') {
      alert("You cannot just use spaces for image URL!")
    }
    else {
      this.state.nameInput === '' ? campus.name = this.state.name : campus.name = this.state.nameInput;
      this.state.addressInput === '' ? campus.address = this.state.address : campus.address = this.state.addressInput;
      this.state.descriptionInput === '' ? campus.description = this.state.description : campus.description = this.state.descriptionInput;
      this.state.imgUrlInput === '' ? campus.imgUrl = this.state.imgUrl : campus.imgUrl = this.state.imgUrlInput;
    
      // Edit campus in back-end database
      await this.props.editCampus(campus);
      // Update state, and trigger redirect to show the new campus
      this.setState({
        name: '',
        address: '', 
        description: '', 
        imgUrl: '',
        id: '', 
        nameInput: '',
        addressInput: '',
        descriptionInput: '',
        imgUrlInput: '',
        redirect: true, 
        redirectId: campus.id
      });
    }
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render edit campus input form
  render() {
    // Redirect to edit campus's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditCampusView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}      
          currentCampus={this.props.campus}
        />
      </div>          
    );
  }
}
// The following 2 input arguments are passed to the "connect" function used by "CampusContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "campus".
const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
  };
};

const mapDispatch = (dispatch) => {
    return({
        fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
        editCampus: (campus) => dispatch(editCampusThunk(campus))
    })
}

// Export store-connected container by default
// EditCampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);