import React from 'react';
import './Applicants.css';
import {Card, Button, ToggleButtonGroup, ToggleButton, InputGroup, FormControl} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {businessService} from '@/_services';
import {ApplicationStatus} from '@/_helpers';
import profileicon from '../../Images/profile-icon.png';

class ApplicantCard extends React.Component{
  constructor(props){
    super(props);
    this.updateApplicationStatus = this.updateApplicationStatus.bind(this);
  }

  updateApplicationStatus(jobId, applicationId, status){
    businessService.updateApplicationStatus(jobId, applicationId, status)
    .then(()=>{this.props.fetchApplicants();})
    .catch(error=>{console.log(error)})
  }

  render(){

    const {aId, jobId, id, firstName, lastName, phoneNumber, email, color, dateProcessed, status, profileImage} = this.props;
    return(
      <Card className="candidate-card">
        <div className="candidate-card-upper">
          <span className="candidate-card-upper-helper">
          </span>
          <img style={{border: `5px solid  ${color}`}} src={profileImage === '' ? profileicon : profileImage}/>
        </div>
        <div className="candidate-card-name"><span>{`${firstName} ${lastName}`}</span></div>
        <div className="candidate-card-contact">
          <div><img src={require('../../Images/phone.png')}/>{phoneNumber}</div>
          <div><img src={require('../../Images/email.png')}/>{email}</div>
        </div>
        <div className="candidate-card-buttons">
          <Button variant="link" onClick={()=>{
            businessService.getApplicantFiles(jobId, aId)
                            .then((res) => {
                              const url = window.URL.createObjectURL(new Blob([res.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              const contentDisposition = res.headers['content-disposition'];
                              let fileName = 'file';
                              if (contentDisposition) {
                                 const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                                 if (fileNameMatch.length === 2)
                                     fileName = fileNameMatch[1];
                             }
                              link.setAttribute('download', fileName);
                              document.body.appendChild(link);
                              link.click();
                               link.remove();
                               window.URL.revokeObjectURL(url);
                            })
                            .catch(error=>console.log(error))
          }}>Download Package</Button>
          <Button variant="link" onClick={()=>{this.props.history.push(`${this.props.location.pathname}/${this.props.firstName}-${this.props.lastName}`, {id: this.props.id})}}>View Profile</Button>
        </div>
        { (status === ApplicationStatus.New) &&
          <div className="candidate-card-options">
            <Button variant="success" onClick={()=>{
              this.updateApplicationStatus(jobId, aId, ApplicationStatus.Accepted);
            }}>Accept</Button>
            <Button variant="warning" onClick={()=>{
              this.updateApplicationStatus(jobId, aId, ApplicationStatus.Saved);
            }}>Save</Button>
            <Button variant="danger" onClick={()=>{
              this.updateApplicationStatus(jobId, aId, ApplicationStatus.Rejected);
            }}>Reject</Button>
          </div>
        }
        { (status !== ApplicationStatus.New) &&
          <div className="candidate-card-date">
            Date processed: {dateProcessed}
          </div>
        }
      </Card>
    )
  }

}

export {ApplicantCard}
