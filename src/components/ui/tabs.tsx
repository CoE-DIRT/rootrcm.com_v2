'use client';

import { useId, useState } from 'react';

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
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.id}`}
              id={`${baseId}-tab-${tab.id}`}
              className={selected ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
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
