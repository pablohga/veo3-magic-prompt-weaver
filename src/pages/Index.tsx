
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Video, Wand2, User } from "lucide-react";
import { PromptGenerator } from "@/components/PromptGenerator";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (showGenerator) {
    return <PromptGenerator onBack={() => setShowGenerator(false)} />;
  }

  const handleStartCreation = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowGenerator(true);
    }
  };

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
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user.email}</span>
                </div>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="text-white hover:text-purple-200"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/auth")}
                  className="text-white hover:text-purple-200"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by AI Magic
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Crie Prompts
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Cinematográficos
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transforme suas ideias em prompts profissionais para o VEO3. 
            Guiamos você através de 7 etapas essenciais para criar vídeos únicos e envolventes.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
            onClick={handleStartCreation}
          >
            <Play className="w-5 h-5 mr-2" />
            Começar Criação
          </Button>
          {!user && (
            <p className="text-gray-400 text-sm mt-4">
              <Button 
                variant="link" 
                onClick={() => navigate("/auth")}
                className="text-purple-300 hover:text-purple-200 p-0"
              >
                Crie uma conta
              </Button>
              {" "}para salvar seus prompts
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20 hover:bg-white/20 transition-all">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
                7 Etapas Guiadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Sistema passo-a-passo que garante prompts cinematográficos profissionais
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20 hover:bg-white/20 transition-all">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Video className="w-5 h-5 mr-2 text-purple-400" />
                Otimizado para VEO3
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Prompts especialmente desenvolvidos para maximizar os resultados do VEO3
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20 hover:bg-white/20 transition-all">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                Biblioteca Pessoal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Salve, edite e compartilhe seus prompts favoritos
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Como Funciona</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Cena Cotidiana", desc: "Defina a situação humana específica" },
              { step: "2", title: "Ponto de Vista", desc: "Escolha a perspectiva da câmera" },
              { step: "3", title: "Ambiente", desc: "Descreva o cenário e contexto" },
              { step: "4", title: "Movimentos", desc: "Adicione ações naturais e fluidas" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 VEO3 Magic Prompt. Criado para transformar ideias em vídeos incríveis.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
