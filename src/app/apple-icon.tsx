import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Renders the recovered Demo 6 mark.webp. Does not redraw the logo. */
export default async function AppleIcon() {
  const mark = await readFile(join(process.cwd(), 'public/brand/mark.webp'));
  const src = `data:image/webp;base64,${mark.toString('base64')}`;
  const width = 148;
  const height = Math.round((width * 243) / 250);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#071422',
      }}
    >
        {/* next/og ImageResponse only accepts a native img, and the src is the original WebP. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={width} height={height} alt="" />
    </div>,
    { ...size },
  );
}
