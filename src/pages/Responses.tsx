import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Badge from '../components/ui/Badge';
import { formatDateTime } from '../lib/utils';

interface RsvpDetail {
  response_id: string;
  attending: boolean;
  party_size: number;
  dietary_restrictions: string | null;
  message: string | null;
  notes: string | null;
  responded_at: string;
  guest_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  group_name: string | null;
  expected_attendees: number;
  invitation_status: string;
}

export default function Responses() {
  const { user } = useAuth();
  const [responses, setResponses] = useState<RsvpDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');

  useEffect(() => {
    const fetchResponses = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('rsvp_details')
          .select('*')
          .eq('user_id', user.id)
          .order('responded_at', { ascending: false });

        if (error) throw error;
        setResponses(data || []);
      } catch (err) {
        console.error('Failed to fetch responses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [user]);

  const filteredResponses = responses.filter((r) => {
    if (filter === 'attending') return r.attending;
    if (filter === 'declined') return !r.attending;
    return true;
  });

  const stats = {
    total: responses.length,
    attending: responses.filter((r) => r.attending).length,
    declined: responses.filter((r) => !r.attending).length,
    totalAttendees: responses
      .filter((r) => r.attending)
      .reduce((sum, r) => sum + r.party_size, 0),
    withDietary: responses.filter(
      (r) => r.attending && r.dietary_restrictions
    ).length,
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">RSVP Responses</h1>
        <p className="mt-1 text-sm text-gray-500">
          View all guest responses and dietary requirements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Responses</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Attending</p>
              <p className="text-2xl font-semibold text-green-600">
                {stats.attending}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Declined</p>
              <p className="text-2xl font-semibold text-red-600">
                {stats.declined}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-primary-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Attendees</p>
              <p className="text-2xl font-semibold text-primary-600">
                {stats.totalAttendees}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(['all', 'attending', 'declined'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === f
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {f === 'all' && `All (${stats.total})`}
            {f === 'attending' && `Attending (${stats.attending})`}
            {f === 'declined' && `Declined (${stats.declined})`}
          </button>
        ))}
      </div>

      {/* Responses List */}
      {filteredResponses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No responses yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Responses will appear here once guests RSVP.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResponses.map((response) => (
            <div
              key={response.response_id}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      response.attending ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {response.attending ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {response.guest_name}
                    </h3>
                    <p className="text-sm text-gray-500">{response.guest_email}</p>
                    {response.group_name && (
                      <Badge variant="gray" className="mt-1">
                        {response.group_name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={response.attending ? 'green' : 'red'}>
                    {response.attending ? 'Attending' : 'Declined'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(response.responded_at)}
                  </p>
                </div>
              </div>

              {response.attending && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Party Size
                    </p>
                    <p className="text-sm font-medium">
                      {response.party_size}{' '}
                      {response.party_size === 1 ? 'person' : 'people'}
                    </p>
                  </div>

                  {response.dietary_restrictions && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1 text-yellow-500" />
                        Dietary Requirements
                      </p>
                      <p className="text-sm font-medium text-yellow-700">
                        {response.dietary_restrictions}
                      </p>
                    </div>
                  )}

                  {response.notes && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Notes
                      </p>
                      <p className="text-sm">{response.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {response.message && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Message
                  </p>
                  <p className="text-sm text-gray-700 italic">
                    "{response.message}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dietary Summary */}
      {stats.withDietary > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Dietary Requirements Summary
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  {stats.withDietary} guest(s) with dietary requirements
                </p>
                <ul className="mt-2 space-y-1">
                  {responses
                    .filter((r) => r.attending && r.dietary_restrictions)
                    .map((r) => (
                      <li key={r.response_id} className="text-sm text-yellow-700">
                        <span className="font-medium">{r.guest_name}:</span>{' '}
                        {r.dietary_restrictions}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
