import { useState, useEffect, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Guest, GuestFormData } from '../../types';

interface GuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GuestFormData) => Promise<void>;
  guest?: Guest | null;
}

export default function GuestForm({ isOpen, onClose, onSubmit, guest }: GuestFormProps) {
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    phone: '',
    group_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        email: guest.email,
        phone: guest.phone || '',
        group_name: guest.group_name || '',
      });
    } else {
      setFormData({ name: '', email: '', phone: '', group_name: '' });
    }
    setError('');
  }, [guest, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={guest ? 'Edit Guest' : 'Add Guest'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
        />

        <Input
          label="Phone (optional)"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 234 567 8900"
        />

        <Input
          label="Group (optional)"
          name="group_name"
          value={formData.group_name}
          onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
          placeholder="e.g., Bride's Family, Groom's Friends"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {guest ? 'Save Changes' : 'Add Guest'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
