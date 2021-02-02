import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { handleResponse } from '@/_helpers';

import axios from 'axios';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    register,
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    set newCurrentUserValue (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
};

function register(email, username, password, userType) {
    const configOptions = {
        headers: { 'Content-Type': 'application/json' },
    };

    return axios.post(`${config.apiUrl}/authentication/register`, { 'email': email, 'username': username, 'password': password, 'userType': userType}, configOptions)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            localStorage.setItem('currentUser', JSON.stringify(user.data));
            currentUserSubject.next(user.data);

            return user.data;
        })
        .catch((error)=>{
          if(!error.response) {
            return Promise.reject({message: "Cannot reach the server, try again later."})
          }else{
            return Promise.reject(error.response.data)
          }
        });
}

function login(username, password) {
    const configOptions = {
        headers: { 'Content-Type': 'application/json' },
    };

    return axios.post(`${config.apiUrl}/authentication/authenticate`, { 'username': username, 'password': password }, configOptions)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user.data));
            currentUserSubject.next(user.data);

            return user.data;
        })
        .catch((error)=>{
          if(!error.response) {
            return Promise.reject({message: "Cannot reach the server, try again later."});
          }else{
            return Promise.reject(error.response.data);
          }
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
