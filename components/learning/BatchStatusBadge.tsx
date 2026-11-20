import { CircleCheck, Clock, Lock } from 'lucide-react';
import type { BatchStatus } from '@/types/common.types';

const BADGES = {
  completed: {
    icon: CircleCheck,
    label: 'Batch completed',
    className:
      'border-(--color-success-600) bg-(--color-success-100) text-(--color-success-600)',
  },
  not_started: {
    icon: Clock,
    label: 'Not started',
    className:
      'border-(--color-info-600) bg-(--color-info-100) text-(--color-info-600)',
  },
  inactive: {
    icon: Lock,
    label: 'Batch inactive',
    className:
      'border-(--color-warning-600) bg-(--color-warning-100) text-(--color-warning-600)',
  },
};

// Marks a paper whose batch is locked for the student: completed, not started yet, or an admin made
// them inactive in it. Its videos and materials are locked. Nothing for an active batch.
const BatchStatusBadge = ({ status }: { status?: BatchStatus }) => {
  if (
    status !== 'completed' &&
    status !== 'not_started' &&
    status !== 'inactive'
  )
    return null;
  const { icon: Icon, label, className } = BADGES[status];

  return (
    <span
      className={`absolute top-2 left-2 z-10 flex items-center gap-1 px-2 pt-0.5 rounded border ${className} Overline uppercase`}
    >
      <Icon className="w-3 h-3 -mt-0.5" />
      {label}
    </span>
  );
};

export default BatchStatusBadge;
