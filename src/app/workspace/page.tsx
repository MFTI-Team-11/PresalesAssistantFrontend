import { Suspense } from 'react';
import { WorkspacePage } from '@/components/WorkspacePage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WorkspacePage />
    </Suspense>
  );
}
