import React from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, ListGroup, Card, Pagination, Badge} from 'react-bootstrap';
import './JobSearch.css'
import {userService} from '@/_services';

class JobCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      bookmarked: props.bookmarked
    }
  }

  render(){
    let formattedJobTitle = this.props.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
    return(
      <Link className="job-card" to={{pathname: `/searchjobs/${formattedJobTitle}`, state: {id: this.props.jobId}}}>
        <Card>
          <Card.Body>
            <button onClick={(e)=>{
              e.preventDefault();
              const bookmarked = this.state.bookmarked;
              userService.toggleBookmark(this.props.jobId)
                         .then(()=>{
                           this.setState({bookmarked: !bookmarked});
                         })
                         .catch(()=>{
                           alert("Unable to toggle bookmark for job post.");
                         });

            }} className={(this.state.bookmarked ? "job-card-bookmark-btn bookmarked" : "job-card-bookmark-btn")}/>
            <div className="job-card-title">{this.props.title} <span>({this.props.positionType})</span> {this.props.applied && <Badge variant="success">Applied</Badge>}</div>
            <div className="job-card-company-location">{this.props.companyName} - {this.props.city}, {this.props.state}</div>
            <div className="job-card-description">{this.props.description}</div>
            <div className="job-card-date-published">Published: {this.props.datePublished}</div>
          </Card.Body>
        </Card>
      </Link>
    )
  }
}


export default JobCard;
