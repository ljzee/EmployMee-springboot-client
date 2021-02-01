import { authenticationService } from '@/_services';

/*export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}*/


export function handleResponse(response) {
  console.log(response);
    if(response.statusText !== 'OK'){
        if ([401, 403].indexOf(response.status) !== -1) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            console.log(401);
            authenticationService.logout();
            location.reload(true);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);

      }
      return response.data;
}

//MUST CHANGE TO USE AXIOS INTERCEPTORS
