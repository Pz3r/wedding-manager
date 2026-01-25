import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { RsvpFormData } from '../types';

interface InvitationData {
  invitation_id: string;
  guest_name: string;
  guest_email: string;
  invitation_status: string;
  existing_response: RsvpFormData | null;
}

export default function Rsvp() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<RsvpFormData>({
    attending: true,
    party_size: 1,
    dietary_restrictions: '',
    message: '',
  });

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        // Mark invitation as opened
        await supabase
          .from('invitations')
          .update({ status: 'opened', opened_at: new Date().toISOString() })
          .eq('token', token)
          .eq('status', 'sent');

        // Get invitation details
        const { data, error: fetchError } = await supabase.rpc('get_invitation_by_token', {
          invitation_token: token,
        });

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          setError('Invitation not found or has expired');
          return;
        }

        const invData = data[0] as InvitationData;
        setInvitation(invData);

        // If already responded, pre-fill the form
        if (invData.existing_response) {
          setFormData({
            attending: invData.existing_response.attending,
            party_size: invData.existing_response.party_size || 1,
            dietary_restrictions: invData.existing_response.dietary_restrictions || '',
            message: invData.existing_response.message || '',
          });
          setSubmitted(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    setSubmitting(true);
    setError('');

    try {
      // Submit RSVP response
      const { error: submitError } = await supabase.from('rsvp_responses').insert({
        invitation_id: invitation.invitation_id,
        attending: formData.attending,
        party_size: formData.attending ? formData.party_size : 0,
        dietary_restrictions: formData.dietary_restrictions || null,
        message: formData.message || null,
      });

      if (submitError) {
        // Check if it's a duplicate
        if (submitError.code === '23505') {
          // Update existing response
          const { error: updateError } = await supabase
            .from('rsvp_responses')
            .update({
              attending: formData.attending,
              party_size: formData.attending ? formData.party_size : 0,
              dietary_restrictions: formData.dietary_restrictions || null,
              message: formData.message || null,
              responded_at: new Date().toISOString(),
            })
            .eq('invitation_id', invitation.invitation_id);

          if (updateError) throw updateError;
        } else {
          throw submitError;
        }
      }

      // Update invitation status
      await supabase
        .from('invitations')
        .update({ status: 'responded' })
        .eq('id', invitation.invitation_id);

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">{formData.attending ? '🎉' : '💔'}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {formData.attending ? 'Thank You!' : "We'll Miss You!"}
          </h1>
          <p className="text-gray-600 mb-4">
            {formData.attending
              ? `We're so excited to celebrate with you${
                  formData.party_size > 1 ? ` and your ${formData.party_size - 1} guest(s)` : ''
                }!`
              : "Thank you for letting us know. We'll miss having you there!"}
          </p>
          {formData.attending && (
            <div className="bg-primary-50 rounded-lg p-4 text-left">
              <h3 className="font-medium text-primary-900 mb-2">Your RSVP Details:</h3>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>Party size: {formData.party_size}</li>
                {formData.dietary_restrictions && (
                  <li>Dietary needs: {formData.dietary_restrictions}</li>
                )}
              </ul>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-6">
            Need to make changes? Just refresh this page and update your response.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setSubmitted(false)}
          >
            Update Response
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8 text-center text-white">
            <h1 className="text-3xl font-bold mb-2">You're Invited!</h1>
            <p className="opacity-90">Dear {invitation?.guest_name}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Attending Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Will you be attending?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: true })}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                    formData.attending
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  ✓ Yes, I'll be there!
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: false })}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                    !formData.attending
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  ✗ Sorry, can't make it
                </button>
              </div>
            </div>

            {formData.attending && (
              <>
                {/* Party Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How many people in your party? (including yourself)
                  </label>
                  <select
                    value={formData.party_size}
                    onChange={(e) =>
                      setFormData({ ...formData, party_size: parseInt(e.target.value) })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <Input
                    label="Any dietary restrictions or allergies?"
                    name="dietary"
                    value={formData.dietary_restrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, dietary_restrictions: e.target.value })
                    }
                    placeholder="e.g., Vegetarian, Gluten-free, Nut allergy"
                  />
                </div>
              </>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Any message for the couple? (optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Share your well wishes..."
              />
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              Submit RSVP
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
