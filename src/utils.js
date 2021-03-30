import axios from 'axios';
import isUrl from 'is-url';

function createClient(luminoNodeBaseUrl) {
  const restClient = axios.create({
    baseURL: luminoNodeBaseUrl,
    responseType: 'json',
  });
  if (!isUrl(luminoNodeBaseUrl)) {
    throw new Error(`${luminoNodeBaseUrl} is not an url`);
  }
  setupDebugInterceptors(restClient);
  setupTokenInterceptor(restClient);
  return restClient;
}

function setupDebugInterceptors(restClient) {
  restClient.interceptors.request.use(request => {
    console.debug('Starting Request');
    console.debug('URL:', request.url);
    console.debug('METHOD: ', request.method);
    console.debug('DATA: ', request.data);
    console.debug('HEADERS: ', request.headers);
    return request;
  });

  restClient.interceptors.response.use(response => {
    console.debug('Response:');
    console.debug('STATUS:', response.status);
    console.debug('STATUS_TEXT:', response.statusText);
    console.debug('DATA:', response.data);
    return response;
  });
}

function setupTokenInterceptor(restClient) {
  const tokenClient = axios.create({ baseURL: restClient.defaults.baseURL });
  restClient.interceptors.request.use(async request => {
    if (request.method !== 'get') {
      const { data } = await tokenClient.post('tokenAction');
      request.headers.token = data.token;
    }
    return request;
  });
}

function handleResponse(promise) {
  return new Promise((resolve, reject) => {
    promise
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error?.response?.data ? error.response.data : error);
      });
  });
}

export { createClient, handleResponse };
