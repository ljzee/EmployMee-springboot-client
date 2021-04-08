import React from 'react';
import {Link} from 'react-router-dom';
import {Spinner, Card, Button, Row, Col, Form, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FForm } from 'formik';
import * as Yup from 'yup';
import profileicon from '../../Images/profile-icon.png'
import {ExperienceCard} from './ExperienceCard';
import { ImagePicker, FilePicker } from 'react-file-picker';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import config from 'config';
import {Can} from '@/_components';

import './Profile.css';

import { authenticationService, userService } from '@/_services';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
          showModal: false,
          editAboutMe: false,
          editContactInformation: false,
          firstName: '',
          lastName: '',
          aboutMe: '',
          email: '',
          phoneNumber: '',
          personalWebsite: '',
          githubLink: '',
          experiences: [],
          education: [],
          profileImage: '',
          previewProfileImage: '',
          isLoading: true,
          profileOwnerId: (this.props.location.state ? this.props.location.state.id : authenticationService.currentUserValue.id)
        }

        this.toggleEditAboutMe = this.toggleEditAboutMe.bind(this);
        this.toggleEditContactInformation = this.toggleEditContactInformation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.toggleShowModal = this.toggleShowModal.bind(this);
        this.fetchProfile = this.fetchProfile.bind(this);
        this.setPreviewProfileImage = this.setPreviewProfileImage.bind(this);
    }

    fetchProfile(){
      userService.getProfile(this.state.profileOwnerId)
      .then(profile =>{
        this.setState(prevState => ({
          ...prevState,
          firstName: profile.firstName,
          lastName: profile.lastName,
          aboutMe: profile.bio,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          personalWebsite: profile.personalWebsite,
          githubLink: profile.githubLink,
          experiences: profile.experiences,
          profileImage: profile.profileImage,
          isLoading:false,
          previewProfileImage: ''
        }))
      })
    }

    componentDidMount(){
      this.fetchProfile();
    }

    toggleShowModal(){
      this.setState(prevState => ({
        ...prevState,
        showModal: !prevState.showModal
      }))
    }

    toggleEditAboutMe(){
      this.setState(prevState => ({
        ...prevState,
        editAboutMe: !prevState.editAboutMe
      }))
    }

    toggleEditContactInformation(){
      this.setState(prevState => ({
        ...prevState,
        editContactInformation: !prevState.editContactInformation
      }))
    }

    setPreviewProfileImage(image){
      this.setState({
        previewProfileImage: image
      })
    }

    //Since react recycle events, event will be nullified before calling the asynchronous method this.setState(), must use event.persist
    //https://reactjs.org/docs/events.html#event-pooling
    handleChange(event){
      event.persist();

      this.setState(prevState => ({
        ...prevState,
        [event.target.name]: event.target.value
      }))

    }

    handleFileSelect(event){
      console.log(event.target.files[0]);
    }

    render() {

        if(this.state.isLoading) return(

          <div className="profile-page mx-auto">
            <Row>
              <Col xs={12} sm={12} md={{span: 7, offset: 5}} lg={{span: 9, offset: 3}} style={{marginBottom: 0}}>
                <h3 className="profile-page-title">My Profile</h3>
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          </div>
        )

        return (
          <div className="profile-page mx-auto">
            <Row>
              <Can
                role={authenticationService.currentUserValue.role}
                perform="user-profile-page:edit"
                data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                yes={()=>(
                  <Col xs={12} sm={12} md={5} lg={3}>
                  </Col>
                )}
              />
              <Can
                role={authenticationService.currentUserValue.role}
                perform="user-profile-page:visit"
                data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                yes={()=>(
                  <Col xs={12} sm={12} md={5} lg={3}>
                    <Link to='' onClick={(e)=>{e.preventDefault; this.props.history.goBack()}}>Back to applicants</Link>
                  </Col>
                )}
              />
              <Col xs={12} sm={12} md={7} lg={9} style={{marginBottom: 0}}>
                <Can
                  role={authenticationService.currentUserValue.role}
                  perform="user-profile-page:edit"
                  data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                  yes={()=>(<h3 className="profile-page-title">My Profile</h3>)}
                />
                <Can
                  role={authenticationService.currentUserValue.role}
                  perform="user-profile-page:visit"
                  data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                  yes={()=>(<h3 className="profile-page-title">{this.state.firstName} {this.state.lastName}'s Profile</h3>)}
                />
              </Col>
            </Row>

            <Row >
              <Col xs={12} sm={12} md={5} lg={3}>
                <Card >
                  <Card.Header>Personal</Card.Header>
                  <Card.Body>
                    <Can
                      role={authenticationService.currentUserValue.role}
                      perform="user-profile-page:edit"
                      data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                      yes={()=>(<div className="welcome-message">Welcome back, {this.state.firstName}!</div>)}
                    />
                    {this.state.profileImage && <Card.Img className="profile-image" variant="top" src={(this.state.previewProfileImage === '' ? this.state.profileImage : this.state.previewProfileImage)}/>}
                    {!this.state.profileImage && <Card.Img className="profile-image" variant="top" src={(this.state.previewProfileImage === '' ? profileicon : this.state.previewProfileImage)}/>}

                    <Can
                      role={authenticationService.currentUserValue.role}
                      perform="user-profile-page:edit"
                      data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                      yes={()=>(
                        <React.Fragment>
                          {(this.state.previewProfileImage === "") &&
                          <ImagePicker
                            extensions={['jpg', 'jpeg', 'png']}
                            dims={{minWidth: 100, maxWidth: 1000, minHeight: 100, maxHeight: 1000}}
                            onChange={image=>{
                              this.setPreviewProfileImage(image);
                            }}
                            onError={error=>{
                              console.log(error);
                            }}
                          >
                            <Button variant="link" className="image-picker">Upload a photo</Button>
                          </ImagePicker>}
                          {(this.state.previewProfileImage !== "") &&
                            <Button variant="link" className="image-picker" onClick={() => {
                              userService.uploadProfileImage(this.state.previewProfileImage)
                                         .then(()=>{this.fetchProfile()})
                                         .catch((error) => {
                                           alert("Unable to upload profile image. Please try again.")
                                         });
                            }}>
                              Upload
                            </Button>
                          }
                         </React.Fragment>
                      )}
                    />

                    <div className="contact-info">
                      <div className="contact-info-title">Contact Info</div>
                      <p><span className="contact-info-label">Email:</span><br/>{this.state.email}</p>
                      <p><span className="contact-info-label">Phone Number:</span><br/>{this.state.phoneNumber}</p>
                      <p><span className="contact-info-label">Website:</span><br/><a style={{color: "#007BFF"}} href=''>{this.state.personalWebsite}</a></p>
                      <p><span className="contact-info-label">Github:</span><br/><a style={{color: "#007BFF"}} href=''>{this.state.githubLink}</a></p>
                    </div>
                  </Card.Body>
                </Card>

                <Can
                  role={authenticationService.currentUserValue.role}
                  perform="user-profile-page:edit"
                  data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                  yes={()=>(<Card>
                            <Card.Header>Account Settings</Card.Header>
                            <Card.Body>
                              <Button className="setting-button" variant="link">Change Password</Button>
                              <Button className="setting-button" variant="link">Delete Account</Button>
                            </Card.Body>
                           </Card>)}
                />

              </Col>

              <Col xs={12} sm={12} md={7} lg={9}>
                <Card className="profile-page-card">
                  <Card.Header>About Me</Card.Header>

                    {!this.state.editAboutMe &&
                      <Card.Body>
                        <Card.Text>
                          {!this.state.aboutMe && <Can
                            role={authenticationService.currentUserValue.role}
                            perform="user-profile-page:edit"
                            data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                            yes={()=>(<span className="aboutme-helper-message">Write a bio so employers can know you better...</span>)}
                          />}
                          {!this.state.aboutMe && <Can
                            role={authenticationService.currentUserValue.role}
                            perform="user-profile-page:visit"
                            data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                            yes={()=>(<span className="aboutme-helper-message">{this.state.firstName} has not written a bio yet...</span>)}
                          />}
                          {this.state.aboutMe}
                        </Card.Text>

                        <Can
                          role={authenticationService.currentUserValue.role}
                          perform="user-profile-page:edit"
                          data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                          yes={()=>(<Button variant="link" className="float-right" onClick={this.toggleEditAboutMe}>Edit</Button>)}
                        />

                      </Card.Body>
                    }
                    {this.state.editAboutMe &&
                      <Card.Body>
                        <Form>
                          <Form.Group>
                            <Form.Control as="textarea" value={this.state.aboutMe} name="aboutMe" onChange={this.handleChange} rows="5"/>
                          </Form.Group>
                        </Form>
                        <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEditAboutMe}>Cancel</Button>
                        <Button variant="primary" className="edit-button float-right" onClick={()=>{
                          userService.updateProfile(this.state.aboutMe, this.state.phoneNumber, this.state.personalWebsite, this.state.githubLink)
                                     .then(()=>{
                                       this.toggleEditAboutMe();
                                       this.fetchProfile();
                                     })
                                     .catch(error=>{
                                       alert("Unable to update profile. Please try again.")
                                     });
                        }
                        }>Save</Button>
                      </Card.Body>
                    }
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>
                    Experience
                    <Can
                      role={authenticationService.currentUserValue.role}
                      perform="user-profile-page:edit"
                      data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                      yes={()=>(<Button variant="outline-success" className="add-button float-right" onClick={this.toggleShowModal}>+</Button>)}
                    />
                  </Card.Header>
                  <ListGroup className="list-group-flush">
                    {this.state.experiences.map((experience) => <ExperienceCard key={experience.id}
                                                                                experience_id={experience.id}
                                                                                companyName={experience.companyName}
                                                                                title={experience.title}
                                                                                location={experience.location}
                                                                                description={experience.description}
                                                                                startDate={experience.startDate}
                                                                                endDate={experience.endDate}
                                                                                fetchProfile={this.fetchProfile}
                                                                                profileOwnerId={this.state.profileOwnerId}/>)}
                  </ListGroup>
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>Education
                  <Can
                    role={authenticationService.currentUserValue.role}
                    perform="user-profile-page:edit"
                    data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                    yes={()=>(<Button variant="outline-success" className="add-button float-right" >+</Button>)}
                  />
                  </Card.Header>
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>
                      <Row>
                        <Col className="duration" xs={12} s={12} md={12} lg={2}>
                          <span>{'2019/03'}</span>
                          <span>-</span>
                          <span>{'2013/09'}</span>
                        </Col>
                        <Col xs={12} s={12} md={12} lg={8}>
                          <p><b>Simon Fraser University</b></p>
                          <p>Burnaby, BC</p>
                          <p><b>Bachelors Of Science, Computer Science</b></p>
                          <p><b>GPA: </b>3.3</p>
                          <p><b>Description: </b>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus augue id erat dictum vehicula. Suspendisse blandit, nibh nec malesuada rutrum, nulla ipsum euismod magna, id sodales odio mi at arcu. Quisque ultrices elit blandit, euismod purus id, congue turpis.</p>
                        </Col>
                        <Col xs={12} s={12} md={12} lg={2} style={{padding: 0}}>
                          <Can
                            role={authenticationService.currentUserValue.role}
                            perform="user-profile-page:edit"
                            data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                            yes={()=>(
                              <React.Fragment>
                                <Button variant="link" className="card-button">Delete</Button>
                                <Button variant="link" className="card-button">Edit</Button>
                              </React.Fragment>
                            )}
                          />
                        </Col>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>Contact Information</Card.Header>
                  {!this.state.editContactInformation &&
                    <Card.Body>
                      <Can
                        role={authenticationService.currentUserValue.role}
                        perform="user-profile-page:edit"
                        data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                        yes={()=>(<Button variant="link" className="float-right" onClick={this.toggleEditContactInformation}>Edit</Button>)}
                      />
                      <p><b>Email:</b> {this.state.email}</p>
                      <p><b>Phone Number:</b> {this.state.phoneNumber}</p>
                      <p><b>Personal Website:</b> <a href=''>{this.state.personalWebsite}</a></p>
                      <p><b>Github:</b> <a href=''>{this.state.githubLink}</a></p>
                    </Card.Body>
                  }

                  {this.state.editContactInformation &&
                    <Card.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label><b>Phone Number:</b> </Form.Label>
                          <Form.Control type="text" value={this.state.phoneNumber} name='phoneNumber' onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label><b>Personal Website:</b> </Form.Label>
                          <Form.Control type="text" value={this.state.personalWebsite} name='personalWebsite' onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label><b>Github:</b> </Form.Label>
                          <Form.Control type="text" value={this.state.githubLink} name='githubLink' onChange={this.handleChange} />
                        </Form.Group>
                      </Form>
                      <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEditContactInformation}>Cancel</Button>
                      <Button variant="primary" className="edit-button float-right" onClick={()=>{
                        userService.updateProfile(this.state.aboutMe, this.state.phoneNumber, this.state.personalWebsite, this.state.githubLink)
                                   .then(()=>{
                                     this.toggleEditContactInformation();
                                     this.fetchProfile();
                                   })
                                   .catch(error=>console.log(error))
                      }}>Save</Button>
                    </Card.Body>
                  }
                </Card>

                </Col>
              </Row>

              <Modal show={this.state.showModal} onHide={this.toggleShowModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Add a work experience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Formik
                    initialValues={{
                      companyName: '',
                      title: '',
                      location: '',
                      description: '',
                      startDate: '',
                      endDate: ''
                    }}
                    validationSchema={Yup.object().shape({
                        companyName: Yup.string().required('Company is required'),
                        title: Yup.string().required('Title is required'),
                        location: Yup.string().required('Location is required'),
                        description: Yup.string(),
                        startDate: Yup.string().required('Start date is required'),
                        endDate: Yup.string()
                    })}
                    onSubmit={({companyName, title, location, description, startDate, endDate}, { setStatus, setFieldError, setSubmitting }) => {
                      userService.addExperience(companyName, title, location, startDate, endDate, description).then(()=>{
                        this.fetchProfile();
                        this.toggleShowModal();
                      }).catch(error => {
                            setSubmitting(false);
                            if(error.subErrors) {
                              error.generalErrors = error.subErrors.filter(error => (!error.hasOwnProperty("field")));
                            }
                            setStatus(error);
                            if(error.subErrors) {
                              error.subErrors.forEach(subError => {
                                if(subError.field && subError.message) {
                                  setFieldError(subError.field, subError.message);
                                }
                              });
                            } else {
                              alert("Unable to add experience. Please try again.");
                            }
                      });
                    }}
                    render={({ values, errors, status, touched, isSubmitting, setFieldValue, setFieldTouched }) => {
                      let statusContents;
                      if(status && status.generalErrors) {
                        const hasGeneralErrors = status.generalErrors.length > 0;
                        statusContents = <div className={'alert alert-danger'}>
                                          {status.message}
                                          {hasGeneralErrors &&
                                          <ul>
                                            {status.generalErrors.map(error => (<li>{error.message}</li>))}
                                          </ul>}
                                        </div>;
                      }

                      return <FForm>
                        {statusContents}
                          <div className="form-group">
                              <label htmlFor="companyName"><b>Company:</b></label>
                              <Field name="companyName" type="text" className={'form-control' + (errors.companyName && touched.companyName ? ' is-invalid' : '')} />
                              <ErrorMessage name="companyName" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                              <label htmlFor="title"><b>Title:</b></label>
                              <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                              <ErrorMessage name="title" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                              <label htmlFor="location"><b>Location:</b></label>
                              <Field name="location" type="text" className={'form-control' + (errors.location && touched.location ? ' is-invalid' : '')} />
                              <ErrorMessage name="location" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                              <label className="date-label" htmlFor="startDate"><b>Start Date:</b></label>
                              <DatePicker name="startDate" value={values.startDate}
                                onChange={(date) =>{
                                  setFieldValue("startDate",date.toISOString().split("T")[0])
                                }}
                                onBlur={()=>setFieldTouched('startDate', true)}
                              />
                              {errors.startDate && touched.startDate && (
                                <div
                                  style={{ color: "#dc3545", marginTop: ".10rem", fontSize:"80%" }}
                                >
                                  {errors.startDate}
                                </div>
                              )}
                          </div>
                          <div className="form-group">
                              <label className="date-label" htmlFor="endDate"><b>End Date:</b></label>
                              <DatePicker name="endDate" value={values.endDate}
                                onChange={(date) =>{
                                  setFieldValue("endDate",date.toISOString().split("T")[0])
                                }}
                              />
                          </div>
                          <div className="form-group">
                              <label htmlFor="description"><b>Description:</b></label>
                              <Field name="description" rows="5" component="textarea" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                              <ErrorMessage name="description" component="div" className="invalid-feedback" />
                          </div>
                          <br />
                          <div className="form-group" style={{textAlign: "right"}}>
                            <Button variant="secondary" className="edit-button" onClick={this.toggleShowModal}>
                              Close
                            </Button>
                            <Button variant="primary" className="edit-button" type="submit">
                              Add Experience
                            </Button>
                          </div>
                      </FForm>
                    }}
                />
                </Modal.Body>

              </Modal>
            </div>
        )
    }
}

export { ProfilePage };
