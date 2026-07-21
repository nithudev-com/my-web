import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '64px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Page Not Found</h2>
      <p style={{ marginBottom: '32px', color: '#666' }}>Could not find the requested resource.</p>
      <Link href="/" style={{ padding: '12px 24px', background: '#D63062', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
        Return Home
      </Link>
    </div>
  );
}
