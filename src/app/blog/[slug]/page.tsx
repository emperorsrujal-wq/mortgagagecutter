import { notFound } from 'next/navigation';
import Image from 'next/image';
import { blogPosts, BlogPost } from '@/lib/blog-posts';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
        title: post.title,
        description: post.metaDescription,
        type: 'article',
        publishedTime: post.date,
        url: `/blog/${post.slug}`,
        images: [
            {
                url: post.image.url,
                alt: post.image.alt,
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription,
        images: [post.image.url],
    },
  };
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://mortgagecutter.com/blog/${post.slug}`
    },
    'headline': post.title,
    'description': post.metaDescription,
    'image': post.image.url,
    'author': {
        '@type': 'Organization',
        'name': 'MortgageCutter'
    },
    'publisher': {
        '@type': 'Organization',
        'name': 'MortgageCutter',
        'logo': {
            '@type': 'ImageObject',
            'url': 'https://mortgagecutter.com/favicon.ico'
        }
    },
    'datePublished': post.date,
    'dateModified': post.date
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://mortgagecutter.com'
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://mortgagecutter.com/blog'
        },
        {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
        }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="container mx-auto py-12 px-4 max-w-3xl">
        <header className="mb-8">
          <Badge variant="secondary" className="mb-2">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {post.h1}
          </h1>
          <p className="text-muted-foreground">
            Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="prose dark:prose-invert max-w-none">
            <Image src={post.image.url} alt={post.image.alt} width={1200} height={630} className="rounded-lg mb-8" />
            
            <p className="lead text-lg text-muted-foreground">{post.brief}</p>

            <div className="my-8 p-4 bg-secondary rounded-lg">
                <h3 className="font-bold text-lg mb-2">Table of Contents</h3>
                <ul className="list-disc list-inside space-y-1">
                    {post.h2Outline.map((h2, index) => (
                        <li key={index}><a href={`#${h2.toLowerCase().replace(/\s+/g, '-')}`} className="text-primary hover:underline">{h2}</a></li>
                    ))}
                </ul>
            </div>

            {post.h2Outline.map((h2, index) => (
                <div key={index}>
                <h2 id={h2.toLowerCase().replace(/\s+/g, '-')} className="text-2xl font-semibold mt-10 mb-4 scroll-mt-20">{h2}</h2>
                
                {index === 1 && (
                    <div className="my-6 text-center">
                        <Button asChild>
                            <Link href="/questionnaire">Run your numbers → /mortgage-payoff-estimator</Link>
                        </Button>
                    </div>
                )}
                
                <p>Detailed content for the section titled "{h2}" will be generated here. This includes explanations, examples, and visuals to fully explore the topic and provide value to the reader. The target word count of {post.wordCount} words ensures each topic is covered in depth.</p>
                </div>
            ))}
        </div>

        <div className="my-8 p-4 border-l-4 border-primary bg-primary/10">
            <p className="font-semibold">Educational only, not financial advice. Estimates vary by spending patterns and lender terms.</p>
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
        
        <div className="mt-12 text-center">
            <Button size="lg" asChild>
                <Link href="/questionnaire">Try the Estimator (Free)</Link>
            </Button>
        </div>

        <div className="mt-12 p-6 bg-secondary rounded-lg">
            <h3 className="text-xl font-bold mb-4">Related Reading</h3>
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
      </article>
    </>
  );
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
