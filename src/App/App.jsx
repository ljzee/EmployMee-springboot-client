import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';


import { Role,} from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute, Header } from '@/_components';
import { HomePage } from '@/Pages/HomePage';
import { LoginPage } from '@/Pages/LoginPage';
import { SignupPage } from '@/Pages/SignupPage';
import { ProfilePage } from '@/Pages/ProfilePage';
import { WelcomePage} from '@/Pages/WelcomePage';
import { CreateProfilePage} from '@/Pages/CreateProfilePage';
import { DocumentsPage} from '@/Pages/DocumentsPage';
import { ApplicationsPage } from '@/Pages/ApplicationsPage';
import { DashboardPage} from '@/Pages/DashboardPage';
import { ManagePostingsPage, AddPostingPage} from '@/Pages/ManagePostingsPage';
import { JobPostPage, UserJobPostPage } from '@/Pages/JobPostPage';
import { ApplicantsPage } from '@/Pages/ApplicantsPage';
import { JobSearchPage } from '@/Pages/JobSearchPage';
import { CompanyProfilePage} from '@/Pages/CompanyProfilePage'
import { PageNotFound} from '@/Pages/PageNotFound';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
        }));
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Router >
                <div>
                    <Header currentUser={currentUser}/>
                    <div className="body">
                      <div className="container">
                          <Switch>
                              <Route exact path="/" component={WelcomePage} />
                              <Route path="/login" component={LoginPage} />
                              <Route path='/signup' component={SignupPage} />
                              <PrivateRoute exact path="/dashboard" component={DashboardPage} />
                              <PrivateRoute path='/createprofile' component={CreateProfilePage}/>
                              <PrivateRoute path='/documents' roles={[Role.User]} component={DocumentsPage}/>
                              <PrivateRoute path='/applications' roles={[Role.User]} component={ApplicationsPage}/>
                              <PrivateRoute exact path='/searchjobs' roles={[Role.User]} component={JobSearchPage}/>
                              <PrivateRoute exact path='/searchjobs/:jobtitle' roles={[Role.User]} component={UserJobPostPage}/>
                              <PrivateRoute exact path='/searchjobs/:jobtitle/:company' roles={[Role.User]} component={CompanyProfilePage}/>
                              <PrivateRoute path='/myprofile' roles={[Role.User]} component={ProfilePage}/>
                              <PrivateRoute path='/companyprofile' roles={[Role.Business]} component={CompanyProfilePage}/>
                              <PrivateRoute exact path="/managepostings" roles={[Role.Business]} component={ManagePostingsPage}/>
                              <PrivateRoute exact path="/managepostings/:jobtitle" roles={[Role.Business]} component={JobPostPage}/>
                              <PrivateRoute exact path="/managepostings/:jobtitle/applicants" roles={[Role.Business]} component={ApplicantsPage}/>
                              <PrivateRoute exact path="/managepostings/:jobtitle/applicants/:applicant" roles={[Role.Business]} component={ProfilePage}/>
                              <PrivateRoute path="/addposting" roles={[Role.Business]} component={AddPostingPage}/>
                              <Route component={PageNotFound}/>
                          </Switch>
                      </div>
                    </div>
                </div>
            </Router>
        );
    }
}

//<PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />

export { App };
