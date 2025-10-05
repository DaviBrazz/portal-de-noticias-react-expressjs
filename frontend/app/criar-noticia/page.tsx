"use client";
import { API_NOTICIAS } from "@/configs";
import { useState, useRef } from "react";

export default function CriarNoticiaPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [imagemArquivo, setImagemArquivo] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido!");
      return;
    }

    setImagemArquivo(file);

    const reader = new FileReader();
    reader.onload = () => setImagemPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleClickArea = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagemArquivo) {
      alert("Por favor, selecione uma imagem antes de enviar!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("file", imagemArquivo);

      const response = await fetch(`${API_NOTICIAS}`, {
        method: "POST",
        body: formData, // 👈 multipart/form-data automático
      });

      if (!response.ok) throw new Error("Erro ao cadastrar notícia");

      alert("Notícia cadastrada com sucesso!");
      setForm({ title: "", description: "" });
      setImagemArquivo(null);
      setImagemPreview(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar notícia.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Criar Nova Notícia</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite a descrição"
              required
            />
          </div>

          {/* Área personalizada de upload */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Imagem</label>
            <div
              onClick={handleClickArea}
              className="w-full h-48 border-2 border-dashed border-blue-400 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-blue-50 transition"
            >
              {imagemPreview ? (
                <img
                  src={imagemPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-blue-600 font-medium">inserir imagem</p>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImagemChange}
              className="hidden"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Salvar Notícia
          </button>
        </form>
      </div>
    </div>
  );
}
