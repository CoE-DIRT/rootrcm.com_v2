import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'ROOT | Revenue Operations & Outcomes Technology', description:'A technology-enabled operating partner for medical practices. Revenue cycle management, credentialing, DIRT intelligence and practice operations.', robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
