import React from 'react';

class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { users } = this.state;
        return (
            <div>
              <h1>Jumbotron Goes Here</h1>
            </div>
        );
    }
}

export { WelcomePage };
