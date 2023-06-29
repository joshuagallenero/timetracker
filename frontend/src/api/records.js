import { axios } from '../services/axios';

export async function fetchTimeRecords() {
  const records = await axios.get('/time_records/');

  return records.map((record) => ({
    ...record,
    project: [{ id: record.project, name: record.project_name }],
    endTime: new Date(record.time_ended),
    startTime: new Date(record.time_started),
  }));
}

export async function createTimeRecord(data) {
  const payload = {
    ...data,
    time_ended: data.endTime,
    time_started: data.startTime,
  };

  return await axios.post('/time_records/', payload);
}

export async function partialUpdateTimeRecord({ data, queryParams }) {
  const { id } = queryParams;
  const payload = Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      const properties = {
        id: 'id',
        project: 'project',
        endTime: 'time_ended',
        startTime: 'time_started',
        description: 'description',
      };

      let dateValue;
      if (key === 'startTime' || key === 'endTime') {
        dateValue = value.toISOString();
      }

      return [properties[key], dateValue || value];
    }),
  );

  return await axios.patch(`/time_records/${id}/`, payload);
}
