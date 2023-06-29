import { axios } from '../services/axios';

export async function fetchProjects() {
  const projects = await axios.get('/projects/');

  return projects.map((project) => ({
    ...project,
  }));
}

export async function createProject(payload) {
  return await axios.post('/projects/', payload);
}

export async function editProject({ payload, queryParams }) {
  const { id } = queryParams;
  return await axios.put(`/projects/${id}/`, payload);
}
