'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface Variation {
  name: string;
  component: ReactNode;
}

export function DesignToggle({
  label,
  variations,
  recommendation,
}: {
  label: string;
  variations: Variation[];
  recommendation?: number;
}) {
  const storageKey = `design-toggle-${label}`;
  const [active, setActive] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) setActive(Number(saved));
  }, [storageKey]);

  const select = (i: number) => {
    setActive(i);
    localStorage.setItem(storageKey, String(i));
  };

  return (
    <>
      {variations[active]?.component}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
            background: '#18181b',
            color: '#fafafa',
            borderRadius: 12,
            padding: collapsed ? '8px 12px' : 16,
            fontFamily: 'system-ui',
            fontSize: 13,
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            minWidth: collapsed ? 'auto' : 200,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <strong>{label}</strong>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                background: 'none',
                border: 'none',
                color: '#a1a1aa',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              {collapsed ? '+' : '−'}
            </button>
          </div>
          {!collapsed && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {variations.map((v, i) => (
                <button
                  key={v.name}
                  onClick={() => select(i)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 13,
                    background: active === i ? '#3b82f6' : '#27272a',
                    color: active === i ? '#fff' : '#d4d4d8',
                  }}
                >
                  {v.name}
                  {recommendation === i ? ' ★' : ''}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
