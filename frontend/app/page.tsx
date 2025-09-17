'use client'

import { NewsCard } from "@/components/news-card";
import { FeaturedNews } from "@/components/featured-news";
import { NewsHeader } from "@/components/news-header";
import { useEffect, useState } from "react";
import axios from "axios";

interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  content?: string;
}

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [featuredNews, setFeaturedNews] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5400/api/noticias/listar");
        const formattedArticles: Article[] = response.data.map((article: any) => ({
          id: article.id,
          title: article.title,
          description: article.description,
          image: article.image || "/placeholder.svg?height=400&width=600",
          date: new Date(article.date).toLocaleDateString("pt-BR"),
          content: article.content || "",
        }));

        console.log('Formatted Articles:', formattedArticles); 
        setNewsArticles(formattedArticles);
       
      } catch (err) {
        setError("Erro ao carregar as notícias.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (newsArticles.length === 0) {
    return <div>Não há notícias disponíveis.</div>;
  }

  console.log('Featured News:', featuredNews); // Debugging log

  return (
    <main className="container mx-auto px-4 py-8">
      <NewsHeader title="Últimas Notícias" subtitle="Fique por dentro das novidades mais recentes" />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article) => (
          <NewsCard
            key={article.id}
            id={article.id}
            title={article.title}
            description={article.description}
            image={article.image}
            date={article.date}
          />
        ))}
      </section>
      {featuredNews && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Notícia em Destaque</h2>
          <FeaturedNews
            id={featuredNews.id}
            title={featuredNews.title}
            description={featuredNews.description}
            image={featuredNews.image}
            date={featuredNews.date}
            content={featuredNews.content || "Conteúdo não disponível"}
          />
        </section>
      )}
    </main>
  );
}
