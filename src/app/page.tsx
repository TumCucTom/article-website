import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { generateSlug } from '@/lib/markdown';

interface Article {
  title: string;
  slug: string;
  date: string;
  codeLink?: string;
  deploymentLink?: string;
}

async function getArticles(): Promise<Article[]> {
  const articlesDirectory = path.join(process.cwd(), 'content/articles');
  const files = fs.readdirSync(articlesDirectory);
  
  const articles = files
    .filter(file => file.endsWith('.md') || file.endsWith('.tex'))
    .map(file => {
      const content = fs.readFileSync(path.join(articlesDirectory, file), 'utf8');
      const title = file.replace(/\.(md|tex)$/, '');
      
      // Extract code and deployment links from frontmatter
      const codeLinkMatch = content.match(/codeLink:\s*(.+)/);
      const deploymentLinkMatch = content.match(/deploymentLink:\s*(.+)/);
      
      return {
        title,
        slug: generateSlug(title),
        date: fs.statSync(path.join(articlesDirectory, file)).mtime.toISOString().split('T')[0],
        codeLink: codeLinkMatch ? codeLinkMatch[1].trim() : undefined,
        deploymentLink: deploymentLinkMatch ? deploymentLinkMatch[1].trim() : undefined
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Thomas Bale's Project Blog</h1>
      <div className="space-y-8">
        {articles.map((article) => (
          <article key={article.slug} className="border-b pb-6">
            <Link href={`/articles/${article.slug}`} className="hover:underline">
              <h2 className="text-2xl font-semibold">{article.title}</h2>
            </Link>
            <div className="flex gap-4 mt-2">
              {article.codeLink && (
                <a href={article.codeLink} target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-blue-600 hover:underline">
                  View Code →
                </a>
              )}
              {article.deploymentLink && (
                <a href={article.deploymentLink} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-blue-600 hover:underline">
                  Live Demo →
                </a>
              )}
            </div>
            <time className="text-gray-500 text-sm block mt-2">{article.date}</time>
          </article>
        ))}
      </div>
    </main>
  );
} 