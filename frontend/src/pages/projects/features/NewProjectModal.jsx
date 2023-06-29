import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';

import ProjectForm from './ProjectForm';

import { createProject } from '../../../api/projects';

export default function NewProjectModal({ isOpen, setVisibility }) {
  const queryClient = useQueryClient();
  const closeModal = () => setVisibility(false);

  const projectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeModal();
    },
  });

  const handleSaveProject = (data) => {
    projectMutation.mutate(data);
    setVisibility((prev) => !prev);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      closeable={!projectMutation.isLoading}
    >
      <ModalHeader>Create Project</ModalHeader>
      <ModalBody>
        <ProjectForm
          id="new-project-form"
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
          form="new-project-form"
          size="compact"
          type="submit"
          isLoading={projectMutation.isLoading}
        >
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
}
