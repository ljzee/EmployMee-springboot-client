import React from 'react';
import {Row, Col, Card, Alert, Table, Button} from 'react-bootstrap';
import './Dashboard.css';
import { Link } from 'react-router-dom'
import {userService} from '@/_services';

const Bookmark = (props) => {
  let formattedJobTitle = props.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
  return(
    <div className="bookmark">
      <div className="bookmark-info">
        <Link to={{pathname: `/searchjobs/${formattedJobTitle}`, state: {id: props.jobId}}} className="bookmark-info-content">{props.title}</Link>
        <div className="bookmark-info-content">({props.company})</div>
      </div>
      <div className="bookmark-button"><Button onClick={()=>{
        userService.toggleBookmark(props.jobId)
                   .then(() => {
                     props.fetchDashboard()
                   })
                   .catch(() => {
                     alert("Unable to unsave jobpost. Please try again.");
                   });
      }} className="unsave-button">Unsave</Button></div>
    </div>
  )
}

export default Bookmark;
