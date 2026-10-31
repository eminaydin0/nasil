import React from 'react';
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function text(value, fallback = '') {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  return clean || fallback;
}

function nameSize(name) {
  if (name.length > 42) return 52;
  if (name.length > 26) return 64;
  return 78;
}

function badge(key, label) {
  return React.createElement(
    'div',
    {
      key,
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 18px',
        borderRadius: 999,
        background: '#1a1814',
        color: '#fdba74',
        fontSize: 26,
        border: '2px solid rgba(249,115,22,0.45)',
      },
    },
    label
  );
}

export default async function handler(request) {
  const { searchParams, origin } = new URL(request.url);
  const name = text(searchParams.get('name'), 'Oyun');
  const category = text(searchParams.get('category'));
  const players = text(searchParams.get('players'));
  const minutes = text(searchParams.get('minutes'));
  const mark = (category || name).slice(0, 1).toLocaleUpperCase('tr-TR');
  const fontRes = await fetch(`${origin}/fonts/NotoSans-SemiBold.ttf`);
  if (!fontRes.ok) throw new Error('Kapak fontu yüklenemedi');
  const font = await fontRes.arrayBuffer();

  const badges = [
    category ? badge('c', category) : null,
    players ? badge('p', players) : null,
    minutes ? badge('t', `${minutes} dk`) : null,
  ].filter(Boolean);

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0c0b09',
          color: '#fafaf9',
          fontFamily: 'Noto Sans',
        },
      },
      React.createElement('div', { style: { width: 18, height: '100%', background: '#f97316' } }),
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '56px 68px 52px',
          },
        },
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 18 } },
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                width: 72,
                height: 72,
                borderRadius: 20,
                background: '#f97316',
                color: '#0c0b09',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
              },
            },
            mark
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', fontSize: 24, letterSpacing: 3, color: '#fdba74' } },
            'KURALI NE'
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', fontSize: nameSize(name), lineHeight: 1.05, letterSpacing: -1 } },
          name
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', gap: 14 } },
          ...(badges.length ? badges : [badge('d', 'Oyun rehberi')])
        )
      )
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Noto Sans', data: font, weight: 600 }],
    }
  );
}
