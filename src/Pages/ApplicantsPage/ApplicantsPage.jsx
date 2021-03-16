import React from 'react';
import './Applicants.css';
import {Card, Button, ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {businessService} from '@/_services';
import {ApplicantCard} from './ApplicantCard';
import {randomColor} from 'randomcolor';
import {ApplicationStatus} from '@/_helpers';

const applicantsFilter = ['New','Accepted','Saved','Rejected'];

class ApplicantsPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      filters: [],
      applicants: [],
      loading: true,
      applicantSearch: ''
    }

    this.toggleFilter = this.toggleFilter.bind(this);
    this.createFilterButtons = this.createFilterButtons.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchApplicants = this.fetchApplicants.bind(this);
  }

  fetchApplicants(){
    businessService.getJobApplicants(this.props.location.state.id)
                   .then(data => {
                     data.forEach(applicant => {applicant.color = randomColor(); return applicant})
                     this.setState({applicants: data, loading: false})})
                   .catch(error => {
                     alert("Unable to get applicants for job post. Please try again.")
                   });
  }

  componentDidMount(){
    this.fetchApplicants();
  }

  toggleFilter(filter){
    this.setState({filters: filter})
  }

  createFilterButtons(){
    return applicantsFilter.map((filter, index) => <ToggleButton key={index} variant="light" value={filter}>{filter}</ToggleButton>)
  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  getApplicantCardsByStatus(applicationStatus) {
    return this.state.applicants.filter(applicant => applicant.status === applicationStatus)
                                 .filter(applicant => {
                                   let fullName = `${applicant.firstName} ${applicant.lastName}`.toLowerCase()
                                   return fullName.includes(this.state.applicantSearch.toLowerCase());
                                 })
                                 .map(applicant => <ApplicantCard key={applicant.applicantId}
                                                                  aId={applicant.applicationId}
                                                                  jobId={this.props.location.state.id}
                                                                  id={applicant.applicantId}
                                                                  firstName={applicant.firstName}
                                                                  lastName={applicant.lastName}
                                                                  phoneNumber={applicant.phoneNumber}
                                                                  email={applicant.email}
                                                                  color={applicant.color}
                                                                  dateProcessed={applicant.dateProcessed}
                                                                  status={applicant.status}
                                                                  fetchApplicants={this.fetchApplicants}
                                                                  profileImage={applicant.profileImage}
                                                                  location={this.props.location}
                                                                  history={this.props.history}/>);
  }

  render(){
    let formattedJobTitle = this.props.location.state.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
    const link = <Link style={{color: "#007bff"}} to={{pathname: `/managepostings/${formattedJobTitle}`, state: {id: this.props.location.state.id, edit: false}}}>{this.props.location.state.title}</Link>

    return (
      <div>
        <h3 className="applicantspage-title"><Link style={{color: "black"}} to={{pathname: `/managepostings/${formattedJobTitle}`, state: {id: this.props.location.state.id, edit: false}}}>{this.props.location.state.title}</Link> - Applicants</h3>
        <div className="applicantspage-toggle">
          <FormControl
            placeholder="Search by name" value={this.state.applicantSearch} onChange={this.handleChange} name='applicantSearch'
          />
          <ToggleButtonGroup type="checkbox" onChange={this.toggleFilter}>
            {this.createFilterButtons()}
          </ToggleButtonGroup>
        </div>

        {(this.state.filters.includes('New') || !this.state.filters.length) &&
          <div>
            <h5 className="candidates-title">New Applicants</h5>
            <div className="candidates-container">
            {
              this.getApplicantCardsByStatus(ApplicationStatus.New)
            }
            </div>
          </div>
        }

        {(this.state.filters.includes('Accepted') || !this.state.filters.length) &&
          <div>
            <h5 className="candidates-title">Accepted Applicants</h5>
            <div className="candidates-container">
            {
              this.getApplicantCardsByStatus(ApplicationStatus.Accepted)
            }
            </div>
          </div>
        }

        {(this.state.filters.includes('Saved') || !this.state.filters.length) &&
          <div>
            <h5 className="candidates-title">Saved Applicants</h5>
            <div className="candidates-container">
            {
              this.getApplicantCardsByStatus(ApplicationStatus.Saved)
            }
            </div>
          </div>
        }

        {(this.state.filters.includes('Rejected') || !this.state.filters.length) &&
          <div>
            <h5 className="candidates-title">Rejected Applicants</h5>
            <div className="candidates-container">
            {
              this.getApplicantCardsByStatus(ApplicationStatus.Rejected)
            }
            </div>
          </div>
        }

      </div>
    )
  }
}

export {ApplicantsPage}
