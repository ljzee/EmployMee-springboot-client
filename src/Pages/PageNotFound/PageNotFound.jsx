import React from 'react';
import {Jumbotron} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class PageNotFound extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
          <h3 style={{marginBottom: "25px"}}>Page Not Found</h3>
          <p>We can't seem to find the page you are looking for. <Link to="/">Here are directions back to the front page.</Link></p>
      </div>
    );
  }
}

export {PageNotFound}
