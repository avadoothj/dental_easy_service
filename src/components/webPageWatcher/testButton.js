'use client'

import { useTransition } from 'react';

export default function TestButton({ action }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button onClick={() => startTransition(action)} disabled={isPending}>
      {isPending ? 'Running...' : 'Test'}
    </button>
  );
}