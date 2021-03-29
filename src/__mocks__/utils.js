jest.mock('axios');

import axios from 'axios';

const { handleResponse } = jest.requireActual('../utils');

const mockAxios = axios.create();

function createClient() {
  return mockAxios;
}

export { handleResponse, createClient };
