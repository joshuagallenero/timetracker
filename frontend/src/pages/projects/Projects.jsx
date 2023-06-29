import { useQuery } from '@tanstack/react-query';
import { Banner } from 'baseui/banner';
import { Button } from 'baseui/button';
import { Skeleton } from 'baseui/skeleton';
import { useState } from 'react';
import { Clock, Edit, Edit2, Folder, FolderPlus } from 'react-feather';

import EditProjectModal from './features/EditProjectModal';

import { fetchProjects } from '../../api/projects';
import addDurationStrings from '../../utils/addDurationStrings';
import durationFormatter from '../../utils/durationFormatter';
import NewProjectModal from '../projects/features/NewProjectModal';

export default function Projects() {
  const {
    refetch,
    isLoading,
    isError,
    data: projects,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const [createModalVisibility, setCreateModalVisibility] = useState(false);
  const [editModalVisibility, setEditModalVisibility] = useState(false);

  const [projectId, setProjectId] = useState('');

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-16">
        <Skeleton rows={4} width="100%" animation />
        <div className="space-y-8">
          <Skeleton rows={2} width="100%" animation />
          <Skeleton rows={2} width="100%" animation />
          <Skeleton rows={2} width="100%" animation />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-full font-prompt bg-white p-4 md:grid">
        <div className="max-w-max">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Error
            </h3>
            <p className="mt-1 text-base text-gray-500">
              Failed to load data, please try again.
            </p>
          </div>
          <div className="mt-5">
            <Button kind="secondary" size="compact" onClick={refetch}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !isError && projects.length < 1) {
    return (
      <div
        role="list"
        aria-label="comments"
        className="flex flex-col justify-center items-center space-y-2 pt-4 text-gray-500"
      >
        <Folder className="h-10 w-10" />
        <h4>No projects. Create a project now!</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-6">
      {isError && (
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
            onClick={() => refetch()}
          >
            try again.
          </Button>
        </Banner>
      )}
      <NewProjectModal
        isOpen={createModalVisibility}
        setVisibility={setCreateModalVisibility}
      />
      <EditProjectModal
        initialValues={projects.find((project) => project.id === projectId)}
        isOpen={editModalVisibility}
        setVisibility={setEditModalVisibility}
      />

      <div className="flex items-center justify-between">
        <h1>Projects</h1>
        <Button
          className="bg-blue-400 text-sm"
          overrides={{
            StartEnhancer: { props: { className: 'max-[576px]:mr-0' } },
          }}
          startEnhancer={<FolderPlus size={20} />}
          size="compact"
          onClick={() => setCreateModalVisibility((prev) => !prev)}
        >
          <span className="max-[575px]:hidden inline-flex">New project</span>
        </Button>
      </div>

      <ul className="flex flex-col space-y-4 mb-4">
        {projects.map((project, index) => (
          <li key={project.id || index}>
            <div className="bg-white border rounded-md shadow-md shrink-0 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-400 inline-flex items-center  max-w-[50%]">
                  <span className="line-clamp-1 min-[576px]:line-clamp-none min-[576px]:max-w-fit">
                    {project.name}
                  </span>
                  <Button
                    className="bg-blue-400 text-sm p-2 ml-2"
                    overrides={{
                      StartEnhancer: {
                        props: { className: 'mr-0 p-0' },
                      },
                    }}
                    size="compact"
                    startEnhancer={<Edit size={16} />}
                    onClick={() => {
                      setProjectId(project.id);
                      setEditModalVisibility((prev) => !prev);
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="inline-flex items-center text-xs min-[576px]:text-sm">
                    <Clock className="text-blue-400 mr-2 min-[576px]:hidden" />
                    <span className="hidden min-[576px]:inline-flex">
                      Total hours tracked:
                    </span>
                    <span className="min-[576px]:ml-2 font-semibold">
                      {project.records.length > 0
                        ? durationFormatter(
                            project.records
                              .map((record) => record.duration)
                              .reduce((accumulator, currentValue) =>
                                addDurationStrings(accumulator, currentValue),
                              ),
                          )
                        : '00h 00m 00s'}
                    </span>
                  </div>
                  <div className="inline-flex items-center text-sm">
                    <Edit2 className="text-blue-400 mr-2 min-[576px]:hidden" />
                    <span className="hidden min-[576px]:inline-flex">
                      Total tasks logged:
                    </span>
                    <span className="min-[576px]:ml-4 font-semibold">
                      {project.records.length}{' '}
                      {project.records.length > 1 ? 'Tasks' : 'Task'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
