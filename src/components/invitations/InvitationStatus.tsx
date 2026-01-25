import Badge from '../ui/Badge';
import type { InvitationStatus as Status } from '../../types';

interface InvitationStatusProps {
  status: Status;
}

export default function InvitationStatus({ status }: InvitationStatusProps) {
  const config: Record<Status, { variant: 'gray' | 'blue' | 'yellow' | 'green'; label: string }> = {
    pending: { variant: 'gray', label: 'Pending' },
    sent: { variant: 'blue', label: 'Sent' },
    opened: { variant: 'yellow', label: 'Opened' },
    responded: { variant: 'green', label: 'Responded' },
  };

  const { variant, label } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}
