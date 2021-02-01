import React from 'react';
import './ManagePostings.css'
import {Card, Button} from 'react-bootstrap';
import {Formik, Form, Field, ErrorMessage} from 'formik'
import Select from 'react-select'
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import {RadioButton, RadioButtonGroup} from '@/_components';
import {PositionType, JobPostType} from '@/_helpers';
import {businessService, authenticationService} from '@/_services';
//Yup converts types to boolean

class AddPostingPage extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      locationOptions: []
    }
  }

  componentDidMount(){
    businessService.getProfile(authenticationService.currentUserValue.id)
                   .then(profile=>{
                     let options = profile.addresses.map(address => ({label: `${address.street_name_no}, ${address.city}, ${address.state}`, value: address.id}))
                     this.setState({locationOptions: options})
                   }).catch(error=>{
                     console.log(error);
                   })
  }

  render(){

    const positionTypeOptions = [
      { label: "Full-time", value: PositionType.Fulltime},
      { label: "Part-time", value: PositionType.Parttime},
      { label: "Temporary", value: PositionType.Temporary},
      { label: "Internship", value: PositionType.Internship},
    ];

    const submissionTypeRef = React.createRef()

    return(
      <div className="addposting-page mx-auto">
        <h3 className="addposting-page-title">Add a new job posting...</h3>
        <Card>
          <Card.Body>
            <Formik
              initialValues={{
                  jobtitle: '',
                  duration: '',
                  positiontype: '',
                  location: '',
                  openings: '',
                  jobdescription:'',
                  salary: '',
                  deadline: '',
                  resumerequired:'',
                  coverletterrequired: '',
                  otherrequired:'',
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
                  let status;
                  if(submissionTypeRef.current === 'publish'){
                    status = JobPostType.Open;
                  }else{
                    status = JobPostType.Draft;
                  }
                  businessService.addJobPost(jobtitle, duration, positiontype, location, openings, jobdescription, salary, deadline, resumerequired, coverletterrequired, otherrequired, status)
                                 .then(()=>{this.props.history.push('/managepostings')})
                                 .catch(error=>{
                                   setSubmitting(false);
                                   setStatus(error);
                                 })

              }}
              render={({ values, errors, status, touched, isSubmitting, setFieldTouched, setFieldValue, handleSubmit}) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="jobtitle">Job Title</label>
                            <Field name="jobtitle" type="text" className={'form-control' + (errors.jobtitle && touched.jobtitle ? ' is-invalid' : '')} />
                            <ErrorMessage name="jobtitle" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration</label>
                            <Field name="duration" type="text" className={'form-control' + (errors.duration && touched.duration ? ' is-invalid' : '')} />
                            <ErrorMessage name="duration" component="div" className="invalid-feedback" />
                        </div>
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
                            <label htmlFor="location">Location</label>
                            <Select options={this.state.locationOptions} onChange={(option)=>{
                              setFieldValue("location", option.value);
                            }} onBlur={()=>setFieldTouched('location', true)} />
                            {errors.location && touched.location && (
                              <div
                                style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                              >
                                {errors.location}
                              </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="openings">Number of Openings</label>
                            <Field name="openings" type="number" className={'form-control' + (errors.openings && touched.openings ? ' is-invalid' : '')} />
                            <ErrorMessage name="openings" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="jobdescription">Job Description</label>
                            <Field name="jobdescription" component="textarea" rows="5" className={'form-control' + (errors.jobdescription && touched.jobdescription ? ' is-invalid' : '')} />
                            <ErrorMessage name="jobdescription" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="salary">Salary</label>
                            <Field name="salary" type="text" className={'form-control' + (errors.salary && touched.salary ? ' is-invalid' : '')} />
                            <ErrorMessage name="salary" component="div" className="invalid-feedback" />
                        </div>
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
                          <label style={{display: "block"}} htmlFor="otherrequired">Other document required</label>
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
                        <div style={{textAlign: "right"}}>
                          <Button type="submit" onClick={() => { submissionTypeRef.current = 'save'}} variant="primary" className="edit-button" >Save As Draft</Button>
                          <Button type="submit" onClick={() => { submissionTypeRef.current = 'publish'}} variant="primary" className="edit-button" >Publish Posting</Button>
                        </div>
                        {status &&
                            <div className={'alert alert-danger'} style={{marginTop: "15px"}}>{status.map((msg, i) => <li key={i}>{msg}</li>)}</div>
                        }
                    </Form>
              )}
            />

          </Card.Body>
        </Card>
      </div>
    )
  }
}

export {AddPostingPage};
