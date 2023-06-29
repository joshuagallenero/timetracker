import { axios } from '../services/axios';

export async function register(data) {
  const payload = {
    ...data,
    first_name: data.firstName,
    last_name: data.lastName,
  };
  return await axios.post('/auth/register', payload);
}

export async function login(data) {
  const payload = {
    ...data,
    username: data.email,
  };
  return await axios.post('/auth/login', payload);
}
