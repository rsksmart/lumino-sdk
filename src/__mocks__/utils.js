jest.mock('axios');

import axios from 'axios';

const { handleResponse, handleResponseStatus } = jest.requireActual('../utils');

const mockAxios = axios.create();

function createClient() {
  return mockAxios;
}

export { handleResponse, handleResponseStatus, createClient };
