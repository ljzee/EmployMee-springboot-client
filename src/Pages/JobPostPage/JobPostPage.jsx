import React from 'react';

import {Formik, Form, Field, ErrorMessage} from 'formik';
import {Col, Row, Card, Button, DropdownButton, Dropdown, Spinner, Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {RadioButton, RadioButtonGroup} from '@/_components';
import DatePicker from 'react-datepicker';
import Select from 'react-select'
import {PositionType} from '@/_helpers';
import {businessService} from '@/_services';
import * as Yup from 'yup';
import JobPost from './JobPost';
import {JobPostType} from '@/_helpers';

import './JobPost.css'

class JobPostPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      edit: this.props.location.state.edit,
      title: '',
      locationOptions: [],
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
      jobAddress: ''
    }
    this.toggleEdit = this.toggleEdit.bind(this);
    this.getStatusBadge = this.getStatusBadge.bind(this);
    this.fetchJobPost = this.fetchJobPost.bind(this);
    this.getActionButton = this.getActionButton.bind(this)
  }

  componentDidMount(){
    this.fetchJobPost();
  }

  fetchJobPost() {
    businessService.getJobPost(this.props.location.state.id)
                   .then(jobPost => {
                     this.setState({
                       loading: false,
                       title: jobPost.title,
                       locationOptions: jobPost.businessAddresses.map(address => ({label: `${address.streetNameNo}, ${address.city}, ${address.state}`, value: address.id})),
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
                       jobAddress: jobPost.jobAddresses.length ? jobPost.jobAddresses[0] : null
                     });
                   })
  }

  toggleEdit(){
    this.setState((prevState, prevProps) => {
      return {
        edit: !prevState.edit
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
    if(this.state.status === 'OPEN'){
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                      <Dropdown.Item onClick={this.toggleEdit}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        businessService.updateJobPostStatus(this.props.location.state.id, JobPostType.Closed)
                                       .then(()=>{
                                         this.fetchJobPost();
                                       })
                                       .catch(error => {
                                         alert("Unable to update job post status. Please try again.");
                                       });
                      }}>Stop Accepting Applicants</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.props.history.push(`${this.props.location.pathname}/applicants`, {id: this.props.location.state.id, title: this.state.title})}}>View Applicants</Dropdown.Item>
                     </DropdownButton>
    }else if(this.state.status === 'DRAFT'){
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                      <Dropdown.Item onClick={this.toggleEdit}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        businessService.updateJobPostStatus(this.props.location.state.id, JobPostType.Open)
                                       .then(()=>{
                                         this.fetchJobPost();
                                       })
                                       .catch(error => {
                                         alert("Unable to update job post status. Please try again.");
                                       });
                      }}>Publish Posting</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        businessService.deleteJobPost(this.props.location.state.id)
                                       .then(()=>{
                                         this.props.history.push('/managepostings');
                                       })
                                       .catch(error => {
                                         alert("Unable to delete job post. Please try again.");
                                       });
                      }}>Delete Posting</Dropdown.Item>
                     </DropdownButton>
    }else{
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                      <Dropdown.Item onClick={this.toggleEdit}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        businessService.updateJobPostStatus(this.props.location.state.id, JobPostType.Open)
                                       .then(()=>{
                                         this.fetchJobPost();
                                       })
                                       .catch(error => {
                                         alert("Unable to update job post status. Please try again.");
                                       });
                      }}>Republish Posting</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.props.history.push(`${this.props.location.pathname}/applicants`, {id: this.props.location.state.id, title: this.state.title})}}>View Applicants</Dropdown.Item>
                     </DropdownButton>
    }
    return actionButton;
  }

  render(){

    const backButton = () => (<Link className="jobpostpage-backlink" to="/managepostings">Back to my postings</Link>);

    const jobPost = <JobPost
                      getActionButton={this.getActionButton}
                      getStatusBadge={this.getStatusBadge}
                      title={this.state.title}
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
                      backButton={backButton}
                    />


        const positionTypeOptions = [
          { label: "Full-time", value: PositionType.Fulltime},
          { label: "Part-time", value: PositionType.Parttime},
          { label: "Temporary", value: PositionType.Temporary},
          { label: "Internship", value: PositionType.Internship},
        ];

        const selectedPositionTypeOption = positionTypeOptions.find(option => {
            return option.value === this.state.positionType;
        });

        let selectedLocationOption;
        if(this.state.jobAddress) {
          selectedLocationOption = this.state.locationOptions.find(option => {
            return option.value === this.state.jobAddress.id;
          });
        }

        const editForm = <Formik
                          initialValues={{
                              title: this.state.title,
                              duration: this.state.duration,
                              positionType: this.state.positionType,
                              addressId: this.state.jobAddress.id,
                              openings: this.state.openings,
                              description:this.state.description,
                              salary: this.state.salary,
                              deadline: this.state.deadline,
                              resumeRequired:this.state.resumeRequired,
                              coverletterRequired: this.state.coverletterRequired,
                              otherRequired:this.state.otherRequired,
                          }}
                          validationSchema={Yup.object().shape({
                              title: Yup.string().required('Job title is required'),
                              duration: Yup.string().required('Duration is required'),
                              positionType: Yup.string().required('Position type is required'),
                              addressId: Yup.string().required('Location is required'),
                              openings: Yup.number().positive('No. of openings must be greater than 0').required('No. of openings is required'),
                              description: Yup.string(),
                              salary: Yup.string(),
                              deadline: Yup.string(),
                              resumeRequired: Yup.boolean().required('You must select whether resume is required'),
                              coverletterRequired: Yup.boolean().required('You must select whether cover letter is required'),
                              otherRequired: Yup.boolean().required('You must select whether other document is required')
                          })}
                          onSubmit={({ title, duration, positionType, addressId, openings, description, salary, deadline, resumeRequired, coverletterRequired, otherRequired }, { setStatus, setFieldError, setSubmitting }) => {
                              setStatus();

                              businessService.updateJobPost(
                                                this.props.location.state.id,
                                                title,
                                                duration,
                                                positionType,
                                                addressId,
                                                openings,
                                                description,
                                                salary,
                                                deadline,
                                                resumeRequired,
                                                coverletterRequired,
                                                otherRequired
                                              )
                                             .then(()=>{
                                               this.props.history.replace(this.props.history.location.pathname, {...this.props.history.location.state, edit:false});
                                               this.toggleEdit();
                                               this.fetchJobPost();
                                             })
                                             .catch(error => {
                                                   setSubmitting(false);
                                                   setStatus(error);
                                                   if(error.subErrors) {
                                                     error.subErrors.forEach(subError => {
                                                       if(subError.field && subError.message) {
                                                         setFieldError(subError.field, subError.message);
                                                       }
                                                     });
                                                   }
                                             });

                          }}
                          render={({values, errors, status, touched, isSubmitting, setFieldTouched, setFieldValue, handleSubmit}) =>(
                            <Form>
                              <div className="jobpostpage mx-auto">
                                <Row>
                                  <Col md={3}>
                                    <Link to="/managepostings" >Back to my postings</Link>
                                  </Col>

                                  <Col md={9}>
                                      <h3 className="jobpostpage-header">Edit Job Posting</h3>
                                      {status &&
                                          <div className={'alert alert-danger'}>{status.message}</div>
                                      }
                                      <Card>
                                        <Card.Header>Job Title</Card.Header>
                                        <Card.Body>
                                          <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                          <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                        </Card.Body>
                                      </Card>
                                  </Col>
                                </Row>

                                <Row>
                                  <Col md={{offset: 3, span:9}}>
                                      <Card>
                                        <Card.Header>Job Description</Card.Header>
                                        <Card.Body>
                                          <div className="form-group">
                                              <Field name="description" component="textarea" rows="5" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                              <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                          </div>
                                        </Card.Body>
                                      </Card>

                                      <Card style={{overflow: "visible"}}>
                                        <Card.Header>Job Details</Card.Header>
                                        <Card.Body>
                                          <div className="form-group">
                                              <label htmlFor="positionType">Position Type</label>
                                              <Select options={positionTypeOptions}
                                                      onChange={(option)=>{
                                                        setFieldValue("positionType", option.value);
                                                      }}
                                                      onBlur={()=>setFieldTouched('positionType', true)}
                                                      defaultValue={selectedPositionTypeOption} />
                                              {errors.positionType && touched.positionType && (
                                                <div
                                                  style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                                                >
                                                  {errors.positionType}
                                                </div>
                                              )}
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="duration">Duration</label>
                                              <Field name="duration" type="text" className={'form-control' + (errors.duration && touched.duration ? ' is-invalid' : '')} />
                                              <ErrorMessage name="duration" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="openings">Number of Openings</label>
                                              <Field name="openings" type="number" className={'form-control' + (errors.openings && touched.openings ? ' is-invalid' : '')} />
                                              <ErrorMessage name="openings" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="salary">Salary</label>
                                              <Field name="salary" type="text" className={'form-control' + (errors.salary && touched.salary ? ' is-invalid' : '')} />
                                              <ErrorMessage name="salary" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="addressId">Location</label>
                                              <Select options={this.state.locationOptions}
                                                      onChange={(option)=>{
                                                        setFieldValue("addressId", option.value);
                                                      }}
                                                      onBlur={()=>{
                                                        setFieldTouched('addressId', true)
                                                      }}
                                                      defaultValue={selectedLocationOption}/>
                                              {errors.addressId && touched.addressId && (
                                                <div
                                                  style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                                                >
                                                  {errors.addressId}
                                                </div>
                                              )}
                                          </div>
                                        </Card.Body>
                                      </Card>

                                      <Card style={{overflow: "visible"}}>
                                        <Card.Header>Application Information</Card.Header>
                                        <Card.Body>
                                          <div className="form-group">
                                              <label htmlFor="deadline">Deadline</label>
                                              <div>
                                              <DatePicker name="deadline" value={values.deadline}
                                                onChange={(date) =>{
                                                  setFieldValue("deadline",date.toISOString().split("T")[0])
                                                }}
                                                onBlur={()=>setFieldTouched('deadline', true)}
                                              />
                                              {errors.deadline && touched.deadline && (
                                                <div
                                                  style={{ color: "#dc3545", marginTop: ".10rem", fontSize:"80%" }}
                                                >
                                                  {errors.deadline}
                                                </div>
                                              )}
                                              </div>
                                          </div>

                                          <div className="radio-group">
                                            <label style={{display: "block"}} htmlFor="resumeRequired">Resume required</label>
                                            <label className="radio-button">
                                              <Field type="radio" name="resumeRequired" checked={values.resumeRequired} onChange={() => {setFieldValue("resumeRequired", true);}}/>
                                              Yes
                                            </label>
                                            <label className="radio-button">
                                              <Field type="radio" name="resumeRequired" checked={!values.resumeRequired} onChange={() => {setFieldValue("resumeRequired", false);}}/>
                                              No
                                            </label>
                                          </div>
                                          <ErrorMessage name="resumeRequired" component="div" className="invalid-feedback d-block"/>

                                          <div className="radio-group">
                                            <label style={{display: "block"}} htmlFor="coverletterRequired">Coverletter required</label>
                                            <label className="radio-button">
                                              <Field type="radio" name="coverletterRequired" checked={values.coverletterRequired} onChange={() => {setFieldValue("coverletterRequired", true);}}/>
                                              Yes
                                            </label>
                                            <label className="radio-button">
                                              <Field type="radio" name="coverletterRequired" checked={!values.coverletterRequired} onChange={() => {setFieldValue("coverletterRequired", false);}}/>
                                              No
                                            </label>
                                          </div>
                                          <ErrorMessage name="coverletterRequired" component="div" className="invalid-feedback d-block"/>

                                          <div className="radio-group">
                                            <label style={{display: "block"}} htmlFor="otherRequired">Other required</label>
                                            <label className="radio-button">
                                              <Field type="radio" name="otherRequired" checked={values.otherRequired} onChange={() => {setFieldValue("otherRequired", true);}}/>
                                              Yes
                                            </label>
                                            <label className="radio-button">
                                              <Field type="radio" name="otherRequired" checked={!values.otherRequired} onChange={() => {setFieldValue("otherRequired", false);}}/>
                                              No
                                            </label>
                                          </div>
                                          <ErrorMessage name="otherRequired" component="div" className="invalid-feedback d-block"/>
                                        </Card.Body>
                                      </Card>

                                      <div style={{textAlign: "right"}}>
                                          <Button variant="secondary" className="loat-right" onClick={this.toggleEdit}>Cancel</Button>
                                          <Button type="submit" variant="primary" style={{marginLeft: "10px"}} className="float-right">Save</Button>
                                      </div>
                                  </Col>
                                </Row>
                              </div>
                            </Form>
                          )}
                        />


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

    return(
      (this.state.edit ? editForm : jobPost)
    )
  }
}

export {JobPostPage};
