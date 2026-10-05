import { CircleCheck } from 'lucide-react';

// Marks a paper whose batch is completed; its videos and materials are locked
const BatchCompletedBadge = () => (
  <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 pt-0.5 rounded border border-(--color-success-600) bg-(--color-success-100) text-(--color-success-600) Overline uppercase">
    <CircleCheck className="w-3 h-3 -mt-0.5" />
    Batch completed
  </span>
);

export default BatchCompletedBadge;
