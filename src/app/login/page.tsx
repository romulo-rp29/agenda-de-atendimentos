"use client"; // Adicione essa linha no topo para habilitar o useState e useRouter

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correção aqui
import { supabase } from "../../utils/supabaseClient"; // Ajuste o caminho conforme necessário

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter(); // Agora está correto!

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setMessage("Login realizado com sucesso!");
      router.push("/dashboard"); // Redirecionamento correto
    } catch (error) {
      setMessage(`Erro: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
