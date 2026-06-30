import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug, isPublished: true }
  });

  if (!post) return {};

  return {
    title: `${post.title} | SpeedCommerce Blog`,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug, isPublished: true }
  });

  if (!post) return notFound();

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      
      {/* Hero Header */}
      <section style={{ background: '#09090b', color: '#fff', paddingTop: '80px', paddingBottom: post.coverImage ? '180px' : '80px', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <Link href="/blog" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <span>←</span> Back to Journal
          </Link>
          <div style={{ color: '#D63062', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            {post.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '900', margin: '0 auto', maxWidth: '800px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ marginTop: post.coverImage ? '-120px' : '0', position: 'relative', zIndex: 10 }}>
        
        {post.coverImage && (
          <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 48px', aspectRatio: '21/9', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ maxWidth: '720px', margin: '0 auto', background: '#fff', padding: '40px 48px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="blog-content">
          <style dangerouslySetInnerHTML={{ __html: `
            .blog-content { font-family: 'Inter', sans-serif; color: #334155; line-height: 1.8; font-size: 18px; }
            .blog-content h2 { color: #0f172a; font-size: 32px; font-weight: 800; margin-top: 48px; margin-bottom: 24px; letter-spacing: -0.02em; }
            .blog-content h3 { color: #0f172a; font-size: 24px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; }
            .blog-content p { margin-bottom: 24px; }
            .blog-content ul, .blog-content ol { margin-bottom: 24px; padding-left: 24px; }
            .blog-content li { margin-bottom: 8px; }
            .blog-content a { color: #D63062; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
            .blog-content blockquote { border-left: 4px solid #D63062; padding-left: 24px; margin: 32px 0; font-style: italic; color: #475569; font-size: 20px; }
            @media (max-width: 640px) {
              .blog-content { padding: 24px; font-size: 16px; }
            }
          `}} />
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </main>
  );
}
