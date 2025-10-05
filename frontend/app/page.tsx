'use client'

import { NewsCard } from "@/components/news-card";
import { FeaturedNews } from "@/components/featured-news";
import { NewsHeader } from "@/components/news-header";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_NOTICIAS } from "@/configs";

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
        const response = await axios.get(`${API_NOTICIAS}`);
        const data = Array.isArray(response.data) ? response.data : [];

        const formattedArticles: Article[] = data.map((article: any) => {
          let imageSrc = "/placeholder.svg?height=400&width=600";

          if (article.image) {
            // Caso a imagem venha como base64 (armazenada no banco)
            if (article.image.startsWith("/9j/") || article.image.startsWith("iVBOR")) {
              imageSrc = `data:image/jpeg;base64,${article.image}`;
            }
            // Caso a imagem venha como URL (armazenada em pasta do backend)
            else if (article.image.startsWith("http") || article.image.startsWith("/uploads")) {
              imageSrc = article.image.startsWith("http")
                ? article.image
                : `${API_NOTICIAS}${article.image}`;
            }
          }

          return {
            id: article.id,
            title: article.title,
            description: article.description,
            image: imageSrc,
            date: new Date(article.date).toLocaleDateString("pt-BR"),
            content: article.content || "",
          };
        });

        setNewsArticles(formattedArticles);

        // Define a notícia mais recente como destaque
        if (formattedArticles.length > 0) {
          setFeaturedNews(formattedArticles[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        setError("Erro ao carregar as notícias.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Carregando notícias...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (newsArticles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Nenhuma notícia disponível no momento.
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <NewsHeader
        title="Últimas Notícias"
        subtitle="Fique por dentro das novidades mais recentes"
      />

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
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Notícia em Destaque
          </h2>
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
