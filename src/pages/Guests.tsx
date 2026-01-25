import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useGuests } from '../hooks/useGuests';
import { useInvitations } from '../hooks/useInvitations';
import GuestList from '../components/guests/GuestList';
import GuestForm from '../components/guests/GuestForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import type { Guest, GuestWithInvitation, GuestFormData } from '../types';

export default function Guests() {
  const { guests, loading, error, addGuest, updateGuest, deleteGuest } = useGuests();
  const { createAndSendInvitation, sending } = useInvitations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<GuestWithInvitation | null>(null);
  const [sendingToGuest, setSendingToGuest] = useState<GuestWithInvitation | null>(null);

  const handleAddGuest = () => {
    setEditingGuest(null);
    setIsFormOpen(true);
  };

  const handleEditGuest = (guest: GuestWithInvitation) => {
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: GuestFormData) => {
    if (editingGuest) {
      await updateGuest(editingGuest.id, data);
    } else {
      await addGuest(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingGuest) {
      await deleteGuest(deletingGuest.id);
      setDeletingGuest(null);
    }
  };

  const handleSendInvitation = async () => {
    if (sendingToGuest) {
      await createAndSendInvitation(sendingToGuest.id);
      setSendingToGuest(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your wedding guest list ({guests.length} guests)
          </p>
        </div>
        <Button onClick={handleAddGuest}>
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Guest
        </Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <GuestList
        guests={guests}
        onEdit={handleEditGuest}
        onDelete={setDeletingGuest}
        onSendInvitation={setSendingToGuest}
      />

      <GuestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        guest={editingGuest}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingGuest}
        onClose={() => setDeletingGuest(null)}
        title="Delete Guest"
      >
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete <strong>{deletingGuest?.name}</strong>? This action cannot
          be undone and will also delete any associated invitations.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setDeletingGuest(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* Send Invitation Confirmation Modal */}
      <Modal
        isOpen={!!sendingToGuest}
        onClose={() => setSendingToGuest(null)}
        title="Send Invitation"
      >
        <p className="text-sm text-gray-500 mb-4">
          Send a wedding invitation to <strong>{sendingToGuest?.name}</strong> at{' '}
          <strong>{sendingToGuest?.email}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setSendingToGuest(null)}>
            Cancel
          </Button>
          <Button onClick={handleSendInvitation} loading={sending}>
            Send Invitation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
