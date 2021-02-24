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
    businessService.getBusinessAddresses()
                   .then(addresses => {
                     let options = addresses.map(address => ({
                       label: `${address.streetNameNo}, ${address.city}, ${address.state}`,
                       value: address.id
                     }));
                     this.setState({locationOptions: options});
                   }).catch(error => {
                     console.log(error);
                   });

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
                  title: '',
                  duration: '',
                  positionType: '',
                  addressId: '',
                  openings: '',
                  description:'',
                  salary: '',
                  deadline: '',
                  resumeRequired: false,
                  coverletterRequired: false,
                  otherRequired: false,
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
                  let status;
                  if(submissionTypeRef.current === 'publish'){
                    status = JobPostType.Open;
                  }else{
                    status = JobPostType.Draft;
                  }

                  businessService.addJobPost(title, duration, positionType, addressId, openings, description, salary, deadline, resumeRequired, coverletterRequired, otherRequired, status)
                                 .then(()=>{this.props.history.push('/managepostings')})
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
              render={({ values, errors, status, touched, isSubmitting, setFieldTouched, setFieldValue, handleSubmit}) => (
                    <Form>
                        {status &&
                            <div className={'alert alert-danger'}>{status.message}</div>
                        }
                        <div className="form-group">
                            <label htmlFor="title">Job Title</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration</label>
                            <Field name="duration" type="text" className={'form-control' + (errors.duration && touched.duration ? ' is-invalid' : '')} />
                            <ErrorMessage name="duration" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="positionType">Position Type</label>
                            <Select options={positionTypeOptions} onChange={(option)=>{
                              setFieldValue("positionType", option.value);
                            }} onBlur={()=>setFieldTouched('positionType', true)} />
                            {errors.positionType && touched.positionType && (
                              <div
                                style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                              >
                                {errors.positionType}
                              </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="addressId">Location</label>
                            <Select options={this.state.locationOptions} onChange={(option)=>{
                              setFieldValue("addressId", option.value);
                            }} onBlur={()=>setFieldTouched('addressId', true)} />
                            {errors.addressId && touched.addressId && (
                              <div
                                style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                              >
                                {errors.addressId}
                              </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="openings">Number of Openings</label>
                            <Field name="openings" type="number" className={'form-control' + (errors.openings && touched.openings ? ' is-invalid' : '')} />
                            <ErrorMessage name="openings" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Job Description</label>
                            <Field name="description" component="textarea" rows="5" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                            <ErrorMessage name="description" component="div" className="invalid-feedback" />
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

                        <div style={{textAlign: "right"}}>
                          <Button type="submit" onClick={() => { submissionTypeRef.current = 'save'}} variant="primary" className="edit-button" >Save As Draft</Button>
                          <Button type="submit" onClick={() => { submissionTypeRef.current = 'publish'}} variant="primary" className="edit-button" >Publish Posting</Button>
                        </div>
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
