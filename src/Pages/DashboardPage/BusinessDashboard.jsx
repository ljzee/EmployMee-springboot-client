import React from 'react';
import {Row, Col, Card, Alert, Table, Button} from 'react-bootstrap';
import './Dashboard.css';
import { Link } from 'react-router-dom'
import Calendar from 'rc-calendar';
import {businessService, authenticationService} from '@/_services';
import {Role} from '@/_helpers';

class BusinessDashboard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      jobs: []
    }
  }

  componentDidMount(){
    businessService.getDashboard()
                   .then(data => {
                     this.setState({
                       jobs: data.jobs
                     })
                   })
  }

  render(){
    return(
      <div>
        <Row>
          <Col md={8}>
            <Card>
              <Card.Header style={{padding: ".42rem 1.25rem", border: "0px"}}>
                <span className="dashboard-card-title">Applicant Activity</span>
                <img className="icon"  src={require('../../Images/bell.png')} alt="bell"/>
              </Card.Header>
              <Table className="notifications-table" style={{tableLayout: "fixed", marginBottom: 0}}>
                <tbody>
                  <tr>
                    <td className="notifications-cell-content"><Link to="/">Janet Smith</Link> has applied for <Link to="/">Junior Software Developer (Vancouve - British Columbia)</Link><div className="notifications-timestamp">5 minutes ago</div></td>
                    <td className="notifications-cell-button"><Button className="unsave-button">View</Button></td>
                  </tr>
                  <tr>
                    <td className="notifications-cell-content"><Link to="/">Peter Chao</Link> has applied for <Link to="/">Intermediate QA Analyst (Coquitlam - British Columbia)</Link><div className="notifications-timestamp">2 hours ago</div></td>
                    <td className="notifications-cell-button"><Button className="unsave-button">View</Button></td>
                  </tr>
                  <tr>
                    <td className="notifications-cell-content"><Link to="/">Joan Winters</Link> has applied for <Link to="/">Database Analyst (Burnaby - British Columbia)</Link><div className="notifications-timestamp">Tuesday</div></td>
                    <td className="notifications-cell-button"><Button className="unsave-button">View</Button></td>
                  </tr>
                </tbody>
              </Table>
            </Card>
            <Card>
              <Card.Header>Current Openings <Link style={{color: '#007bff'}}className="float-right" to='/managepostings'>View my jobs</Link></Card.Header>
              <div className="business-profile-job-container">
                {this.state.jobs.map(job=>(
                  <a key={job.id} onClick={(e)=>{
                    e.preventDefault();
                    let formattedJobTitle = job.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
                    let route = (authenticationService.currentUserValue.role === Role.Business ? 'managepostings' : 'searchjobs');
                    this.props.history.push(`/${route}/${formattedJobTitle}`, {id: job.id, edit: false});
                  }} className="business-profile-job-container-job">
                    <div className="job-title">{job.title}</div>
                    <div className="job-location">{`${job.city}, ${job.state}`}</div>
                  </a>
                ))}
              </div>
            </Card>
          </Col>

          <Col md={4} >
            <span className="dashboard-card-title">Calendar</span>
            <Calendar showDateInput={false}/>

          </Col>

        </Row>
      </div>
    )
  }
}

export {BusinessDashboard}
