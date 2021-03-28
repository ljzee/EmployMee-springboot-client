import React from 'react';
import {Row, Col, Card, Button, Form, ListGroup, Spinner, Nav, Tab, Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { authenticationService, userService } from '@/_services';
import ReactTable from 'react-table';
import {ApplicationStatus} from '@/_helpers';

import './Applications.css';

class ApplicationsPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      loading: true,
      applications: [],
    }
  }

  componentDidMount(){

    userService.getAllUserApplications()
               .then(data=>{
                 this.setState({
                   loading: false,
                   applications: data
                 })
               })
               .catch(error=>{
                 alert("Unable to get applications. Please try again.")
               });
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
      accessor: 'title',
      Cell: props => {
        let formattedJobTitle = props.original.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
        return(
          <Link style={{color: "#007bff"}} to={{pathname: `/searchjobs/${formattedJobTitle}`, state: {id: props.original.jobPostId}}}>{props.original.title}</Link>
        )
      },
      style:{
          textAlign: "center",
      }
    },{
      Header: 'Company',
      accessor: 'companyName',
      width: 200,
      Cell: props => {
        let formattedJobTitle = props.original.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
        return(
          <Link style={{color: "#007bff"}} to={{pathname: `/searchjobs/${formattedJobTitle}/${props.original.companyName}`, state: {id: props.original.companyId}}}>{props.original.companyName}</Link>
        )
      },
      style:{
          textAlign: "center"
      }
    },{
      Header: 'Date Submitted',
      width: 130,
      style:{
          textAlign: "center"
      },
      accessor: 'dateSubmitted',
    },{
      Header: 'Date Processed',
      accessor: 'dateProcessed',
      width: 130,
      Cell: props => {
        return (props.original.dateProcessed ? props.original.dateProcessed : 'N/A')
      },
      style:{
          textAlign: "center"
      }
    },{
      Header: 'Status',
      accessor: 'status',
      sortable: false,
      Cell: props => {

        let statusBadge;
        if(props.original.status === ApplicationStatus.Accepted){
          statusBadge = <Badge style={{fontSize: '0.9rem'}}variant="success">Accepted</Badge>
        }else if(props.original.status === ApplicationStatus.Saved){
          statusBadge = <Badge style={{fontSize: '0.9rem'}}variant="warning">Saved</Badge>
        }else if(props.original.status === ApplicationStatus.Rejected){
          statusBadge = <Badge style={{fontSize: '0.9rem'}}variant="danger">Rejected</Badge>
        }else{
          statusBadge = <Badge style={{fontSize: '0.9rem'}}variant="secondary">Pending</Badge>
        }

        return statusBadge;
      },
      style:{
          textAlign: "center"
      }
    }]

    return(
      <div className="applications-page mx-auto">
        <h3 className="applications-page-title">My Applications</h3>
        <Tab.Container defaultActiveKey="accepted" transition={false}>
          <Card>
            <Card.Header>
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="new">Pending</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="accepted">Accepted</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="saved">Saved</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="rejected">Rejected</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="new">
                  <ReactTable columns={columns}
                              data={this.state.applications}
                              resolveData={data => data.filter(application => application.status === ApplicationStatus.New)}
                              showPagination={false}
                              noDataText={"No applications found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
                <Tab.Pane eventKey="accepted">
                  <ReactTable columns={columns}
                              data={this.state.applications}
                              resolveData={data => data.filter(application => application.status === ApplicationStatus.Accepted)}
                              showPagination={false}
                              noDataText={"No applications found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
                <Tab.Pane eventKey="saved">
                  <ReactTable columns={columns}
                              data={this.state.applications}
                              resolveData={data => data.filter(application => application.status === ApplicationStatus.Saved)}
                              showPagination={false}
                              noDataText={"No applications found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
                <Tab.Pane eventKey="rejected">
                  <ReactTable columns={columns}
                              data={this.state.applications}
                              resolveData={data => data.filter(application => application.status === ApplicationStatus.Rejected)}
                              showPagination={false}
                              noDataText={"No applications found"}
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

export {ApplicationsPage};
