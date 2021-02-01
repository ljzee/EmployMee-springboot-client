import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import { Role } from '@/_helpers';
import {RadioButton, RadioButtonGroup} from '@/_components';
import { authenticationService } from '@/_services';

import './Signup.css';



class SignupPage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/dashboard');
        }
    }


    render() {
        return (
          <div className="row">
            <div className="col-md-6 offset-md-3">
                <h3>Sign Up</h3>
                <Formik
                    initialValues={{
                        email: '',
                        username: '',
                        password: '',
                        passwordConfirm: '',
                        radioGroup: ''
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Invalid email').required('Email is required'),
                        username: Yup.string().required('Username is required').min(8),
                        password: Yup.string().required('Password is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'}),
                        passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('You must confirm your password'),
                        radioGroup: Yup.string().required("You must select an account type")
                    })}
                    onSubmit={({ email, username, password, radioGroup }, { setStatus, setSubmitting }) => {
                        setStatus();
                        authenticationService.register(email, username, password, radioGroup)
                            .then(
                                user => {
                                    const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
                                    this.props.history.push(from);
                                }
                            ).catch(error => {
                                  setSubmitting(false);
                                  setStatus(error);
                            })


                    }}
                    render={({ values, errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="passwordConfirm">Confirm Password</label>
                                <Field name="passwordConfirm" type="password" className={'form-control' + (errors.passwordConfirm && touched.passwordConfirm ? ' is-invalid' : '')} />
                                <ErrorMessage name="passwordConfirm" component="div" className="invalid-feedback" />
                            </div>
                            <RadioButtonGroup
                              id="radioGroup"
                              value={values.radioGroup}
                              error={errors.radioGroup}
                              touched={touched.radioGroup}

                            >
                              <Field
                                component={RadioButton}
                                name="radioGroup"
                                id={Role.User}
                                label="Personal Account"
                              />
                              <Field
                                component={RadioButton}
                                name="radioGroup"
                                id={Role.Business}
                                label="Business Account"
                              />
                              <ErrorMessage name="radioGroup" component="div" className="invalid-feedback d-block"/>
                            </RadioButtonGroup>
                            <br />
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Sign Up</button>
                                {isSubmitting &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                            <div className='helper'>Already have an account? <Link to="login">Login</Link></div>
                            {status &&
                                <div className={'alert alert-danger'}>{status.map((msg, i) => <li key={i}>{msg}</li>)}</div>
                            }
                        </Form>
                    )}
                />
            </div>
          </div>
        )
    }
}

export { SignupPage };
