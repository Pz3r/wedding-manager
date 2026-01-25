import { PencilIcon, TrashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { GuestWithInvitation, InvitationStatus } from '../../types';

interface GuestListProps {
  guests: GuestWithInvitation[];
  onEdit: (guest: GuestWithInvitation) => void;
  onDelete: (guest: GuestWithInvitation) => void;
  onSendInvitation: (guest: GuestWithInvitation) => void;
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

export default function GuestList({ guests, onEdit, onDelete, onSendInvitation }: GuestListProps) {
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
                        title="Send Invitation"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
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
