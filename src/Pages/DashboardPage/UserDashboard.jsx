import React from 'react';
import {Row, Col, Card, Alert, Table, Button} from 'react-bootstrap';
import Calendar from 'rc-calendar';
import './Dashboard.css';
import "rc-calendar/assets/index.css";
import { Link } from 'react-router-dom'
import {userService} from '@/_services';
import Bookmark from './Bookmark';

import CanvasJSReact from '../../Assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const options = {
  animationEnabled: true,
  theme: "light2",
  dataPointMaxWidth: 30,
  height: 280,
  axisX:{
    labelMaxWidth: 60,
    labelAutoFit: true
  },
  data: [{
            type: "bar",
            dataPoints: [
                { label: "Companies Moved On",  y: 27  },
                { label: "Companies Kept On File",  y: 32  },
                { label: "Companies Contacted", y: 50  },
                { label: "Applications Awaiting Response", y: 34  },
                { label: "Applications Submitted",  y: 143  },
            ]
   }]
}

class UserDashboard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      bookmarks: []
    }

    this.fetchDashboard = this.fetchDashboard.bind(this);
  }

  fetchDashboard(){
    userService.getDashboard()
               .then(data=>{
                 this.setState({
                   bookmarks: data.bookmarks
                 })
               })
  }

  componentDidMount(){
    this.fetchDashboard();
  }

  render(){
    return(
      <div>
        <Row>
          <Col md={8}>

            <Card >
              <Card.Header style={{padding: ".42rem 1.25rem"}}>
                <span className="dashboard-card-title">Notifications</span>
                <img className="icon"  src={require('../../Images/bell.png')} alt="bell"/>
              </Card.Header>
              <Card.Body className="notifications-box" >
              <Alert variant={'success'} dismissible>
                <b>Awesome Software</b> would like to get in touch with you.
              </Alert>
              <Alert variant={'secondary'} dismissible>
                <b>Fortis Security</b> will like to keep in touch when future opportunities arises.
              </Alert>
              <Alert variant={'danger'} dismissible>
                <b>Quantum Inc</b> has decided to move on with other candidates
              </Alert>
              <Alert variant={'success'} dismissible>
                <b>Awesome Software</b> would like to get in touch with you.
              </Alert>
              <Alert variant={'danger'} dismissible>
                <b>Quantum Inc</b> has decided to move on with other candidates
              </Alert>
              <Alert variant={'danger'} dismissible>
                <b>Quantum Inc</b> has decided to move on with other candidates
              </Alert>
              </Card.Body>
              </Card>
          </Col>

          <Col md={4} >
            <span className="dashboard-card-title">Calendar</span>
            <Calendar style={{marginBottom: "20px"}} showDateInput={false}/>

          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={4}>
            <Card>
              <Card.Header style={{padding: ".42rem 1.25rem"}}>
                <span className="dashboard-card-title">Bookmarked Postings</span>
                <img className="icon"  src={require('../../Images/bookmark1.png')} alt="bookmark"/>
              </Card.Header>
              <div className="bookmark-container">
                {this.state.bookmarks.map(bookmark => (
                  <Bookmark
                    key={bookmark.id}
                    title={bookmark.title}
                    company={bookmark.company_name}
                    jobId={bookmark.id}
                    businessId={bookmark.b_id}
                    fetchDashboard={this.fetchDashboard}
                  />
                ))}
              </div>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={4}>
            <Card>
              <Card.Header style={{padding: ".42rem 1.25rem", borderBottom: "none"}}>
                <span className="dashboard-card-title">Recent Searches</span>
                <img className="icon"  src={require('../../Images/history.png')} alt="history"/>
              </Card.Header>
              <Table style={{marginBottom: 0, overflow: "hidden"}}responsive >
                <tbody>
                  <tr>
                    <td className="clickable-cell"><Link to="/dashboard">react developer - Vancouver, BC</Link></td>
                  </tr>
                  <tr>
                    <td className="clickable-cell"><Link to="/dashboard">computer science - Vancouver, BC</Link></td>
                  </tr>
                  <tr>
                    <td className="clickable-cell"><Link to="/dashboard">software developer - Vancouver, BC</Link></td>
                  </tr>
                  <tr>
                    <td className="clickable-cell"><Link to="/dashboard">qa - Vancouver, BC</Link></td>
                  </tr>
                  <tr>
                    <td className="clickable-cell"><Link to="/dashboard">fullstack developer - Vancouver, BC</Link></td>
                  </tr>
                  <tr>
                    <td className="clickable-cell"><Link to="/dashboard">software engineer - Vancouver, BC</Link></td>
                  </tr>
                  </tbody>
              </Table>
            </Card>
          </Col>

          <Col sm={12} md={12} lg={4}>
            <Card>
              <Card.Header style={{padding: ".42rem 1.25rem"}}>
                <span className="dashboard-card-title">Statistics</span>
                <img className="icon"  src={require('../../Images/graph.png')} alt="graph"/>
              </Card.Header>
              <Card.Body>
                <CanvasJSChart options={options} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </div>
    )
  }
}

export {UserDashboard}
