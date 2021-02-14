import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';

export const userService = {
    createProfile,
    getProfile,
    addExperience,
    editExperience,
    deleteExperience,
    updateProfile,
    uploadProfileImage,
    searchJobPost,
    getJobPost,
    submitApplication,
    getAllUserApplications,
    addBookmark,
    removeBookmark,
    getDashboard
};

function createProfile(firstName, lastName, phoneNumber, personalWebsite, githubLink, bio) {
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/user/profile`, { 'firstName': firstName, 'lastName': lastName, 'phoneNumber': phoneNumber, 'personalWebsite': personalWebsite, 'githubLink': githubLink, 'bio': bio}, configOptions)
      .then(response => {
        let currentUser = authenticationService.currentUserValue;
        currentUser.hasProfile = true;
        authenticationService.newCurrentUserValue = currentUser;

      })
      .catch((error)=>{
        if(!error.response) {
          return Promise.reject({message: "Cannot reach the server, try again later."})
        }else{
          return Promise.reject(error.response.data)
        }
      });
}

function getProfile(userId){
  /*
  const user = authenticationService.currentUserValue;
  const configOptions = {
      headers: authHeader()
  };
  */
  return axios.get(`${config.apiUrl}/users/profile/${userId}`, {})
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))

}

function getDashboard(){
  const configOptions = {
      headers: authHeader()
  };

  return axios.get(`${config.apiUrl}/user/dashboard`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function updateProfile(bio, phoneNumber, personalWebsite, github){
  const user = authenticationService.currentUserValue;
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/users/profile/${user.id}`, {'bio': bio, 'phoneNumber': phoneNumber, 'personalWebsite': personalWebsite, 'github':github} ,configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function addExperience(company, title, location, startDate, endDate, description){
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/users/experience`, { 'company': company, 'title': title, 'location': location, 'startDate': startDate, 'endDate': endDate, 'description': description}, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function editExperience(experienceId, company, title, location, startDate, endDate, description){
  const configOptions = {
      headers: authHeader()
  };

  return axios.put(`${config.apiUrl}/users/experience/${experienceId}`, { 'company': company, 'title': title, 'location': location, 'startDate': startDate, 'endDate': endDate, 'description': description}, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function deleteExperience(id){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/users/experience/${id}`, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function uploadProfileImage(encodedString){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/users/profile/profile-image`, {encodedString: encodedString}, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function getJobPost(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/jobpost/${jobPostId}`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function searchJobPost(searchField, country, state, city){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/jobpost?searchField=${searchField}&country=${country}&state=${state}&city=${city}`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function submitApplication(jobPostId, documents){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/application`, {jobPostId: jobPostId, documentIds: documents}, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function getAllUserApplications(){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/application`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function addBookmark(jobId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/users/bookmark`, {jobId: jobId}, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function removeBookmark(jobId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/users/bookmark/${jobId}`, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}
/*
function getAll() {
    return axios.get(`${config.apiUrl}/users`, {headers: authHeader()}).then(result => result.data);
}

function getById(id) {
    return axios.get(`${config.apiUrl}/users/${id}`, {headers: authHeader()}).then(result=> {
    //console.log(result);
  return result.data;
});
}

*/
