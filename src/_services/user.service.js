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
    getDashboard,
    toggleBookmark
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
  const configOptions = {
      headers: authHeader()
  };

  return axios.get(`${config.apiUrl}/user/profile/${userId}`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data))

}

function getDashboard(){
  const configOptions = {
      headers: authHeader()
  };

  return axios.get(`${config.apiUrl}/user/dashboard`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function updateProfile(bio, phoneNumber, personalWebsite, githubLink){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/user/profile`, {'bio': bio, 'phoneNumber': phoneNumber, 'personalWebsite': personalWebsite, 'githubLink':githubLink} ,configOptions)
              .catch((error) => Promise.reject(error.response.data));
}

function addExperience(companyName, title, location, startDate, endDate, description){
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/user/experience`, { 'companyName': companyName, 'title': title, 'location': location, 'startDate': startDate, 'endDate': endDate, 'description': description}, configOptions)
              .catch((error)=>Promise.reject(error.response.data));
}

function editExperience(experienceId, companyName, title, location, startDate, endDate, description){
  const configOptions = {
      headers: authHeader()
  };

  return axios.put(`${config.apiUrl}/user/experience/${experienceId}`, { 'companyName': companyName, 'title': title, 'location': location, 'startDate': startDate, 'endDate': endDate, 'description': description}, configOptions)
              .catch((error)=>Promise.reject(error.response.data));
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
              .catch((error)=>Promise.reject(error.response.data));
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
  return axios.get(`${config.apiUrl}/user/application`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data));
}

function toggleBookmark(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/user/bookmark`, {jobPostId: jobPostId}, configOptions)
              .catch((error)=>Promise.reject(error.response.data));
}
