import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner } from 'baseui/banner';
import { Button } from 'baseui/button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';

import { deleteTimeRecord } from '../../../api/records';

export default function DeleteRecordModal({ recordId, isOpen, setVisibility }) {
  const queryClient = useQueryClient();
  const closeModal = () => setVisibility((prev) => !prev);

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTimeRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      closeModal();
    },
  });

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(recordId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      closeable={!deleteTaskMutation.isLoading}
    >
      <ModalHeader>Delete Record</ModalHeader>
      <ModalBody>
        {deleteTaskMutation.isError ? (
          <Banner
            title="Error deleting record"
            kind="negative"
            overrides={{ Root: { props: { className: 'mx-0' } } }}
          >
            Please try again.
          </Banner>
        ) : (
          <>Are you sure you want to delete this record?</>
        )}
      </ModalBody>
      <ModalFooter>
        {!deleteTaskMutation.isError ? (
          <>
            <Button
              kind="tertiary"
              size="compact"
              disabled={deleteTaskMutation.isLoading}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-400 ml-2"
              form="edit-project-form"
              size="compact"
              isLoading={deleteTaskMutation.isLoading}
              onClick={handleDeleteTask}
            >
              Yes
            </Button>
          </>
        ) : (
          <Button
            kind="tertiary"
            size="compact"
            disabled={deleteTaskMutation.isLoading}
            onClick={closeModal}
          >
            Close
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
