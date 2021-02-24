import React from 'react';
import {Link} from 'react-router-dom';
import {Col, Row, Card, Button, DropdownButton, Dropdown, Spinner, Badge} from 'react-bootstrap';
import './JobPost.css'

const JobPost = (props) => {
  return(
    <div className="jobpostpage mx-auto">
      <Row>
        <Col md={3} style={{padding: 0}}>
          {props.backButton()}
        </Col>

        <Col md={9}>
          <div className="jobpostpage-header">
            {props.getActionButton()}
            <h3>{props.title} {props.status === 'DRAFT' && <span>[Draft]</span>}{props.status === 'CLOSED' && <span>[Closed]</span>}</h3>
            {props.businessId && <Link className="jobpostpage-header-location" to={{pathname: `${props.location.pathname}/${props.companyName}`, state: {id: props.businessId}}}><img height="22" width="22" src={require('../../Images/building.png')}/>{props.companyName}</Link>}
            {!props.businessId && <Link className="jobpostpage-header-location" to="/companyprofile"><img height="22" width="22" src={require('../../Images/building.png')}/>{props.companyName}</Link>}
            <span className="jobpostpage-header-location"><img height="22" width="22" src={require('../../Images/location.png')}/>{`${props.jobAddress.city}, ${props.jobAddress.state}`}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>Application Info.</Card.Header>
            <Card.Body>
              <div style={{fontSize: "14px", marginBottom: "10px"}}><b>Documents Required</b></div>
              <ul>
                {props.resumeRequired && <li>Resume</li>}
                {props.coverletterRequired && <li>Cover Letter</li>}
                {props.otherRequired && <li>Other</li>}
              </ul>
              <div style={{fontSize: "14px", marginBottom: "10px"}}><b>Deadline: </b>{props.deadline}</div>
              <div style={{fontSize: "14px"}}><b>Status: </b>{props.getStatusBadge()}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card>
            <Card.Header>Job Description</Card.Header>
            <Card.Body>
              <Card.Text>
                  {props.description}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Job Details</Card.Header>
            <Card.Body>
              <Row>
                <Col className="jobdetails-container">
                  <div><b>Position Type: </b>{props.positionType}</div>
                  <div><b>Duration: </b>{props.duration}</div>
                  <div><b>Openings: </b>{props.openings}</div>
                  <div><b>Salary: </b>{props.salary}</div>
                </Col>
                <Col className="jobdetails-container">
                  <div><b>Website: </b><a style={{color: "#007bff"}}>{props.companyWebsite}</a></div>
                  <div><b>Phone Number: </b>{props.companyPhoneNumber}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="jobpostpage-timestamp" style={{textAlign: "right"}}><b>Date-Published: </b>{props.datePublished}</div>
        </Col>
      </Row>
    </div>
  )
}

export default JobPost;
