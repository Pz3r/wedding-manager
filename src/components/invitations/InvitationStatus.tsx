import Badge from '../ui/Badge';
import type { InvitationStatus as Status } from '../../types';

interface InvitationStatusProps {
  status: Status;
}

export default function InvitationStatus({ status }: InvitationStatusProps) {
  const config: Record<Status, { variant: 'gray' | 'blue' | 'yellow' | 'green'; label: string }> = {
    pending: { variant: 'gray', label: 'Pendiente' },
    sent: { variant: 'blue', label: 'Enviada' },
    opened: { variant: 'yellow', label: 'Abierta' },
    responded: { variant: 'green', label: 'Respondida' },
  };

  const { variant, label } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}
