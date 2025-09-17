
import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"; 
import { NewsNavigation } from "@/components/news-navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portal de Notícias",
  description: "Seu portal de notícias atualizado",
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Início", href: "/" },
    { label: "Criar notícia", href: "/criar-noticia" },
  ];

  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen ">
          <NewsNavigation items={navItems} />
          {children}
          <footer className="border-t mt-12">
            <div className="container mx-auto px-4 py-6">
              <p className="text-center text-muted-foreground">
                © 2025 Portal de Notícias. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
