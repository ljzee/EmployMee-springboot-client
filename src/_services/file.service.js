import config from 'config';
import { authHeader} from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';


export const fileService = {
  uploadFile,
  getAllUserFiles,
  deleteFile,
  editFile,
  downloadFile
};

function uploadFile(file, fileType, fileRename){
  const configOptions = {
      headers: authHeader()
  };


  const data = new FormData();
  data.append('file', file);
  data.append('type', fileType);
  data.append('name', fileRename);
  return axios.post(`${config.apiUrl}/document`, data, configOptions)
              .catch((error) => Promise.reject(error))
}

function editFile(fileId, fileRename){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/document/${fileId}`, {name: fileRename}, configOptions)
              .catch((error) => Promise.reject(error))
}

function deleteFile(fileId){
  const configOptions = {
      headers: authHeader()
  };

  return axios.delete(`${config.apiUrl}/files/${fileId}`, configOptions)
              .catch((error) => Promise.reject(error));
}

function getAllUserFiles(){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/document`, configOptions)
              .then(res=>{
                return res.data;
              })
              .catch((error)=> Promise.reject(error));
}

function downloadFile(fileId){
  const configOptions = {
      headers: authHeader(),
      responseType: 'blob'
  };
  return axios.get(`${config.apiUrl}/document/${fileId}`, configOptions)
          .then(res=>(res))
          .catch((error) => Promise.reject(error));
}
