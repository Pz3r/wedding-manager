import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import type { DashboardStats } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Get total guests
        const { count: totalGuests } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get invitations
        const { data: invitations } = await supabase
          .from('invitations')
          .select(`
            id,
            status,
            guests!inner (user_id)
          `)
          .eq('guests.user_id', user.id);

        const invitationIds = invitations?.map((i) => i.id) || [];

        // Get responses separately (more reliable than nested join with RLS)
        const { data: rsvpResponses } = await supabase
          .from('rsvp_responses')
          .select('invitation_id, attending, party_size')
          .in('invitation_id', invitationIds);

        // Create a map for quick lookup
        const responseMap = new Map(
          rsvpResponses?.map((r) => [r.invitation_id, r]) || []
        );

        const invitationsSent = invitations?.filter((i) => i.status !== 'pending').length || 0;

        // Count awaiting response by status (sent or opened, but not responded yet)
        const awaitingResponse = invitations?.filter((i) =>
          i.status === 'sent' || i.status === 'opened'
        ).length || 0;

        // Calculate confirmed/declined from responses
        let confirmed = 0;
        let declined = 0;
        let totalAttendees = 0;

        invitations?.forEach((inv) => {
          const response = responseMap.get(inv.id);
          if (response) {
            if (response.attending) {
              confirmed++;
              totalAttendees += response.party_size || 1;
            } else {
              declined++;
            }
          }
        });

        setStats({
          totalGuests: totalGuests || 0,
          invitationsSent,
          confirmed,
          declined,
          pending: awaitingResponse,
          totalAttendees,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Invitados',
      value: stats?.totalGuests || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      link: '/guests',
    },
    {
      name: 'Invitaciones Enviadas',
      value: stats?.invitationsSent || 0,
      icon: EnvelopeIcon,
      color: 'bg-purple-500',
      link: '/invitations',
    },
    {
      name: 'Confirmados',
      value: stats?.confirmed || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Declinaron',
      value: stats?.declined || 0,
      icon: XCircleIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Esperando Respuesta',
      value: stats?.pending || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Asistentes',
      value: stats?.totalAttendees || 0,
      icon: UsersIcon,
      color: 'bg-primary-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen de la gestión de invitados de tu boda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
            {stat.link && (
              <div className="bg-gray-50 px-5 py-3">
                <Link
                  to={stat.link}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Ver todos →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/guests">
            <Button>
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Agregar Invitados
            </Button>
          </Link>
          <Link to="/invitations">
            <Button variant="secondary">
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Ver Invitaciones
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => exportGuestList(stats)}>
            Exportar Lista de Invitados (CSV)
          </Button>
        </div>
      </div>

      {/* Response Summary */}
      {stats && stats.invitationsSent > 0 && (
        <div className="mt-8 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Respuestas</h2>
          <div className="space-y-4">
            <ProgressBar
              label="Tasa de Respuesta"
              value={stats.confirmed + stats.declined}
              max={stats.invitationsSent}
              color="bg-primary-500"
            />
            <ProgressBar
              label="Asistencia Confirmada"
              value={stats.confirmed}
              max={stats.confirmed + stats.declined || 1}
              color="bg-green-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {value} / {max} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

async function exportGuestList(stats: DashboardStats | null) {
  // This is a placeholder - in a real app, you'd fetch all guest data and create a CSV
  alert('Función de exportación CSV próximamente. Total de invitados: ' + (stats?.totalGuests || 0));
}
