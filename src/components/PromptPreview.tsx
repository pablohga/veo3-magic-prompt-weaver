
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Copy, 
  Download, 
  Share2, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles,
  CheckCircle2,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { PromptData } from "./PromptGenerator";
import { supabase } from "@/integrations/supabase/client";

interface PromptPreviewProps {
  promptData: PromptData;
  onBack: () => void;
  onStartOver: () => void;
}

export const PromptPreview = ({ promptData, onBack, onStartOver }: PromptPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Mapear valores selecionados para textos legíveis
  const getPovText = (pov: string) => {
    const povMap: { [key: string]: string } = {
      "pov-celular": "POV de quem está segurando o celular",
      "terceira-pessoa": "terceira pessoa, câmera distante seguindo a pessoa",
      "over-shoulder": "over-the-shoulder (atrás do ombro da personagem)",
      "primeira-pessoa": "primeira pessoa, como se fosse meus olhos",
      "drone-aereo": "vista aérea de drone seguindo o movimento",
      "close-up": "close-up focando nos detalhes faciais",
      "plano-medio": "plano médio mostrando corpo da cintura para cima",
      "plano-geral": "plano geral mostrando todo o cenário",
      "camera-baixa": "câmera baixa olhando para cima",
      "camera-alta": "câmera alta olhando para baixo"
    };
    return povMap[pov] || pov;
  };

  const getStyleText = (style: string) => {
    const styleMap: { [key: string]: string } = {
      "cinematografico": "filmado em estilo cinematográfico com luz suave",
      "vlog-tremido": "gravação tremida como um vlog",
      "vintage": "cores frias, com grão de filme e estética vintage",
      "documentary": "estilo documental realista e natural",
      "noir": "film noir com contrastes dramáticos de luz e sombra",
      "golden-hour": "golden hour com luz dourada e quente",
      "neon-cyberpunk": "iluminação neon estilo cyberpunk",
      "minimalista": "composição minimalista e limpa",
      "handheld": "câmera na mão com movimento orgânico",
      "steadicam": "movimento fluido de steadicam profissional"
    };
    return styleMap[style] || style;
  };

  // Gerar o prompt final
  const generateFinalPrompt = () => {
    const parts = [
      promptData.scene,
      getPovText(promptData.pov),
      promptData.environment,
      promptData.movements,
      promptData.emotion,
      promptData.sensory,
      getStyleText(promptData.style)
    ].filter(part => part.trim() !== "");

    let prompt = parts.join(", ");

    if (promptData.charactersCount.trim() !== "") {
      prompt += `, ${promptData.charactersCount} personagem${promptData.charactersCount === "1" ? "" : "s"} na cena`;
    }

    if (promptData.dialogLanguage.trim() !== "") {
      // Replace phrase with "Character speaks"
      prompt += `\n\nCharacter speaks\n\n${promptData.dialogLanguage}: `;
    }

    if (promptData.characterSpeech.trim() !== "") {
      prompt += `\n\n${promptData.characterSpeech}`;
    }

    return prompt;
  };

  const finalPrompt = generateFinalPrompt();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      toast({
        title: "Prompt copiado!",
        description: "O prompt foi copiado para sua área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o prompt.",
        variant: "destructive",
      });
    }
  };

  /* const savePromptToLibrary = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('prompts').insert({
        scene: promptData.scene,
        pov: promptData.pov,
        environment: promptData.environment,
        movements: promptData.movements,
        emotion: promptData.emotion,
        sensory: promptData.sensory,
        style: promptData.style,
        title: promptData.scene.substring(0, 50), // Assuming title is first 50 chars of scene
        final_prompt: finalPrompt,
        created_at: new Date().toISOString()
      });
      if (error) {
        toast({
          title: "Erro ao salvar",
          description: `Não foi possível salvar o prompt: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Prompt salvo!",
          description: "Seu prompt foi salvo na biblioteca com sucesso.",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado ao salvar o prompt.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }; */
  const savePromptToLibrary = async () => {
  setSaving(true);
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast({
        title: "Usuário não autenticado",
        description: "Você precisa estar logado para salvar prompts.",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("prompts").insert({
      scene: promptData.scene,
      pov: promptData.pov,
      environment: promptData.environment,
      movements: promptData.movements,
      emotion: promptData.emotion,
      sensory: promptData.sensory,
      style: promptData.style,
      title: promptData.scene.substring(0, 50),
      final_prompt: finalPrompt,
      created_at: new Date().toISOString(),
      user_id: user.id, // Adicionando o campo obrigatório
    });

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: `Não foi possível salvar o prompt: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Prompt salvo!",
        description: "Seu prompt foi salvo na biblioteca com sucesso.",
      });
    }
  } catch (err) {
    toast({
      title: "Erro ao salvar",
      description: "Ocorreu um erro inesperado ao salvar o prompt.",
      variant: "destructive",
    });
  } finally {
    setSaving(false);
  }
};

  const shareOnSocial = (platform: string) => {
    const text = `Acabei de criar um prompt incrível no VEO3 Magic Prompt! 🎬✨`;
    const url = window.location.href;
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const downloadPrompt = () => {
    const content = `PROMPT VEO3 MAGIC
===============

${finalPrompt}

---
Criado em: ${new Date().toLocaleDateString('pt-BR')}
Ferramenta: VEO3 Magic Prompt Weaver
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veo3-prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado!",
      description: "Seu prompt foi salvo como arquivo de texto.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-white hover:text-purple-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Edição
          </Button>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold text-white">Prompt Finalizado!</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Success Banner */}
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-200/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2 text-center">
                <Sparkles className="w-6 h-6 text-green-600" />
                <span className="text-xl text-purple-500 font-semibold">
                  Seu prompt cinematográfico está pronto para o VEO3!
                </span>
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Final Prompt Display */}
          <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
                Seu Prompt Final
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-200/30">
                <p className="text-white text-lg leading-relaxed font-mono">
                  {finalPrompt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copiado!" : "Copiar Prompt"}
                </Button>
                
                <Button 
                  onClick={downloadPrompt}
                  variant="outline"
                  className="border-black text-black hover:bg-purple-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar TXT
                </Button>
                
                <Button 
                  onClick={savePromptToLibrary}
                  disabled={saving}
                  variant="outline"
                  className="border-black text-black hover:bg-purple-500/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar na Biblioteca"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Share Section */}
          <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-purple-400" />
                Compartilhar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => shareOnSocial('twitter')}
                  variant="outline"
                  size="sm"
                  className="border-blue-400/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button 
                  onClick={() => shareOnSocial('facebook')}
                  variant="outline"
                  size="sm"
                  className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button 
                  onClick={() => shareOnSocial('linkedin')}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary of Steps */}
          <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Resumo das Etapas.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Cena", value: promptData.scene },
                { label: "Ponto de Vista", value: getPovText(promptData.pov) },
                { label: "Ambiente", value: promptData.environment },
                { label: "Movimentos", value: promptData.movements },
                { label: "Emoção", value: promptData.emotion },
                { label: "Elementos Sensoriais", value: promptData.sensory },
                { label: "Estilo Visual", value: getStyleText(promptData.style) }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 min-w-max">
                      {index + 1}. {item.label}
                    </Badge>
                    <p className="text-gray-300 text-sm flex-1">{item.value}</p>
                  </div>
                  {index < 6 && <Separator className="mt-4 bg-purple-200/20" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onStartOver}
              variant="outline"
              size="lg"
              className="border-purple-200/50 text-black hover:bg-purple-500/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Criar Novo Prompt
            </Button>
            <Button 
              onClick={async () => {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error || !user) {
                  window.location.href = "/auth";
                } else {
                  window.location.href = "/dashboard";
                }
              }}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ver Minha Biblioteca
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
