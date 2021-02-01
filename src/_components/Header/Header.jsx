import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';

import {Navbar, Nav, Container} from 'react-bootstrap';


class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: props.currentUser,
        };

    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser } = this.props;

        let navItems = null;

        if(!currentUser){
          navItems = <React.Fragment>
                      <Nav.Link as={Link} to="login">Login</Nav.Link>
                      <Nav.Link as={Link} to="signup">Sign Up</Nav.Link>
                     </React.Fragment>;
        }

        if(currentUser && !currentUser.hasProfile){
            navItems = <React.Fragment>
                        <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                       </React.Fragment>
        }

        if(currentUser && currentUser.hasProfile && currentUser.role === Role.User){
            navItems = <React.Fragment>
                        <Nav.Link as={Link} to="/searchjobs">Jobs</Nav.Link>
                        <Nav.Link as={Link} to="/applications">Applications</Nav.Link>
                        <Nav.Link as={Link} to="/documents">Documents</Nav.Link>
                        <Nav.Link as={Link} to="/myprofile">Profile</Nav.Link>
                        <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                       </React.Fragment>;
        }

        if(currentUser && currentUser.hasProfile && currentUser.role === Role.Business){
          navItems = <React.Fragment>
                       <Nav.Link as={Link} to="/managepostings">Manage Postings</Nav.Link>
                       <Nav.Link as={Link} to="/companyprofile">Profile</Nav.Link>
                       <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                     </React.Fragment>;
        }

        return (
            <Navbar bg="dark" variant="dark" expand="md">
              <Container>
                <Navbar.Brand as={Link} to="/">EmployMee</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="ml-auto">
                  {navItems}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export { Header };
