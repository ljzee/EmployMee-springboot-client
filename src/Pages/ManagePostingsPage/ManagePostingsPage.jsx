import React from 'react';
import {Tabs, Tab, Card, Nav, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './ManagePostings.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {businessService} from '@/_services';
import {JobPostType} from '@/_helpers';

class ManagePostingsPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: [],
      loading: true
    }
    this.fetchPostings = this.fetchPostings.bind(this);
  }

  fetchPostings(){
    businessService.getAllBusinessJobPost()
                   .then(posts => {
                     this.setState({
                       data: posts.map(post => ({position: post.title,
                                                 location: post.jobAddresses.length ? `${post.jobAddresses[0].city}, ${post.jobAddresses[0].state}` : "",
                                                 deadline: post.deadline,
                                                 applicationCount: post.applicationCount,
                                                 status: post.status,
                                                 id: post.id})),
                       loading: false
                     })
                   })
                   .catch(error => {console.log(error)})
  }

  componentDidMount(){
    this.fetchPostings();
  }

  render(){

    const columns = [{
      Header: '#',
      width: 40,
      Cell: (row) => {
        return <div>{row.index+1}</div>
      },
      style:{
          textAlign: "center"
      },
    },{
      Header: 'Position',
      width: 275,
      accessor: 'position',
      Cell: props => {
        let formattedJobTitle = props.original.position.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
        return(
          <Link style={{color: "#007bff"}} to={{pathname: `/managepostings/${formattedJobTitle}`, state: {id: props.original.id, edit: false}}}>{props.original.position}</Link>
        )
      },
      style:{
          textAlign: "center",
      }
    },{
      Header: 'Location',
      accessor: 'location',
      width: 275,
      style:{
          textAlign: "center"
      }
    },{
      Header: 'Deadline',
      width: 115,
      style:{
          textAlign: "center"
      },
      accessor: 'deadline',
      Cell: props => {
        return(
          <div className="datepicker-container">
            <DatePicker value={props.original.deadline} onChange={(date)=>{
              businessService.updateJobPostDeadline(props.original.id, date.toISOString().split("T")[0])
                             .then(()=>{this.fetchPostings()})
                             .catch(error => {
                               if(error.subErrors && error.subErrors.length && error.subErrors[0].field === "deadline") {
                                 alert(error.subErrors[0].message);
                               } else {
                                 alert("Unable to update deadline for job post. Please try again.");
                               }
                             });
            }}/>
          </div>
        )
      }
    },{
      Header: 'No. of Apps',
      accessor: 'applicationCount',
      width: 100,
      style:{
          textAlign: "center"
      }
    },{
      Header: 'Actions',
      accessor: 'actions',
      Cell: props => {
        return(
          <div className="action-button-group">
            {(props.original.status === JobPostType.Open || props.original.status === JobPostType.Closed) &&
             <button onClick={()=>{
               let formattedJobTitle = props.original.position.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
               this.props.history.push(`/managepostings/${formattedJobTitle}/applicants`, {id: props.original.id, title: props.original.position});
             }}className="action-applicant-button"><img src={require('../../Images/applicant.png')}/></button>
            }
            <button onClick={()=>{
               let formattedJobTitle = props.original.position.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
               this.props.history.push(`/managepostings/${formattedJobTitle}`, {id: props.original.id, edit: true})
            }} className="action-edit-button"><img src={require('../../Images/edit.png')}/></button>
            {props.original.status === JobPostType.Draft && <button onClick={()=>{
              businessService.deleteJobPost(props.original.id)
                             .then(()=>{this.fetchPostings()})
                             .catch(error => {
                               alert("Unable to delete job post. Please try again.")
                             });
            }} className="action-delete-button"><img src={require('../../Images/bin.png')}/></button>
            }
          </div>
        )
      },
      sortable: false
    }]



    return(
      <div className="managepostings-page mx-auto">
        <Button variant="primary float-right" onClick={()=>{this.props.history.push('/addposting')}}>Create New Posting</Button>
        <h3 className="managepostings-page-title">Manage Postings</h3>
        <Tab.Container defaultActiveKey="active" transition={false}>
          <Card>
            <Card.Header>
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="active">Active Postings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="drafts">Drafts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="past">Past Postings</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="active">
                  <ReactTable columns={columns}
                              data={this.state.data}
                              resolveData={data => data.filter(jobpost => jobpost.status === JobPostType.Open)}
                              showPagination={false}
                              noDataText={"No job postings found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
                <Tab.Pane eventKey="drafts">
                  <ReactTable columns={columns}
                              data={this.state.data}
                              resolveData={data => data.filter(jobpost => jobpost.status === JobPostType.Draft)}
                              showPagination={false}
                              noDataText={"No job postings found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
                <Tab.Pane eventKey="past">
                  <ReactTable columns={columns}
                              data={this.state.data}
                              resolveData={data => data.filter(jobpost => jobpost.status === JobPostType.Closed)}
                              showPagination={false}
                              noDataText={"No job postings found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </div>
    )
  }
}

export {ManagePostingsPage};
