import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {Jumbotron, Container, Row, Col, Carousel, Card, Button, Nav} from 'react-bootstrap';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import CountUp from 'react-countup';

import { authenticationService } from '@/_services';

import './Welcome.css'


class WelcomePage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/dashboard');
        }
    }


    render() {
        return (
            <div className="welcome-page">
              <Row>
                <Col >

                  <Carousel>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={require('../../Images/WelcomeBackground.jpg')}
                        alt="First slide"
                      />
                      <Carousel.Caption>
                        <h4 className="carousel-message">The best time to start was yesterday, the next best time is now.</h4>
                        <Button className="carousel-button"><Link to="signup">Start Here</Link></Button>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={require('../../Images/WelcomeBackground.jpg')}
                        alt="Third slide"
                      />

                      <Carousel.Caption>
                        <h4 className="carousel-message">The best time to start was yesterday, the next best time is now.</h4>
                        <Button className="carousel-button" ><Link to="signup">Start Here</Link></Button>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>

                </Col>
              </Row>

              <Row>
                <Col sm={12} md={6}>
                  <Card>
                    <Button variant="light" className="welcomepage-main-button">
                      <Nav.Link as={Link} to="signup">
                        <Card.Body>
                        <img className="welcome-page-icon" src={require('../../Images/suitcase.png')} alt="work-briefcase"/>
                        <Card.Title>Looking for work?</Card.Title>
                        <Card.Text>Our simple and intuitive design will allow you to search job postings, customize your profile and more...</Card.Text>
                        </Card.Body>
                      </Nav.Link>
                    </Button>
                  </Card>
                </Col>
                <Col sm={12} md={6}>
                <Card >
                  <Button variant="light" className="welcomepage-main-button">
                    <Nav.Link as={Link} to="signup">
                      <Card.Body>
                      <img className="welcome-page-icon" src={require('../../Images/team.png')} alt="people"/>
                      <Card.Title>Looking for talent?</Card.Title>
                      <Card.Text>Post your openings and be able to view your applicants in a card-like display. You will find the perfect match in no time...</Card.Text>
                      </Card.Body>
                    </Nav.Link>
                  </Button>
                </Card>
                </Col>
              </Row>

              <Row className="last-row">
                <Col sm={12} md={4}>
                  <Card>
                    <Card.Body>
                    <CountUp className='number' end={512} duration={2}/><br/>Jobs Available
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} md={4}>
                <Card>
                  <Card.Body>
                  <CountUp className='number' end={315} duration={2}/><br/>Applicants Contacted
                  </Card.Body>
                </Card>
                </Col>
                <Col sm={12} md={4}>
                <Card>
                  <Card.Body>
                  <CountUp className='number' end={15} duration={2}/><br/>New Companies
                  </Card.Body>
                </Card>
                </Col>
              </Row>
            </div>
        )
    }
}

export { WelcomePage };
