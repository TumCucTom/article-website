import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { processMarkdown } from '@/lib/markdown';
import 'katex/dist/katex.min.css';

// Define the shape of the resolved params
interface ResolvedPageParams {
  slug: string;
}

// Define the props for the page component
interface ArticlePageProps {
  params: Promise<ResolvedPageParams>;
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Example if searchParams were also promises
}

async function getArticle(slug: string) {
  const articlesDirectory = path.join(process.cwd(), 'content/articles');
  const files = fs.readdirSync(articlesDirectory);
  
  const articleFile = files.find(file => {
    const title = file.replace(/\.(md|tex)$/, '');
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug;
  });

  if (!articleFile) {
    return null;
  }

  const content = fs.readFileSync(path.join(articlesDirectory, articleFile), 'utf8');
  const processedContent = await processMarkdown(content);
  
  return {
    title: articleFile.replace(/\.(md|tex)$/, ''),
    content: processedContent,
    date: fs.statSync(path.join(articlesDirectory, articleFile)).mtime.toISOString().split('T')[0]
  };
}

export default async function ArticlePage({ params: paramsPromise }: ArticlePageProps) {
  const params = await paramsPromise; // Await the promise to get the actual params object
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <time className="text-gray-500 text-sm mb-8 block">{article.date}</time>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </main>
  );
} 