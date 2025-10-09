import Link from 'next/link';
import { blogPosts } from '@/lib/blog-posts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MortgageCutter Blog — Pay Off Your Mortgage Faster',
    description: 'Actionable guides, tools, and how-tos to pay off your mortgage faster without raising your monthly spend.',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
          MortgageCutter Blog
        </h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Actionable guides to finish your mortgage sooner—with the same budget.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="flex">
            <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300 w-full">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{post.brief}</p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
