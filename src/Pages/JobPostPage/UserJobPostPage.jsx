import React from 'react';

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Col, Row, Card, Button, DropdownButton, Dropdown, Badge, Spinner, Modal, Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import JobPost from './JobPost';
import ApplicationModal from './ApplicationModal';
import {userService, fileService} from '@/_services';
import Select from 'react-select';
import {JobPostType} from '@/_helpers';
import {DocumentType} from '@/_helpers';

import './JobPost.css'

class UserJobPostPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      jobTitle: '',
      companyName: '',
      companyPhoneNumber: '',
      companyWebsite: '',
      resumeRequired: false,
      coverletterRequired: false,
      otherRequired: false,
      datePublished: '',
      deadline: '',
      description: '',
      duration: '',
      openings: 0,
      positionType: '',
      salary: '',
      status: '',
      jobAddress: '',
      businessId : '',
      applied: false,
      bookmarked: false,
      showApplicationModal: false
    }

    this.fetchJobPost = this.fetchJobPost.bind(this);
    this.getActionButton = this.getActionButton.bind(this);
    this.getStatusBadge = this.getStatusBadge.bind(this);
    this.toggleShowApplyModal = this.toggleShowApplyModal.bind(this);
  }

  componentDidMount(){
    this.fetchJobPost();
  }

  toggleShowApplyModal(){
    this.setState((prevState)=>{
      return {
        showApplicationModal: !prevState.showApplicationModal
      }
    })
  }

  getStatusBadge(){
    let statusBadge;
    if(this.state.status === 'OPEN'){
      statusBadge = <Badge style={{fontSize: "15px"}} variant="success">Active</Badge>
    }else if(this.state.status === 'DRAFT'){
      statusBadge = <Badge style={{fontSize: "15px"}} variant="warning">Draft</Badge>
    }else{
      statusBadge = <Badge style={{fontSize: "15px"}} variant="danger">Closed</Badge>
    }
    return statusBadge
  }

  getActionButton(){

    let actionButton;
    if(this.state.applied){
      actionButton = <Button variant="success" className="float-right" disabled>Applied</Button>
    }else if(this.state.status === JobPostType.Closed){
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right" disabled/>
    }else{
      let bookmarkText = this.state.bookmarked ? 'Unbookmark Job' : "Bookmark Job";

      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                      <Dropdown.Item onClick={()=>{this.toggleShowApplyModal()}}>Apply</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        userService.toggleBookmark(this.props.location.state.id)
                                   .then(() => {
                                     this.setState((prevState) => ({
                                       bookmarked: !prevState.bookmarked
                                     }));
                                    }
                                   )
                                   .catch(() => {
                                    alert("Unable to toggle bookmark. Please try again.");
                                   });
                      }}>{bookmarkText}
                      </Dropdown.Item>
                     </DropdownButton>
    }
    return actionButton;

  }

  fetchJobPost() {
    userService.getJobPost(this.props.location.state.id)
               .then(jobPost => {
                 const jobAddress = jobPost.jobAddresses.length ? jobPost.jobAddresses[0] : null;

                 this.setState({
                   loading: false,
                   jobTitle: jobPost.title,
                   companyName: jobPost.companyName,
                   companyPhoneNumber: jobPost.companyPhoneNumber,
                   companyWebsite: jobPost.companyWebsite,
                   resumeRequired: jobPost.resumeRequired,
                   coverletterRequired: jobPost.coverletterRequired,
                   otherRequired: jobPost.otherRequired,
                   datePublished: jobPost.datePublished,
                   deadline: jobPost.deadline,
                   description: jobPost.description,
                   duration: jobPost.duration,
                   openings: jobPost.openings,
                   positionType: jobPost.positionType,
                   salary: jobPost.salary,
                   status: jobPost.status,
                   applied:jobPost.applied,
                   jobAddress: jobAddress,
                   businessId: jobPost.companyId,
                   bookmarked: jobPost.bookmarked
                 });
               });
  }

  render(){
    if(this.state.loading) return(

      <div className="profile-page mx-auto">
        <Row>
          <Col md={{offset:3, span:9}} style={{marginBottom: 0}}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </div>
    )

    const backButton = ()=>(<a href="javascript:void(0)" className="jobpostpage-backlink" onClick={this.props.history.goBack}>Back to job search</a>)

    return(
      <React.Fragment>
        <JobPost
          getActionButton={this.getActionButton}
          getStatusBadge={this.getStatusBadge}
          jobTitle={this.state.jobTitle}
          status={this.state.status}
          companyName={this.state.companyName}
          jobAddress={this.state.jobAddress}
          resumeRequired={this.state.resumeRequired}
          coverletterRequired={this.state.coverletterRequired}
          otherRequired={this.state.otherRequired}
          deadline={this.state.deadline}
          description={this.state.description}
          positionType={this.state.positionType}
          duration={this.state.duration}
          openings={this.state.openings}
          salary={this.state.salary}
          companyWebsite={this.state.companyWebsite}
          companyPhoneNumber={this.state.companyPhoneNumber}
          datePublished={this.state.datePublished}
          businessId={this.state.businessId}
          location={this.props.location}
          backButton={backButton}
        />

        {this.state.showApplicationModal &&
        <ApplicationModal
          resumeRequired={this.state.resumeRequired}
          coverletterRequired={this.state.coverletterRequired}
          otherRequired={this.state.otherRequired}
          toggleShowApplyModal={this.toggleShowApplyModal}
          location={this.props.location}
          fetchJobPost={this.fetchJobPost}
          jobTitle={this.state.jobTitle}
        />}
      </React.Fragment>
    )
  }
}

export {UserJobPostPage};
