"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";

export default function CompleteRegistrationPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");  // Adicionando um campo para nome
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && data.user.email) {
        setEmail(data.user.email);  // Pegando o email da autenticação
      } else {
        setMessage("Erro: email não encontrado.");
      }
    };

    fetchUser();
  }, []);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
  
    if (!email) {
      setMessage("Erro: email não encontrado.");
      return;
    }
  
    try {
      // Atualiza a senha no Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
  
      if (updateError) throw updateError;
  
      // Obtendo o ID do usuário autenticado
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Erro ao obter usuário.");
  
      // Inserindo dados na tabela 'users'
      const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: userData.user.id, // ID do usuário autenticado
          name,
          email,
          role: "patient", // Definindo explicitamente o papel
        },
      ]);
  
      if (insertError) throw insertError;
  
      setMessage("Cadastro finalizado com sucesso!");
      router.push("/login");
    } catch (error) {
      setMessage(`Erro: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Complete seu Cadastro</h1>
      {email ? (
        <form onSubmit={handleRegister}>
          <p>Email: {email}</p>

          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            {loading ? "Salvando..." : "Finalizar Cadastro"}
          </button>
        </form>
      ) : (
        <p>Carregando informações...</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
