import { PencilIcon, TrashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { GuestWithInvitation, InvitationStatus } from '../../types';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface GuestListProps {
  guests: GuestWithInvitation[];
  onEdit: (guest: GuestWithInvitation) => void;
  onDelete: (guest: GuestWithInvitation) => void;
  onSendInvitation: (guest: GuestWithInvitation) => void;
  onSendWhatsApp: (guest: GuestWithInvitation) => void;
}

function getLatestInvitationStatus(guest: GuestWithInvitation): InvitationStatus | null {
  if (!guest.invitations || guest.invitations.length === 0) return null;
  const sorted = [...guest.invitations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return sorted[0].status;
}

function getStatusBadge(status: InvitationStatus | null) {
  if (!status) {
    return <Badge variant="gray">Not Invited</Badge>;
  }

  const variants: Record<InvitationStatus, 'gray' | 'blue' | 'yellow' | 'green'> = {
    pending: 'gray',
    sent: 'blue',
    opened: 'yellow',
    responded: 'green',
  };

  const labels: Record<InvitationStatus, string> = {
    pending: 'Pending',
    sent: 'Sent',
    opened: 'Opened',
    responded: 'Responded',
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

export default function GuestList({ guests, onEdit, onDelete, onSendInvitation, onSendWhatsApp }: GuestListProps) {
  if (guests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No guests yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first guest.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Guest
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Group
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expected
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {guests.map((guest) => {
            const status = getLatestInvitationStatus(guest);
            return (
              <tr key={guest.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                    <div className="text-sm text-gray-500">{guest.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{guest.group_name || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{guest.expected_attendees}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {(!status || status === 'pending') && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSendInvitation(guest)}
                        title="Send Invitation via Email"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {guest.phone && (!status || status === 'pending') && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSendWhatsApp(guest)}
                        title="Send Invitation via WhatsApp"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(guest)}
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDelete(guest)}
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
