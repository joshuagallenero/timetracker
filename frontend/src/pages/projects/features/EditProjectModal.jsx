import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner } from 'baseui/banner';
import { Button } from 'baseui/button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';

import ProjectForm from './ProjectForm';

import { editProject } from '../../../api/projects';

export default function EditProjectModal({
  isOpen,
  setVisibility,
  initialValues,
}) {
  const queryClient = useQueryClient();
  const closeModal = () => setVisibility((prev) => !prev);

  const projectMutation = useMutation({
    mutationFn: editProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeModal();
    },
  });

  const handleSaveProject = (data) => {
    projectMutation.mutate({ payload: data, queryParams: { id: data.id } });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      closeable={!projectMutation.isLoading}
    >
      <ModalHeader>Edit Project</ModalHeader>
      <ModalBody>
        {projectMutation.isError && (
          <Banner
            title="Error editing project name"
            kind="negative"
            overrides={{ Root: { props: { className: 'mx-0' } } }}
          >
            Please try again.
          </Banner>
        )}
        <ProjectForm
          id="edit-project-form"
          initialValues={initialValues}
          onSubmitHandler={handleSaveProject}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          className="text-blue-400"
          kind="tertiary"
          size="compact"
          disabled={projectMutation.isLoading}
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-400 ml-2"
          form="edit-project-form"
          size="compact"
          type="submit"
          isLoading={projectMutation.isLoading}
        >
          Edit
        </Button>
      </ModalFooter>
    </Modal>
  );
}
