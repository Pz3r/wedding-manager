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
    expected_attendees: 1,
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
        expected_attendees: guest.expected_attendees || 1,
      });
    } else {
      setFormData({ name: '', email: '', phone: '', group_name: '', expected_attendees: 1 });
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
      setError(err instanceof Error ? err.message : 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={guest ? 'Editar Invitado' : 'Agregar Invitado'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Input
          label="Nombre completo"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Juan Pérez"
        />

        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="juan@ejemplo.com"
        />

        <Input
          label="Teléfono (opcional)"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+52 55 1234 5678"
        />

        <Input
          label="Grupo (opcional)"
          name="group_name"
          value={formData.group_name}
          onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
          placeholder="ej., Familia de la Novia, Amigos del Novio"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asistentes esperados
          </label>
          <select
            value={formData.expected_attendees || 1}
            onChange={(e) =>
              setFormData({ ...formData, expected_attendees: parseInt(e.target.value) })
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'persona' : 'personas'}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Cuántas personas puede traer este invitado (incluyéndose)
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {guest ? 'Guardar Cambios' : 'Agregar Invitado'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
