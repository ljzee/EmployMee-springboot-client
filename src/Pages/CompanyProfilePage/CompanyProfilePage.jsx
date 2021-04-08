import React from 'react';
import {Row, Col, Card, Button, Form, ListGroup, Spinner} from 'react-bootstrap';
import {Can} from '@/_components';
import {Link} from 'react-router-dom';
import { ImagePicker, FilePicker } from 'react-file-picker';
import { authenticationService, userService } from '@/_services';
import profileicon from '../../Images/profile-icon.png'
import {businessService} from '@/_services';
import {Role} from '@/_helpers';
import {Formik, Form as FForm, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import './CompanyProfile.css';

class CompanyProfilePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      companyName: '',
      aboutUs: '',
      profileImage: '',
      website: '',
      phoneNumber: '',
      addresses: [],
      jobs: [],
      updates: [],
      previewProfileImage: '',
      companyUpdate: '',
      profileOwnerId: (this.props.location.state ? this.props.location.state.id : authenticationService.currentUserValue.id),
      editAboutUs: false,
      editContactInformation: false
    }

    this.setPreviewProfileImage = this.setPreviewProfileImage.bind(this);
    this.toggleEditAboutUs = this.toggleEditAboutUs.bind(this);
    this.toggleEditContactInformation = this.toggleEditContactInformation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchProfile = this.fetchProfile.bind(this);
  }

  componentDidMount(){
    this.fetchProfile();
  }

  setPreviewProfileImage(image){
    this.setState({
      previewProfileImage: image
    })
  }

  toggleEditAboutUs(){
    this.setState(prevState => ({
      ...prevState,
      editAboutUs: !prevState.editAboutUs
    }))
  }

  toggleEditContactInformation(){
    this.setState(prevState => ({
      ...prevState,
      editContactInformation: !prevState.editContactInformation
    }))
  }

  handleChange(event){
    event.persist();

    this.setState(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))

  }

  fetchProfile(){
    businessService.getProfile(this.state.profileOwnerId)
                   .then((data)=>{
                     this.setState({
                       isLoading: false,
                       companyName: data.companyName,
                       aboutUs: data.description,
                       profileImage: data.profileImage,
                       website: data.website,
                       phoneNumber: data.phoneNumber,
                       addresses: data.addresses,
                       jobs: data.jobPosts,
                       updates: data.updates,
                       previewProfileImage: '',
                       editAboutUs: false,
                       editContactInformation: false,
                     })
                   })
  }

  render(){

    if(this.state.isLoading) return(

      <div className="profile-page mx-auto">
        <Row>
          <Col xs={12} sm={12} md={{span: 7, offset: 5}} lg={{span: 9, offset: 3}} style={{marginBottom: 0}}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </div>
    )

    return(
      <div className="business-profile-page mx-auto">
      <Row>
        <Can
          role={authenticationService.currentUserValue.role}
          perform="business-profile-page:edit"
          data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
          yes={()=>(
            <Col xs={12} sm={12} md={5} lg={3}>
            </Col>
          )}
        />
        <Can
          role={authenticationService.currentUserValue.role}
          perform="business-profile-page:visit"
          data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
          yes={()=>(
            <Col xs={12} sm={12} md={5} lg={3}>
              <Link to='' onClick={(e)=>{e.preventDefault; this.props.history.goBack()}}>Back to previous page</Link>
            </Col>
          )}
        />
        <Col xs={12} sm={12} md={7} lg={9} style={{marginBottom: 0}}>
          <Can
            role={authenticationService.currentUserValue.role}
            perform="business-profile-page:edit"
            data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
            yes={()=>(
              <div className="business-profile-page-title">
                <h3>{this.state.companyName}</h3>
                {this.state.addresses[0] && <div className="business-profile-page-title-address">{`${this.state.addresses[0].streetNameNo}, ${this.state.addresses[0].city}, ${this.state.addresses[0].state}, ${this.state.addresses[0].country}`}</div>}
              </div>
            )}
          />
          <Can
            role={authenticationService.currentUserValue.role}
            perform="business-profile-page:visit"
            data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
            yes={()=>(
              <div className="business-profile-page-title">
                <h3>{this.state.companyName}</h3>
                {this.state.addresses[0] && <div className="business-profile-page-title-address">{`${this.state.addresses[0].streetNameNo}, ${this.state.addresses[0].city}, ${this.state.addresses[0].state}, ${this.state.addresses[0].country}`}</div>}
              </div>
            )}
          />
        </Col>
      </Row>


      <Row>
        <Col xs={12} sm={12} md={5} lg={3}>
          <Card >
            <Card.Header>Company</Card.Header>
            <Card.Body>
              {this.state.profileImage && <Card.Img className="business-profile-image" variant="top" src={(this.state.previewProfileImage === '' ? this.state.profileImage : this.state.previewProfileImage)}/>}
              {!this.state.profileImage && <Card.Img className="business-profile-image" variant="top" src={(this.state.previewProfileImage === '' ? profileicon : this.state.previewProfileImage)}/>}

              <Can
                role={authenticationService.currentUserValue.role}
                perform="business-profile-page:edit"
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
                        businessService.uploadProfileImage(this.state.previewProfileImage)
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
                <p><span className="contact-info-label">Phone Number:</span><br/>{this.state.phoneNumber}</p>
                <p><span className="contact-info-label">Website:</span><br/><a style={{color: "#007BFF"}} href=''>{this.state.website}</a></p>
              </div>
            </Card.Body>
          </Card>
          <Can
            role={authenticationService.currentUserValue.role}
            perform="business-profile-page:edit"
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
            <Card.Header>About Us</Card.Header>

              {!this.state.editAboutUs &&
                <Card.Body>
                  <Card.Text>
                    {!this.state.aboutUs && <span className="aboutme-helper-message">Write a bio so applicants can know your company better...</span>}
                    {this.state.aboutUs}
                  </Card.Text>

                  <Can
                    role={authenticationService.currentUserValue.role}
                    perform="business-profile-page:edit"
                    data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                    yes={()=>(<Button variant="link" className="float-right" onClick={this.toggleEditAboutUs}>Edit</Button>)}
                  />

                </Card.Body>
              }
              {this.state.editAboutUs &&
                <Card.Body>
                  <Form>
                    <Form.Group>
                      <Form.Control as="textarea" value={this.state.aboutUs} name="aboutUs" onChange={this.handleChange} rows="5"/>
                    </Form.Group>
                  </Form>
                  <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEditAboutUs}>Cancel</Button>
                  <Button variant="primary" className="edit-button float-right" onClick={()=>{
                    businessService.updateProfile(this.state.phoneNumber, this.state.website, this.state.aboutUs)
                                   .then(()=>{this.fetchProfile();})
                                   .catch(error => {
                                     alert("Unable to update profile. Please try again.");
                                   });
                  }
                  }>Save</Button>
                </Card.Body>
              }
          </Card>

          <Card>
            <Card.Header>
            Company Updates
            </Card.Header>
            <Can
              role={authenticationService.currentUserValue.role}
              perform="business-profile-page:edit"
              data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
              yes={()=>(
                <Card.Body>
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{
                      content: ''
                    }}
                    validationSchema={Yup.object().shape({
                      content: Yup.string().required('You must write something...'),
                    })}
                    onSubmit={({content},{setStatus, setSubmitting, resetForm, setFieldError})=>{
                      setStatus();
                      businessService.addUpdate(content)
                                     .then(()=>{
                                       resetForm();
                                       this.fetchProfile()})
                                     .catch(error => {
                                           setSubmitting(false);
                                           setStatus(error);
                                           if(error.subErrors) {
                                             error.subErrors.forEach(subError => {
                                               if(subError.field && subError.message) {
                                                 setFieldError(subError.field, subError.message);
                                               }
                                             });
                                           } else {
                                             alert("Unable to add update. Please try again.");
                                           }
                                     });
                    }}
                    render={({errors, status,touched, isSubmitting})=>(
                      <FForm>
                        <div className="form-group">
                            <Field placeholder="Let people know what's going on at your company!" name="content" component="textarea" rows="4" className={'form-control' + (errors.content && touched.content ? ' is-invalid' : '')} />
                            <ErrorMessage name="content" component="div" className="invalid-feedback" />
                        </div>
                        <Button variant="primary" type="submit" className="edit" className="edit-button float-right">Post</Button>
                      </FForm>
                    )}
                  />
                </Card.Body>
              )}
            />
            <ListGroup className="list-group-flush">
              {this.state.updates.map(update => {
                let datePosted = new Date(update.datePosted);

                return <ListGroup.Item className="company-update" key={update.id}>
                  <div>
                    <Can
                      role={authenticationService.currentUserValue.role}
                      perform="business-profile-page:edit"
                      data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                      yes={()=>(
                        <Button variant="link" className="float-right" onClick={()=>{
                          businessService.deleteUpdate(update.id)
                                         .then(()=>{this.fetchProfile()})
                                         .catch((error) => {
                                           alert("Unable to delete update. Please try again.");
                                         });
                        }}>Delete</Button>
                      )}
                    />
                    <div className="company-update-header"><img src={(this.state.profileImage ? this.state.profileImage : profileicon)} /><span className="company-update-date">{datePosted.toLocaleString()}</span></div>
                    <div className="company-update-content">
                    {update.content}
                    </div>
                  </div>
                </ListGroup.Item>
              })}
            </ListGroup>
          </Card>

          <Card>
            <Card.Header>Company Openings
            <Can
              role={authenticationService.currentUserValue.role}
              perform="business-profile-page:edit"
              data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
              yes={()=>(
                <Link style={{color: '#007bff'}}className="float-right" to='/managepostings'>View my jobs</Link>
              )}
            />
            </Card.Header>
            <div className="business-profile-job-container">
              {this.state.jobs.map(job=>(
                <a key={job.id} onClick={(e)=>{
                  e.preventDefault();
                  let formattedJobTitle = job.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
                  let route = (authenticationService.currentUserValue.role === Role.Business ? 'managepostings' : 'searchjobs');
                  this.props.history.push(`/${route}/${formattedJobTitle}`, {id: job.id, edit: false});
                }} className="business-profile-job-container-job">
                  <div className="job-title">{job.title}</div>
                  <div className="job-location">{`${job.jobAddresses[0].city}, ${job.jobAddresses[0].state}`}</div>
                </a>
              ))}
            </div>
          </Card>

          <Card className="profile-page-card">
            <Card.Header>Contact Information</Card.Header>
            {!this.state.editContactInformation &&
              <Card.Body>
                <Can
                  role={authenticationService.currentUserValue.role}
                  perform="business-profile-page:edit"
                  data={{userId: authenticationService.currentUserValue.id, profileOwnerId: this.state.profileOwnerId}}
                  yes={()=>(<Button variant="link" className="float-right" onClick={this.toggleEditContactInformation}>Edit</Button>)}
                />
                <p><span className="contact-info-label">Phone Number:</span> {this.state.phoneNumber}</p>
                <p><span className="contact-info-label">Website:</span> <a href=''>{this.state.website}</a></p>
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
                    <Form.Label><b>Website:</b> </Form.Label>
                    <Form.Control type="text" value={this.state.website} name='website' onChange={this.handleChange} />
                  </Form.Group>
                </Form>
                <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEditContactInformation}>Cancel</Button>
                <Button variant="primary" className="edit-button float-right" onClick={()=>{
                  businessService.updateProfile(this.state.phoneNumber, this.state.website, this.state.aboutUs)
                                 .then(()=>{this.fetchProfile();})
                                 .catch(error => {
                                   alert("Unable to update profile. Please try again.");
                                 });
                }}>Save</Button>
              </Card.Body>
            }
          </Card>
        </Col>
      </Row>

      </div>
    )
  }
}

export {CompanyProfilePage}
