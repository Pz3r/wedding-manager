import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useGuests } from '../hooks/useGuests';
import { useInvitations } from '../hooks/useInvitations';
import { getRsvpUrl, getWhatsAppUrl } from '../lib/utils';
import GuestList from '../components/guests/GuestList';
import GuestForm from '../components/guests/GuestForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import type { Guest, GuestWithInvitation, GuestFormData } from '../types';

export default function Guests() {
  const { guests, loading, error, addGuest, updateGuest, deleteGuest, refetch: refetchGuests } = useGuests();
  const { createAndSendInvitation, getOrCreateInvitation, resendInvitation, sending } = useInvitations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<GuestWithInvitation | null>(null);
  const [sendingToGuest, setSendingToGuest] = useState<GuestWithInvitation | null>(null);
  const [whatsappGuest, setWhatsappGuest] = useState<GuestWithInvitation | null>(null);

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
    if (!sendingToGuest) return;

    // If the guest already has an invitation, resend it; otherwise create a new one
    const existingInvitation = sendingToGuest.invitations?.length
      ? [...sendingToGuest.invitations].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
      : null;

    const success = existingInvitation
      ? await resendInvitation(existingInvitation.id)
      : await createAndSendInvitation(sendingToGuest.id);

    setSendingToGuest(null);
    if (success) {
      await refetchGuests();
    }
  };

  const handleSendWhatsApp = async () => {
    if (!whatsappGuest) return;

    // Open window synchronously to avoid popup blockers
    const newWindow = window.open('', '_blank');

    const token = await getOrCreateInvitation(whatsappGuest);
    if (!token || !newWindow) {
      newWindow?.close();
      return;
    }

    const rsvpUrl = getRsvpUrl(token);
    const message =
      `¡Hola ${whatsappGuest.name}! ` +
      `Estamos muy emocionados de invitarte a celebrar nuestra boda. ` +
      `Por favor, confirma tu asistencia aquí: ${rsvpUrl} ` +
      `¡Esperamos verte pronto! Con cariño, Lili y José`;

    newWindow.location.href = getWhatsAppUrl(whatsappGuest.phone!, message);

    setWhatsappGuest(null);
    await refetchGuests();
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
          <h1 className="text-2xl font-bold text-gray-900">Invitados</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra tu lista de invitados ({guests.length} invitados)
          </p>
        </div>
        <Button onClick={handleAddGuest}>
          <PlusIcon className="h-5 w-5 mr-1" />
          Agregar Invitado
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
        onSendWhatsApp={setWhatsappGuest}
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
        title="Eliminar Invitado"
      >
        <p className="text-sm text-gray-500 mb-4">
          ¿Estás seguro de que quieres eliminar a <strong>{deletingGuest?.name}</strong>? Esta acción no se
          puede deshacer y también eliminará las invitaciones asociadas.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setDeletingGuest(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Eliminar
          </Button>
        </div>
      </Modal>

      {/* Send Invitation Confirmation Modal */}
      <Modal
        isOpen={!!sendingToGuest}
        onClose={() => setSendingToGuest(null)}
        title={sendingToGuest?.invitations?.length ? 'Reenviar Invitación' : 'Enviar Invitación'}
      >
        <p className="text-sm text-gray-500 mb-4">
          ¿{sendingToGuest?.invitations?.length ? 'Reenviar' : 'Enviar'} invitación de boda a{' '}
          <strong>{sendingToGuest?.name}</strong> a <strong>{sendingToGuest?.email}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setSendingToGuest(null)}>
            Cancelar
          </Button>
          <Button onClick={handleSendInvitation} loading={sending}>
            {sendingToGuest?.invitations?.length ? 'Reenviar Invitación' : 'Enviar Invitación'}
          </Button>
        </div>
      </Modal>

      {/* Send WhatsApp Invitation Confirmation Modal */}
      <Modal
        isOpen={!!whatsappGuest}
        onClose={() => setWhatsappGuest(null)}
        title="Enviar por WhatsApp"
      >
        <p className="text-sm text-gray-500 mb-4">
          ¿Enviar invitación de boda a <strong>{whatsappGuest?.name}</strong> por WhatsApp
          al <strong>{whatsappGuest?.phone}</strong>?
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Se abrirá WhatsApp con un mensaje precompuesto que contiene el enlace de confirmación.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setWhatsappGuest(null)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSendWhatsApp}
            loading={sending}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            Abrir WhatsApp
          </Button>
        </div>
      </Modal>
    </div>
  );
}
