import { useState } from 'react';
import {
  EnvelopeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useInvitations } from '../hooks/useInvitations';
import InvitationStatus from '../components/invitations/InvitationStatus';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { formatDateTime } from '../lib/utils';
import type { InvitationWithRsvp } from '../types';

export default function Invitations() {
  const { invitations, loading, sending, resendInvitation } = useInvitations();
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationWithRsvp | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invitations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track invitation status and RSVP responses ({invitations.length} invitations)
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No invitations sent</h3>
          <p className="mt-1 text-sm text-gray-500">
            Go to the Guests page to send invitations.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RSVP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invitation.guests.name}
                      </div>
                      <div className="text-sm text-gray-500">{invitation.guests.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InvitationStatus status={invitation.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invitation.rsvp_responses ? (
                      <div className="flex items-center">
                        {invitation.rsvp_responses.attending ? (
                          <>
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                            <span className="text-sm text-green-700">
                              Attending ({invitation.rsvp_responses.party_size})
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                            <span className="text-sm text-red-700">Declined</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invitation.sent_at ? formatDateTime(invitation.sent_at) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {invitation.rsvp_responses && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedInvitation(invitation)}
                        >
                          View Details
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => resendInvitation(invitation.id)}
                        loading={sending}
                        title="Resend Invitation"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RSVP Details Modal */}
      <Modal
        isOpen={!!selectedInvitation}
        onClose={() => setSelectedInvitation(null)}
        title="RSVP Details"
      >
        {selectedInvitation?.rsvp_responses && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Guest</h4>
              <p className="text-sm text-gray-900">{selectedInvitation.guests.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Attending</h4>
              <Badge variant={selectedInvitation.rsvp_responses.attending ? 'green' : 'red'}>
                {selectedInvitation.rsvp_responses.attending ? 'Yes' : 'No'}
              </Badge>
            </div>

            {selectedInvitation.rsvp_responses.attending && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Party Size</h4>
                <p className="text-sm text-gray-900">
                  {selectedInvitation.rsvp_responses.party_size}{' '}
                  {selectedInvitation.rsvp_responses.party_size === 1 ? 'person' : 'people'}
                </p>
              </div>
            )}

            {selectedInvitation.rsvp_responses.dietary_restrictions && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Dietary Restrictions</h4>
                <p className="text-sm text-gray-900">
                  {selectedInvitation.rsvp_responses.dietary_restrictions}
                </p>
              </div>
            )}

            {selectedInvitation.rsvp_responses.message && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="text-sm text-gray-900">{selectedInvitation.rsvp_responses.message}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-500">Responded At</h4>
              <p className="text-sm text-gray-900">
                {formatDateTime(selectedInvitation.rsvp_responses.responded_at)}
              </p>
            </div>

            <div className="pt-4">
              <Button variant="secondary" onClick={() => setSelectedInvitation(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
