import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useInvitations } from '../hooks/useInvitations';
import InvitationStatus from '../components/invitations/InvitationStatus';
import { formatDateTime } from '../lib/utils';
import type { InvitationWithRsvp } from '../types';

function getLastUpdated(invitation: InvitationWithRsvp): string {
  const dates = [
    invitation.created_at,
    invitation.sent_at,
    invitation.opened_at,
    invitation.rsvp_responses?.responded_at,
    invitation.rsvp_responses?.updated_at,
  ].filter(Boolean) as string[];

  const latest = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  return latest ? formatDateTime(latest) : '-';
}

export default function Invitations() {
  const { invitations, loading } = useInvitations();

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
        <h1 className="text-2xl font-bold text-gray-900">Invitaciones</h1>
        <p className="mt-1 text-sm text-gray-500">
          Seguimiento de invitaciones y respuestas ({invitations.length} invitaciones)
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se han enviado invitaciones</h3>
          <p className="mt-1 text-sm text-gray-500">
            Ve a la página de Invitados para enviar invitaciones.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invitado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RSVP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enviada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
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
                            {invitation.rsvp_responses.party_size < invitation.guests.expected_attendees ? (
                              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                            ) : (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                            )}
                            <span className={`text-sm ${invitation.rsvp_responses.party_size < invitation.guests.expected_attendees ? 'text-yellow-700' : 'text-green-700'}`}>
                              Asiste ({invitation.rsvp_responses.party_size} de {invitation.guests.expected_attendees})
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                            <span className="text-sm text-red-700">Declinó</span>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getLastUpdated(invitation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
