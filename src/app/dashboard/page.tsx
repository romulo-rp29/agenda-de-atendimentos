"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient"; // Ajuste o caminho conforme necessário
import { User } from "@supabase/supabase-js"; // Importando o tipo User

export default function Dashboard() {
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Definindo o tipo correto para user
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setMessage(`Erro ao carregar sessão: ${error.message}`);
      } else {
        setUser(data?.session?.user || null);
      }
      setLoading(false); // Finaliza o carregamento
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMessage("Você saiu da conta.");
    router.push("/login");
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe um indicador de carregamento enquanto verifica a sessão
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {user ? (
        // Se o usuário estiver autenticado, exibe a saudação e o botão de logout
        <div>
          <p>Bem-vindo, {user.email}!</p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        // Se não estiver autenticado, exibe botão para fazer login
        <button onClick={() => router.push("/login")}>Fazer Login</button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
