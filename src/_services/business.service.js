import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';

export const businessService = {
    createProfile,
    getProfile,
    addJobPost,
    getAllBusinessJobPost,
    getJobPost,
    updateJobPost,
    updateJobPostStatus,
    deleteJobPost,
    getJobApplicants,
    getApplicationFiles,
    updateApplicationStatus,
    updateJobPostStatus,
    updateJobPostDeadline,
    uploadProfileImage,
    updateProfile,
    addUpdate,
    deleteUpdate,
    getDashboard,
    getBusinessAddresses
};

function createProfile(companyName, country, state, city, streetAddress, postalCode, phoneNumber, website, description) {
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/business/profile`, {
        'companyName' : companyName,
        'country': country,
        'state': state,
        'city': city,
        'streetAddress': streetAddress,
        'phoneNumber': phoneNumber,
        'website': website,
        'description': description,
        'postalCode': postalCode
      }, configOptions)
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
  return axios.get(`${config.apiUrl}/business/profile/${userId}`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data));

}

function addJobPost(title, duration, positionType, addressId, openings, description, salary, deadline, resumeRequired, coverletterRequired, otherRequired, status){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/jobpost`, {title: title, duration: duration, positionType: positionType, addressId: addressId, openings: openings, description: description, salary: salary, deadline: deadline, resumeRequired: resumeRequired, coverletterRequired: coverletterRequired, otherRequired: otherRequired, status: status}, configOptions)
              .catch((error) => Promise.reject(error.response.data));
}

function getAllBusinessJobPost(){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data));
}

function getJobPost(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost/${jobPostId}`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data));
}

function updateJobPost(jobPostId, title, duration, positionType, addressId, openings, description, salary, deadline, resumeRequired, coverletterRequired, otherRequired){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/business/jobpost/${jobPostId}`, {title: title, duration: duration, positionType: positionType, addressId: addressId, openings: openings, description: description, salary: salary, deadline: deadline, resumeRequired: resumeRequired, coverletterRequired: coverletterRequired, otherRequired: otherRequired}, configOptions)
              .catch((error) => Promise.reject(error.response.data));
}

function updateJobPostStatus(jobPostId, status){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/business/jobpost/${jobPostId}/status`, {status: status}, configOptions)
              .catch((error) => Promise.reject(error.response.data));
}

function updateJobPostDeadline(jobPostId, deadline){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/business/jobpost/${jobPostId}/deadline`, {deadline: deadline}, configOptions)
              .catch((error) => Promise.reject(error.response.data));
}

function deleteJobPost(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/business/jobpost/${jobPostId}`, configOptions)
              .catch((error) => Promise.reject(error.response.data));
}


function getJobApplicants(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost/${jobPostId}/applicants`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data));
}

function getApplicationFiles(jobPostId, applicationId){
  const configOptions = {
      headers: authHeader(),
      responseType: 'blob'
  };
  return axios.get(`${config.apiUrl}/application/${applicationId}`, configOptions)
              .then(res=>(res))
              .catch((error) => Promise.reject(error));

}

function updateApplicationStatus(applicationId, status){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/application/${applicationId}`, {status: status}, configOptions)
              .catch((error) => Promise.reject(error));
}

function uploadProfileImage(encodedString){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/profile-image`, {encodedString: encodedString}, configOptions)
              .catch((error)=>Promise.reject(error.response.data));
}

function updateProfile(phoneNumber, website, description){
  const user = authenticationService.currentUserValue;
  const configOptions = {
      headers: authHeader()
  };

  return axios.put(`${config.apiUrl}/business/profile`, {phoneNumber: phoneNumber, website: website, description: description}, configOptions)
              .catch((error)=>Promise.reject(error.response.data));
}

function addUpdate(content){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/update`, {content: content}, configOptions)
              .catch((error)=>Promise.reject(error.response.data));
}

function deleteUpdate(updateId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/business/update/${updateId}`,configOptions)
              .catch((error)=>Promise.reject(error.response.data));
}


function getDashboard(){
  const configOptions = {
      headers: authHeader()
  };

  return axios.get(`${config.apiUrl}/business/dashboard`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function getBusinessAddresses(){
  const configOptions = {
      headers: authHeader()
  };

  return axios.get(`${config.apiUrl}/business/address`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}
