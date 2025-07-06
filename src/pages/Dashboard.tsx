
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Plus, 
  Search, 
  Heart, 
  Edit, 
  Trash2, 
  Download, 
  Share2, 
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PromptGenerator, PromptData } from "@/components/PromptGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SavedPrompt {
  id: string;
  title: string;
  scene: string;
  pov: string;
  environment: string;
  movements: string;
  emotion: string;
  sensory: string;
  style: string;
  final_prompt: string;
  is_favorite: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPrompts();
  }, [user, navigate]);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prompts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompt = async (promptData: PromptData, title: string) => {
    if (!user) return;

    const finalPrompt = `${promptData.scene}. ${promptData.pov}. ${promptData.environment}. ${promptData.movements}. ${promptData.emotion}. ${promptData.sensory}. ${promptData.style}.`;

    try {
      const { error } = await supabase
        .from('prompts')
        .insert([
          {
            user_id: user.id,
            title,
            scene: promptData.scene,
            pov: promptData.pov,
            environment: promptData.environment,
            movements: promptData.movements,
            emotion: promptData.emotion,
            sensory: promptData.sensory,
            style: promptData.style,
            final_prompt: finalPrompt,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Prompt salvo!",
        description: "Seu prompt foi salvo com sucesso.",
      });

      fetchPrompts();
      setShowGenerator(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o prompt.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .update({ is_favorite: !currentFavorite })
        .eq('id', id);

      if (error) throw error;
      fetchPrompts();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o favorito.",
        variant: "destructive",
      });
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Prompt excluído",
        description: "O prompt foi excluído com sucesso.",
      });
      
      fetchPrompts();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o prompt.",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = async (prompt: SavedPrompt) => {
    // Implementação simples de exportação
    const content = `
TÍTULO: ${prompt.title}

PROMPT FINAL:
${prompt.final_prompt}

DETALHES:
- Cena: ${prompt.scene}
- POV: ${prompt.pov}
- Ambiente: ${prompt.environment}
- Movimentos: ${prompt.movements}
- Emoção: ${prompt.emotion}
- Elementos Sensoriais: ${prompt.sensory}
- Estilo: ${prompt.style}

Criado em: ${new Date(prompt.created_at).toLocaleDateString('pt-BR')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado!",
      description: "Prompt exportado como arquivo de texto.",
    });
  };

  const sharePrompt = async (prompt: SavedPrompt) => {
    const shareText = `Confira este prompt para VEO3: "${prompt.title}"\n\n${prompt.final_prompt}\n\nCriado com VEO3 Magic Prompt`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: shareText,
        });
      } catch (error) {
        // Fallback para copiar para clipboard
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copiado!",
          description: "Prompt copiado para a área de transferência.",
        });
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copiado!",
        description: "Prompt copiado para a área de transferência.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.final_prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showGenerator) {
    return (
      <PromptGenerator 
        onBack={() => setShowGenerator(false)}
        onSave={handleSavePrompt}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VEO3 Magic Prompt</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{user?.email}</span>
            </div>
            {user?.email === "pablohga@gmail.com" && (
              <Button
                variant="ghost"
                onClick={() => navigate("/admin")}
                className="text-white hover:text-purple-200"
              >
                Admin
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="text-white hover:text-purple-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Meus Prompts</h1>
              <p className="text-gray-300">Gerencie e organize seus prompts para VEO3</p>
            </div>
            <Button
              onClick={() => setShowGenerator(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Prompt
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-purple-200/50 text-white placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="text-center text-white">Carregando prompts...</div>
          ) : filteredPrompts.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20">
              <CardContent className="text-center py-12">
                <p className="text-gray-300 mb-4">
                  {searchTerm ? "Nenhum prompt encontrado." : "Você ainda não criou nenhum prompt."}
                </p>
                <Button
                  onClick={() => setShowGenerator(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro prompt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <Card key={prompt.id} className="bg-white/10 backdrop-blur-sm border-purple-200/20 hover:bg-white/20 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{prompt.title}</CardTitle>
                        <CardDescription className="text-gray-300 text-sm line-clamp-3">
                          {prompt.final_prompt}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(prompt.id, prompt.is_favorite)}
                        className="text-gray-300 hover:text-pink-300"
                      >
                        <Heart className={`w-4 h-4 ${prompt.is_favorite ? 'fill-pink-500 text-pink-500' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-purple-100/20 text-purple-200">
                        {new Date(prompt.created_at).toLocaleDateString('pt-BR')}
                      </Badge>
                      {prompt.is_favorite && (
                        <Badge variant="secondary" className="bg-pink-100/20 text-pink-200">
                          Favorito
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sharePrompt(prompt)}
                        className="bg-purple-500/20 border-purple-200/50 text-white hover:bg-purple-500/20"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportToPDF(prompt)}
                        className="bg-purple-500/20 border-purple-200/50 text-white hover:bg-purple-500/20"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePrompt(prompt.id)}
                        className="border-red-200/50 text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
