import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Button, Row, Col, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import './CreateProfile.css';
import Select from 'react-select';
import {LocationPicker} from '@/_components';

import { authenticationService, userService, businessService } from '@/_services';

class CreateProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          currentUser: authenticationService.currentUserValue
        }

    }

    render() {

        const {currentUser} = this.state;

        const userForm =   <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                phoneNumber: '',
                                personalWebsite: '',
                                githubLink: '',
                                bio: ''
                            }}
                            validationSchema={Yup.object().shape({
                                firstName: Yup.string().required('First name is required'),
                                lastName: Yup.string().required('Last name is required'),
                                phoneNumber: Yup.string(),
                                personalWebsite: Yup.string(),
                                githubLink: Yup.string(),
                                bio: Yup.string()
                            })}
                            onSubmit={({ firstName, lastName, phoneNumber, personalWebsite, githubLink, bio }, { setStatus, setFieldError, setSubmitting }) => {
                                setStatus();
                                userService.createProfile(firstName, lastName, phoneNumber, personalWebsite, githubLink, bio)
                                    .then(
                                      result=>{
                                        const currentUser = authenticationService.currentUserValue;
                                        const { from } = this.props.location.state || { from: { pathname: `/dashboard` } };
                                        this.props.history.push(from);
                                      }
                                    ).catch(error => {
                                          setSubmitting(false);
                                          setStatus(error);
                                          if(error.subErrors) {
                                            error.subErrors.forEach(subError => {
                                              if(subError.field && subError.message) {
                                                setFieldError(subError.field, subError.message);
                                              }
                                            });
                                          }
                                    })
                            }}
                            render={({ errors, status, touched, isSubmitting }) => (
                              <div>
                              <Card className="card">
                                <Card.Body>
                                  <div className="alert alert-info">
                                      <strong>Note: </strong>You will have a chance to change this information in the future!<br />
                                  </div>
                                  <Form>
                                      {status &&
                                          <div className={'alert alert-danger'}>{status.message}</div>
                                      }
                                      <div className="form-group">
                                          <label htmlFor="firstName">First Name</label>
                                          <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                          <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="lastName">Last Name</label>
                                          <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                          <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="phoneNumber">Phone Number (Optional)</label>
                                          <Field name="phoneNumber" type="text" className={'form-control' + (errors.phoneNumber && touched.phoneNumber ? ' is-invalid' : '')} />
                                          <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="personalWebsite">Personal Website (Optional)</label>
                                          <Field name="personalWebsite" type="text" className={'form-control' + (errors.personalWebsite && touched.personalWebsite ? ' is-invalid' : '')} />
                                          <ErrorMessage name="personalWebsite" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="githubLink">Github Link (Optional)</label>
                                          <Field name="githubLink" type="text" className={'form-control' + (errors.githubLink && touched.githubLink ? ' is-invalid' : '')} />
                                          <ErrorMessage name="githubLink" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="bio">Add a quick bio!</label>
                                          <Field name="bio" component="textarea" rows="5" className={'form-control' + (errors.bio && touched.bio ? ' is-invalid' : '')} />
                                          <ErrorMessage name="bio" component="div" className="invalid-feedback" />
                                      </div>
                                      <div style={{textAlign: "right"}}>
                                        <Button type="submit" variant="primary" className="edit-button" >Create Profile</Button>
                                      </div>
                                  </Form>
                                  </Card.Body>
                                </Card>
                              </div>
                            )}
                        />


        const businessForm = <Formik
                                initialValues={{
                                    companyname: '',
                                    phoneNumber: '',
                                    website: '',
                                    description: '',
                                    country: '',
                                    region: '',
                                    city: '',
                                    streetaddress: '',
                                    postalcode: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    companyname: Yup.string().required('Company name is required'),
                                    phoneNumber: Yup.string(),
                                    website: Yup.string(),
                                    description: Yup.string(),
                                    country: Yup.string().required('Country is required'),
                                    region: Yup.string().required('State is required'),
                                    city: Yup.string().required('City is required'),
                                    streetaddress: Yup.string().required('Street address is required'),
                                    postalcode: Yup.string().required('Postal code is required')
                                })}
                                onSubmit={({ companyname, phoneNumber, website, description, country, region, city, streetaddress, postalcode}, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    businessService.createProfile(companyname, country, region, city, streetaddress, postalcode, phoneNumber, website, description)
                                                   .then(()=>{
                                                     const { from } = this.props.location.state || { from: { pathname: `/dashboard` } };
                                                     this.props.history.push(from);
                                                   }).catch(error =>{
                                                     setSubmitting(false);
                                                     setStatus(error);
                                                   });
                                }}
                                render={({ errors, status, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                                  <div>
                                  <Card className="card">
                                    <Card.Body>
                                      <div className="alert alert-info">
                                          <strong>Note: </strong>You will have a chance to change this information in the future!<br />
                                      </div>
                                      <Form>
                                          <div className="form-group">
                                              <label htmlFor="companyname">Company Name</label>
                                              <Field name="companyname" type="text" className={'form-control' + (errors.companyname && touched.companyname ? ' is-invalid' : '')} />
                                              <ErrorMessage name="companyname" component="div" className="invalid-feedback" />
                                          </div>
                                          <LocationPicker setFieldValue={setFieldValue}>
                                          {({countryOptions, regionOptions, cityOptions, country, region, city, handleChange}) => (
                                            <React.Fragment>
                                              <div className="form-group">
                                                <label htmlFor="country">Country</label>
                                                <Select
                                                  onChange={handleChange}
                                                  options={countryOptions}
                                                  name="country"
                                                  onBlur={()=>setFieldTouched("country", true)}
                                                  value={country}
                                                />
                                                {errors.country && touched.country && (
                                                  <div
                                                    style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                                                  >
                                                    {errors.country}
                                                  </div>
                                                )}
                                              </div>

                                              <div className="form-group">
                                                <label htmlFor="region">State</label>
                                                <Select
                                                  onChange={handleChange}
                                                  options={regionOptions}
                                                  name="region"
                                                  onBlur={()=>setFieldTouched("region", true)}
                                                  value={region}
                                                />
                                                {errors.region && touched.region && (
                                                  <div
                                                    style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                                                  >
                                                    {errors.region}
                                                  </div>
                                                )}
                                              </div>

                                              <div className="form-group">
                                                <label htmlFor="city">City</label>
                                                <Select
                                                  onChange={handleChange}
                                                  options={cityOptions}
                                                  name="city"
                                                  onBlur={()=>setFieldTouched("city", true)}
                                                  value={city}
                                                />
                                                {errors.city && touched.city && (
                                                  <div
                                                    style={{ color: "#dc3545", marginTop: ".25rem", fontSize:"80%" }}
                                                  >
                                                    {errors.city}
                                                  </div>
                                                )}
                                              </div>
                                            </React.Fragment>
                                          )}
                                          </LocationPicker>
                                          <div className="form-group">
                                              <label htmlFor="streetaddress">Street Address</label>
                                              <Field name="streetaddress" type="text" className={'form-control' + (errors.streetaddress && touched.streetaddress ? ' is-invalid' : '')} />
                                              <ErrorMessage name="streetaddress" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="postalcode">Postal Code</label>
                                              <Field name="postalcode" type="text" className={'form-control' + (errors.postalcode && touched.postalcode ? ' is-invalid' : '')} />
                                              <ErrorMessage name="postalcode" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="phoneNumber">Phone Number (Optional)</label>
                                              <Field name="phoneNumber" type="text" className={'form-control' + (errors.phoneNumber && touched.phoneNumber ? ' is-invalid' : '')} />
                                              <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="website">Website (Optional)</label>
                                              <Field name="website" type="text" className={'form-control' + (errors.website && touched.website ? ' is-invalid' : '')} />
                                              <ErrorMessage name="website" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="description">Description (Optional)</label>
                                              <Field name="description" component="textarea" rows="5" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                              <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                          </div>
                                          <div style={{textAlign: "right"}}>
                                          <Button type="submit" variant="primary" className="edit-button" >Create Profile</Button>
                                          </div>
                                          {status &&
                                              <div className={'alert alert-danger'} style={{marginTop: "15px"}}>{status.map((msg, i) => <li key={i}>{msg}</li>)}</div>
                                          }
                                      </Form>
                                      </Card.Body>
                                    </Card>
                                  </div>
                                )}
                            />


        return (
            <div className="create-profile-page">
              <h3 className="title">Tell us more before you start...</h3>
                {currentUser.role === 'USER' && userForm}
                {currentUser.role === 'BUSINESS' && businessForm}
            </div>
        )
    }
}


/*                                          <div className="form-group">
                                            <label htmlFor="country">Country</label>
                                            <Select/>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="state">State</label>
                                            <Select/>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <Select/>
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="streetaddress">Street Address</label>
                                              <Field name="companyname" type="text" className={'form-control' + (errors.companyname && touched.companyname ? ' is-invalid' : '')} />
                                          </div>
                                          */
export { CreateProfilePage };
