import axios from 'axios';
import isUrl from 'is-url';

function createClient({ luminoNodeBaseUrl, debug }) {
  const restClient = axios.create({ baseURL: luminoNodeBaseUrl });
  if (!isUrl(luminoNodeBaseUrl)) {
    throw new Error(`${luminoNodeBaseUrl} is not an url`);
  }
  if (debug) {
    setupDebugInterceptors(restClient);
  }
  setupTokenInterceptor(restClient);
  return restClient;
}

function setupDebugInterceptors(restClient) {
  restClient.interceptors.request.use(request => {
    console.log('Starting Request');
    console.log('URL:', request.url);
    console.log('METHOD: ', request.method);
    console.log('DATA: ', request.data);
    console.log('HEADERS: ', request.headers);
    return request;
  });

  restClient.interceptors.response.use(response => {
    console.log('Response:');
    console.log('STATUS:', response.status);
    console.log('STATUS_TEXT:', response.statusText);
    console.log('DATA:', response.data);
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

export default createClient;
