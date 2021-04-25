import React from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Col, Row, Card, Button, DropdownButton, Dropdown, Badge, Spinner, Modal, Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {userService, fileService} from '@/_services';
import Select from 'react-select';
import {DocumentType} from '@/_helpers';

class ApplicationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isApplying: false,
      isApplied: false,
      files: []
    }
  }

  componentDidMount(){
    this.fetchUserFiles();
  }

  fetchUserFiles() {
    fileService.getAllUserFiles()
               .then(files => {
                 this.setState({
                   files: files,
                   isLoading: false
                 });
               });
  }

  getDocumentOptions(documentType) {
    let options = this.state.files.filter(file => (file.type === documentType))
                                  .map(file => ({label: file.fileName, value: file.id}));
    return options;
  }

  getInitialValues() {
    return {
      'resume': '',
      'coverletter': '',
      'other': ''
    };
  }

  buildValidation() {
    let validationObject = {};

    if(this.props.resumeRequired) {
      validationObject['resume'] = Yup.string().required('Resume is required');
    } else {
      validationObject['resume'] = Yup.string();
    }

    if(this.props.coverletterRequired) {
      validationObject['coverletter'] = Yup.string().required('Coverletter is required');
    } else {
      validationObject['coverletter'] = Yup.string();
    }

    if(this.props.otherRequired) {
      validationObject['other'] = Yup.string().required('Other is required');
    } else {
      validationObject['other'] = Yup.string();
    }

    return Yup.object().shape(validationObject);
  }

  render() {
    return (
      <Modal show={true} onHide={this.props.toggleShowApplyModal}>
        {this.state.isLoading &&
          <React.Fragment>
            <Modal.Header closeButton>
              <Modal.Title>Select your documents</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Modal.Body>
          </React.Fragment>}
        {(!this.state.isLoading && !this.state.isApplied) &&
          <React.Fragment>
            <Modal.Header closeButton>
              <Modal.Title>Select your documents</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                onSubmit={(values)=>{
                  let documents = [];
                  if(values.resume){
                    documents.push(values.resume);
                  }
                  if(values.coverletter){
                    documents.push(values.coverletter);
                  }
                  if(values.other){
                    documents.push(values.other);
                  }
                  userService.submitApplication(this.props.location.state.id, documents)
                             .then(()=>{
                               this.setState({
                                 isApplied: true
                               });
                               this.props.fetchJobPost();
                             })
                             .catch(error => {
                               alert("Unable to submit application for job post. Please try again.");
                               this.setState({isApplying: false});
                             });
                  this.setState({isApplying: true});
                }}
                initialValues={this.getInitialValues()}
                validationSchema={this.buildValidation()}
                render={({
                  values,
                  touched,
                  errors,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                  setFieldValue,
                  setFieldTouched
                })=>(
                  <Form>
                    <Alert style={{fontSize: "0.85rem", marginBottom: "30px"}} variant="primary">Once you submit your application, your documents and profile will be visible to the company.</Alert>
                    <div style={{marginBottom: "30px"}}>
                      <div className="form-options">
                        <span className="application-modal-label">Resume</span>
                        <Select className="filter-select modal-select" placeholder="Document" options={this.getDocumentOptions(DocumentType.Resume)} onChange={(option)=>{
                          setFieldValue('resume', option.value);
                        }} onBlur={()=>setFieldTouched('resume', true)} />
                        {errors['resume'] && touched['resume'] && (
                          <div style={{ color: "#dc3545", marginTop: ".25rem",  fontSize:"80%" }}>
                            <span style={{display:"inline-block", width:"115px"}}>
                            </span>
                            <span style={{display:"inline-block", width: "200px", textAlign:"left"}}>
                            {errors['resume']}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="form-options">
                        <span className="application-modal-label">Coverletter</span>
                        <Select className="filter-select modal-select" placeholder="Document" options={this.getDocumentOptions(DocumentType.Coverletter)} onChange={(option)=>{
                          setFieldValue('coverletter', option.value);
                        }} onBlur={()=>setFieldTouched('coverletter', true)} />
                        {errors['coverletter'] && touched['coverletter'] && (
                          <div style={{ color: "#dc3545", marginTop: ".25rem",  fontSize:"80%" }}>
                            <span style={{display:"inline-block", width:"115px"}}>
                            </span>
                            <span style={{display:"inline-block", width: "200px", textAlign:"left"}}>
                            {errors['coverletter']}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="form-options">
                        <span className="application-modal-label">Other</span>
                        <Select className="filter-select modal-select" placeholder="Document" options={this.getDocumentOptions(DocumentType.Other)} onChange={(option)=>{
                          setFieldValue('other', option.value);
                        }} onBlur={()=>setFieldTouched('other', true)} />
                        {errors['other'] && touched['other'] && (
                          <div style={{ color: "#dc3545", marginTop: ".25rem",  fontSize:"80%" }}>
                            <span style={{display:"inline-block", width:"115px"}}>
                            </span>
                            <span style={{display:"inline-block", width: "200px", textAlign:"left"}}>
                            {errors['other']}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                    <Button className="application-modal-button float-right" variant="secondary" onClick={this.props.toggleShowApplyModal}>
                      Close
                    </Button>
                    {!this.state.isApplying ?
                      <Button className="application-modal-button float-right" variant="primary" type="submit">
                        Apply
                      </Button> :
                      <Button className="application-modal-button applying float-right" variant="primary" onClick={()=>{}}>
                        <Spinner className="applying-spinner" animation="border" role="status"></Spinner>
                        <span>Applying...</span>
                      </Button>
                    }
                    <Link style={{fontSize: "0.85rem", display: 'inline', lineHeight: "33px"}}to="/documents">Need to upload some documents?</Link>
                    </div>
                  </Form>
                )}
              />
            </Modal.Body>
          </React.Fragment>}
        {this.state.isApplied &&
          <React.Fragment>
            <Modal.Header closeButton>
              <Modal.Title>Applied!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
              <div>{`Your application for ${this.props.jobTitle} was successfully submitted. You will receive an email once the employer has reviewed your application.`}</div>
              <Button className="application-modal-button float-right" variant="secondary" onClick={this.props.toggleShowApplyModal}>
                Close
              </Button>
            </Modal.Body>
        </React.Fragment>}
      </Modal>
    );
  }
}

export default ApplicationModal;
