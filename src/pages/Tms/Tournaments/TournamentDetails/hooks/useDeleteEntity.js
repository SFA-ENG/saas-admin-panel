import { useState } from 'react';
import { Modal, message } from 'antd';
import { useApiMutation } from 'hooks/useApiQuery/useApiQuery';
import { useNavigate } from 'react-router-dom';

export const useDeleteEntity = (tournamentId) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const deleteMutation = useApiMutation({
    url: `/tms/tournaments/${tournamentId}`,
    method: 'DELETE',
    headers: {
      'x-channel-id': 'WEB',
    },
    onSuccess: (data, variables) => {
      setIsDeleting(false);
      const { type } = variables;
      message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      
      // If tournament is deleted, navigate back to tournaments list
      if (type === 'tournament') {
        navigate('/tournaments');
      } else {
        // For other entities, reload the page to refresh data
        window.location.reload();
      }
    },
    onError: (error) => {
      setIsDeleting(false);
      message.error(`Failed to delete entity: ${error?.message || 'Unknown error'}`);
    },
  });

  const handleDelete = (type, entityName) => {
    Modal.confirm({
      title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: `Are you sure you want to delete "${entityName}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setIsDeleting(true);
        deleteMutation.mutate({ type });
      },
    });
  };

  return {
    handleDelete,
    isDeleting,
  };
}; 