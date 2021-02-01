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
      jobTitle: '',
      companyAddresses: [],
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
                       jobTitle: jobPost.title,
                       companyAddresses: jobPost.addresses.map(address => ({label: `${address.street_name_no}, ${address.city}, ${address.state}`, value: address.id})),
                       companyName: jobPost.company_name,
                       companyPhoneNumber: jobPost.phone_number,
                       companyWebsite: jobPost.website,
                       resumeRequired: jobPost.resume_required,
                       coverletterRequired: jobPost.coverletter_required,
                       otherRequired: jobPost.other_required,
                       datePublished: jobPost.date_published,
                       deadline: jobPost.deadline,
                       description: jobPost.description,
                       duration: jobPost.duration,
                       openings: jobPost.openings,
                       positionType: jobPost.position_type,
                       salary: jobPost.salary,
                       status: jobPost.status,
                       jobAddress: jobPost.addresses.find(post => (post.id === jobPost.a_id))
                     })
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
                                       .then(()=>{this.fetchJobPost()})
                      }}>Stop Accepting Applicants</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.props.history.push(`${this.props.location.pathname}/applicants`, {id: this.props.location.state.id, title: this.state.jobTitle})}}>View Applicants</Dropdown.Item>
                     </DropdownButton>
    }else if(this.state.status === 'DRAFT'){
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                      <Dropdown.Item onClick={this.toggleEdit}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        businessService.updateJobPostStatus(this.props.location.state.id, JobPostType.Open)
                                       .then(()=>{this.fetchJobPost()})
                      }}>Publish Posting</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        businessService.deleteJobPost(this.props.location.state.id)
                                       .then(()=>{this.props.history.push('/managepostings')})
                      }}>Delete Posting</Dropdown.Item>
                     </DropdownButton>
    }else{
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                      <Dropdown.Item onClick={this.toggleEdit}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{
                        businessService.updateJobPostStatus(this.props.location.state.id, JobPostType.Open)
                                       .then(()=>{this.fetchJobPost()})
                      }}>Republish Posting</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.props.history.push(`${this.props.location.pathname}/applicants`, {id: this.props.location.state.id, title: this.state.jobTitle})}}>View Applicants</Dropdown.Item>
                     </DropdownButton>
    }
    return actionButton;
  }

  render(){

    const backButton = () => (<Link className="jobpostpage-backlink" to="/managepostings">Back to my postings</Link>);

    const jobPost = <JobPost
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
                      backButton={backButton}
                    />


        const positionTypeOptions = [
          { label: "Full-time", value: PositionType.Fulltime},
          { label: "Part-time", value: PositionType.Parttime},
          { label: "Temporary", value: PositionType.Temporary},
          { label: "Internship", value: PositionType.Internship},
        ];

        const editForm = <Formik
                          initialValues={{
                              jobtitle: this.state.jobTitle,
                              duration: this.state.duration,
                              positiontype: this.state.positionType,
                              location: this.state.jobAddress.id,
                              openings: this.state.openings,
                              jobdescription:this.state.description,
                              salary: this.state.salary,
                              deadline: this.state.deadline,
                              resumerequired:this.state.resumeRequired,
                              coverletterrequired: this.state.coverletterRequired,
                              otherrequired:this.state.otherRequired,
                          }}
                          validationSchema={Yup.object().shape({
                              jobtitle: Yup.string().required('Job title is required'),
                              duration: Yup.string().required('Duration is required'),
                              positiontype: Yup.string().required('Position type is required'),
                              location: Yup.string().required('Location is required'),
                              openings: Yup.number().positive('No. of openings must be greater than 0').required('No. of openings is required'),
                              jobdescription: Yup.string(),
                              salary: Yup.string(),
                              deadline: Yup.string(),
                              resumerequired: Yup.boolean().required('You must select whether resume is required'),
                              coverletterrequired: Yup.boolean().required('You must select whether cover letter is required'),
                              otherrequired: Yup.boolean().required('You must select whether other document is required'),
                          })}
                          onSubmit={({ jobtitle, duration, positiontype, location, openings, jobdescription, salary, deadline, resumerequired, coverletterrequired, otherrequired }, { setStatus, setSubmitting }) => {
                              setStatus();
                              businessService.updateJobPost(
                                                this.props.location.state.id,
                                                jobtitle,
                                                duration,
                                                positiontype,
                                                location,
                                                openings,
                                                jobdescription,
                                                salary,
                                                deadline,
                                                resumerequired,
                                                coverletterrequired,
                                                otherrequired
                                              )
                                             .then(()=>{
                                               this.props.history.replace(this.props.history.location.pathname, {...this.props.history.location.state, edit:false});
                                               this.toggleEdit();
                                               this.fetchJobPost();
                                             })

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
                                      <Card>
                                        <Card.Header>Job Title</Card.Header>
                                        <Card.Body>
                                          <Field name="jobtitle" type="text" className={'form-control' + (errors.jobtitle && touched.jobtitle ? ' is-invalid' : '')} />
                                          <ErrorMessage name="jobtitle" component="div" className="invalid-feedback" />
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
                                              <Field name="jobdescription" component="textarea" rows="5" className={'form-control' + (errors.jobdescription && touched.jobdescription ? ' is-invalid' : '')} />
                                              <ErrorMessage name="jobdescription" component="div" className="invalid-feedback" />
                                          </div>
                                        </Card.Body>
                                      </Card>

                                      <Card style={{overflow: "visible"}}>
                                        <Card.Header>Job Details</Card.Header>
                                        <Card.Body>
                                          <div className="form-group">
                                              <label htmlFor="positiontype">Position Type</label>
                                              <Select options={positionTypeOptions} onChange={(option)=>{
                                                setFieldValue("positiontype", option.value);
                                              }} onBlur={()=>setFieldTouched('positiontype', true)} />
                                              {errors.positiontype && touched.positiontype && (
                                                <div
                                                  style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                                                >
                                                  {errors.positiontype}
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
                                              <label htmlFor="location">Location</label>
                                              <Select options={this.state.companyAddresses} onChange={(option)=>{
                                                setFieldValue("location", option.value);
                                              }} onBlur={()=>setFieldTouched('location', true)}/>
                                              {errors.location && touched.location && (
                                                <div
                                                  style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                                                >
                                                  {errors.location}
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
                                          <RadioButtonGroup
                                            id="resumerequired"
                                            value={values.resumerequired}
                                            error={errors.resumerequired}
                                            touched={touched.resumerequired}
                                          >
                                            <label style={{display: "block"}} htmlFor="resumerequired">Resume required</label>
                                            <Field
                                              component={RadioButton}
                                              name="resumerequired"
                                              id="true"
                                              label="Yes"
                                            />
                                            <Field
                                              component={RadioButton}
                                              name="resumerequired"
                                              id="false"
                                              label="No"
                                            />
                                            <ErrorMessage name="resumerequired" component="div" className="invalid-feedback d-block"/>
                                          </RadioButtonGroup>
                                          <RadioButtonGroup
                                            id="coverletterrequired"
                                            value={values.coverletterrequired}
                                            error={errors.coverletterrequired}
                                            touched={touched.coverletterrequired}
                                          >
                                            <label style={{display: "block"}} htmlFor="coverletterrequired">Cover letter required</label>
                                            <Field
                                              component={RadioButton}
                                              name="coverletterrequired"
                                              id="true"
                                              label="Yes"
                                            />
                                            <Field
                                              component={RadioButton}
                                              name="coverletterrequired"
                                              id="false"
                                              label="No"
                                            />
                                            <ErrorMessage name="coverletterrequired" component="div" className="invalid-feedback d-block"/>
                                          </RadioButtonGroup>
                                          <RadioButtonGroup
                                            id="otherrequired"
                                            value={values.otherrequired}
                                            error={errors.otherrequired}
                                            touched={touched.otherrequired}
                                          >
                                            <label style={{display: "block"}} htmlFor="otherrequired">Other required</label>
                                            <Field
                                              component={RadioButton}
                                              name="otherrequired"
                                              id="true"
                                              label="Yes"
                                            />
                                            <Field
                                              component={RadioButton}
                                              name="otherrequired"
                                              id="false"
                                              label="No"
                                            />
                                            <ErrorMessage name="otherrequired" component="div" className="invalid-feedback d-block"/>
                                          </RadioButtonGroup>
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
