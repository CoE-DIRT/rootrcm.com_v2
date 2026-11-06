'use client';

import { useId, useState } from 'react';
import { Button } from './Button';

export function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}) {
  const baseId = useId();
  const [active, setActive] = useState(tabs[0]?.id);
  return (
    <div>
      <div role="tablist" aria-label="Sections" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <Button
              key={tab.id}
              variant="secondary"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.id}`}
              id={`${baseId}-tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
          className="mt-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
