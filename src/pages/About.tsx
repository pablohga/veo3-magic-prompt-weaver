import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Video } from "lucide-react";
import { Helmet } from 'react-helmet-async';

const About = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sobre o VEO3 e Magic Prompt Weaver - Criação de Vídeos Cinematográficos com IA</title>
        <meta name="description" content="Descubra o VEO3, a plataforma inovadora para criação de vídeos com inteligência artificial, e como o Magic Prompt Weaver facilita a geração de prompts cinematográficos profissionais para resultados incríveis." />
      </Helmet>
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

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 text-white max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">Sobre o VEO3 e Magic Prompt Weaver</h1>
          <p className="mb-4 text-lg leading-relaxed">
            O <strong>VEO3</strong> é uma plataforma revolucionária que utiliza inteligência artificial para a criação de vídeos cinematográficos de alta qualidade. Com o VEO3, criadores de conteúdo, cineastas e entusiastas podem transformar suas ideias em vídeos profissionais, envolventes e únicos.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            O <strong>Magic Prompt Weaver</strong> é a solução definitiva para um desafio comum dos usuários do VEO3: a elaboração de prompts detalhados e eficazes que garantem resultados excepcionais. Por meio de um sistema guiado em 10 etapas, o Magic Prompt Weaver ajuda a construir prompts cinematográficos precisos, otimizando o processo criativo e potencializando a qualidade dos vídeos gerados.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            Essa ferramenta inovadora simplifica a criação de prompts para o VEO3, economizando tempo e aumentando a produtividade dos usuários. Seja você um profissional do audiovisual ou um entusiasta da criação de vídeos com IA, o Magic Prompt Weaver é o assistente ideal para maximizar o potencial do VEO3 e alcançar resultados incríveis.
          </p>
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-200/20 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2024 VEO3 Magic Prompt. Criado para transformar ideias em vídeos incríveis.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default About;
