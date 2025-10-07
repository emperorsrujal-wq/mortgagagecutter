import { notFound } from 'next/navigation';
import { blogPosts, BlogPost } from '@/lib/blog-posts';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
    title: `${post.title} | Mortgage Cutter`,
    description: post.brief,
    openGraph: {
        title: post.title,
        description: post.brief,
        type: 'article',
        publishedTime: post.date,
        url: `https://mortgagecutter.com/blog/${post.slug}`,
    },
  };
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.brief,
    'datePublished': post.date,
    'author': {
        '@type': 'Organization',
        'name': 'Mortgage Cutter'
    },
    'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://mortgagecutter.com/blog/${post.slug}`
    }
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
        }
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <article className="container mx-auto py-12 px-4 max-w-3xl">
        <header className="mb-8">
          <Badge variant="secondary" className="mb-2">{post.cluster}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {post.title}
          </h1>
          <p className="text-muted-foreground">
            Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <p className="lead text-lg text-muted-foreground">{post.brief}</p>
          {post.h2Outline.map((h2, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold mt-8 mb-4">{h2}</h2>
              {/* This is where the full content for each section would go */}
              <p>Detailed content for the section titled "{h2}" will be generated here. This includes explanations, examples, and visuals to fully explore the topic and provide value to the reader.</p>
            </div>
          ))}
        </div>

        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {post.faqs.map((faq, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {post.internalLinks && post.internalLinks.length > 0 && (
            <div className="mt-12 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-4">Take the Next Step</h3>
                <ul className="list-disc list-inside space-y-2">
                    {post.internalLinks.map((link, index) => (
                        <li key={index}>
                            <Link href={link.url} className="text-primary hover:underline">
                                {link.anchor}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </article>
    </>
  );
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
