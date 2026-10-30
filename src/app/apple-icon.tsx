import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Brand mark from approved ROOT navy/cyan tokens. Not a claimed registered logo file. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d2137',
          color: '#11e1ee',
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        R
      </div>
    ),
    size,
  );
}
