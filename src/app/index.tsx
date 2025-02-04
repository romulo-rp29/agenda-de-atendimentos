"use client";

import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/complete-registration`, // Redireciona para a página de completar cadastro
        },
      });

      if (error) throw error;

      setMessage("Email de confirmação enviado! Verifique sua caixa de entrada.");
    } catch (error) {
      setMessage(`Erro: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Cadastro - Receber Link de Confirmação</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Link"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
