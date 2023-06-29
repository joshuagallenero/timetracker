import Axios from 'axios';

import { getFromStorage } from '../utils/storage';

function authRequestInterceptor(config) {
  const tokenObj = getFromStorage('token');

  if (!config.headers) {
    config.headers = {};
  }
  if (tokenObj.token) {
    config.headers.Authorization = `Token ${tokenObj.token}`;
  }

  config.headers.Accept = 'application/json';
  return config;
}

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);
