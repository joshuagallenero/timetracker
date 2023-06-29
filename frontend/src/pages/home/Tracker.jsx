import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Banner } from 'baseui/banner';
import { Button } from 'baseui/button';
import { useState } from 'react';

import TimeRecordForm from './features/TimeRecordForm';
import RecordsList from './RecordsList';

import { fetchProjects } from '../../api/projects';
import { createTimeRecord } from '../../api/records';
import NewProjectModal from '../projects/features/NewProjectModal';

export default function Tracker() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const taskMutation = useMutation({
    mutationFn: createTimeRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });

  const [modalVisibility, setModalVisibility] = useState(false);

  const handleSaveTask = (data, callback = '') => {
    taskMutation.mutate(data);

    // This is used to reset the time record form state after a successful request
    if (taskMutation.isSuccess) {
      callback();
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {taskMutation.isError && (
        <Banner
          title="Creation of a new time record error"
          kind="negative"
          overrides={{ Root: { props: { className: 'm-0' } } }}
        >
          Please try again.
        </Banner>
      )}
      {projectsQuery.isError && (
        <Banner
          title="Unable to fetch projects."
          kind="negative"
          overrides={{ Root: { props: { className: 'm-0' } } }}
        >
          Please
          <Button
            className="ml-[-4px] text-blue-400 text-base font-prompt underline hover:bg-transparent"
            kind="tertiary"
            size="compact"
            onClick={projectsQuery.refetch}
          >
            try again.
          </Button>
        </Banner>
      )}
      <NewProjectModal
        isOpen={modalVisibility}
        setVisibility={setModalVisibility}
      />
      <TimeRecordForm
        projects={projectsQuery.data}
        isLoading={taskMutation.isLoading || projectsQuery.isLoading}
        onSubmitHandler={handleSaveTask}
        setModalVisibility={setModalVisibility}
      />
      <RecordsList projects={projectsQuery.data} />
    </div>
  );
}
