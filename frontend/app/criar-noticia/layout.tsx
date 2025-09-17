import type React from "react";
import "@/app/globals.css";

export default function CriarNoticiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div >
      <main>
        {children}
      </main>
    </div>
  );
}
