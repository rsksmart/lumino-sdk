import isUrl from 'is-url';
import joinUrl from 'proper-url-join';
import axios from 'axios';

/**
 * @classdesc Represents an API Rest Client.
 */
export default class RestClient {
  /**
   * Create a Index.
   * @constructor
   * @param nodeEndpoint - A string with the base URL for lumino node.
   * @param debug - Flag to see request and responses detail
   */
  constructor(nodeEndpoint, debug) {
    if (!isUrl(nodeEndpoint))
      throw new Error('The base URL provided for lumino node is not valid');

    if (debug) {
      axios.interceptors.request.use(request => {
        console.log('Starting Request');
        console.log('URL:', request.url);
        console.log('METHOD: ', request.method);
        console.log('DATA: ', request.data);
        console.log('HEADERS: ', request.headers);
        return request;
      });

      axios.interceptors.response.use(response => {
        console.log('Response:');
        console.log('STATUS:', response.status);
        console.log('STATUS_TEXT:', response.statusText);
        console.log('DATA:', response.data);
        return response;
      });
    }

    this.nodeEndpoint = nodeEndpoint;
  }

  /**
   * Fetch the information from the API. But First get a token if a http method change state.
   * For example if request method is: POST, PUT, PATCH or DELETE, the request headers have a token header
   * @return {Promise} - Returns a Promise that, when fulfilled, will either return an JSON Object with the requested
   * data or an Error with the problem.
   */
  send(method, url, data = {}, params = {}) {
    let callURL = joinUrl(this.nodeEndpoint, url, {
      trailingSlash: false,
    });
    const headers = {};
    let body = '';
    let response;

    if (method === 'GET') {
      if (Object.keys(params).length && params.constructor === Object) {
        callURL = joinUrl(callURL, {
          trailingSlash: false,
          query: params,
        });
      }
      response = this.makeRequest(callURL, headers, method, params);
    } else {
      const callTokenURL = joinUrl(this.nodeEndpoint, 'tokenAction', {
        trailingSlash: false,
      });
      headers['Content-Type'] = 'application/json';
      body = data;

      response = this.makeRequestWithToken(
        callURL,
        callTokenURL,
        body,
        headers,
        method
      );
    }

    return response;
  }

  /**
   * This method call first to get a unique timestamp token, and then call
   * Api with token obtained before.
   *
   * @param callTokenURL
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  makeRequestWithToken(callURL, callTokenURL, data, headersParam, method) {
    return axios(callTokenURL, {
      method: 'POST',
    })
      .then(response => {
        console.log('makeRequestWithToken' + JSON.stringify(response.data));
        const headers = headersParam;
        headers.token = response.data.token;
        return this.makeRequest(callURL, headers, method, data);
      })
      .catch(error => {
        console.log(
          'makeRequestWithToken' + JSON.stringify(error.response.data)
        );
        Promise.reject({
          message: error.message,
          errors: JSON.stringify(error.response.data),
        });
      });
  }

  /**
   * This method make a sync request to fetch data from API
   *
   * @param callURL
   * @param headers
   * @param method
   * @param data
   * @returns {Promise<AxiosResponse<any>>} Returns a Promise that, when fulfilled, will either return an JSON Object with the requested
   * data or an Error with the problem
   */
  async makeRequest(callURL, headers, method, data) {
    return await axios(callURL, {
      method,
      data: data,
      headers: headers,
    })
      .then(response => {
        console.log('makeRequest' + JSON.stringify(response.data));
        return response.data;
      })
      .catch(error => {
        console.log('makeRequest' + JSON.stringify(error.response.data));
        Promise.reject({
          message: error.message,
          errors: JSON.stringify(error.response.data),
        });
      });
  }
}
