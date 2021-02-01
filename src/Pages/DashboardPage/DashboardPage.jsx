import React from 'react';
import {Row, Col, Card, Alert, Table, Button} from 'react-bootstrap';
import { userService, authenticationService } from '@/_services';

import { Role } from '@/_helpers';
import {UserDashboard} from './UserDashboard';
import {BusinessDashboard} from './BusinessDashboard';


class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          currentUser: authenticationService.currentUserValue
        }
    }

    render() {
       const {currentUser} = this.state;
        return (
            <div className="dashboard-page mx-auto">
              <h3 className="dashboard-page-title">Dashboard</h3>
              {currentUser.role === Role.User && <UserDashboard history={this.props.history}/>}
              {currentUser.role === Role.Business && <BusinessDashboard history={this.props.history}/>}
            </div>
        );
    }
}

/*
<div style={{width: "100%", height: 40, lineHeight:"40px"}}>
  <h5 style={{display: "inline-block"}}>Bookmarked Postings</h5>
  <img className="icon"  src={require('../../Images/bookmark.png')} alt="bookmark"/>
</div>
*/

export { DashboardPage };
