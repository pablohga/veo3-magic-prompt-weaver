import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "pablohga@gmail.com";

interface User {
  id: string;
  email: string;
}

const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // For add/edit user dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (user.email !== ADMIN_EMAIL) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar a área administrativa.",
        variant: "destructive",
      });
      // Instead of navigate to "/", redirect to dashboard to avoid redirect loop
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      // Map id to string if needed
      const usersWithStringId = data.map((user: { id: string | number; email: string }) => ({
        id: String(user.id),
        email: user.email,
      }));
      setUsers(usersWithStringId ?? []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddUserDialog = () => {
    setEditingUser(null);
    setEmailInput("");
    setPasswordInput("");
    setDialogOpen(true);
  };

  const openEditUserDialog = (user: User) => {
    setEditingUser(user);
    setEmailInput(user.email);
    setPasswordInput("");
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const { error } = await supabase.from("users").delete().eq("id", parseInt(userId));
      if (error) throw error;
      setUsers(users.filter(u => u.id !== userId));
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir usuário.",
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async () => {
    if (!emailInput) {
      toast({
        title: "Erro",
        description: "O email é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (editingUser) {
        const { error } = await supabase.from("profiles").update({ email: emailInput }).eq("id", editingUser.id);
        if (error) throw error;
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, email: emailInput } : u));
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso.",
        });
      } else {
        const { data, error } = await supabase.auth.admin.createUser({
          email: emailInput,
          password: passwordInput || undefined,
        });
        if (error) throw error;
        // data.user contains the user object
        const newUser = data?.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
        if (newUser) {
          setUsers([...users, newUser]);
        }
        toast({
          title: "Sucesso",
          description: "Usuário adicionado com sucesso.",
        });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar usuário.",
        variant: "destructive",
      });
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return null; // or loading spinner
  }

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Área Administrativa - Gerenciamento de Usuários</h1>
      <Button onClick={openAddUserDialog} className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
        Adicionar Usuário
      </Button>
      <Input
        type="text"
        placeholder="Pesquisar usuários..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="mb-4 p-2 rounded text-black w-full max-w-sm"
      />
      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <table className="w-full text-left border border-gray-700 rounded">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Email</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-2">{u.email}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openEditUserDialog(u)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Email</label>
              <Input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="Email do usuário"
              />
            </div>
            <div>
              <label className="block mb-1">Senha</label>
              <Input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Nova senha (deixe vazio para não alterar)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveUser} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
