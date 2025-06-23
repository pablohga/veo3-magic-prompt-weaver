
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { PromptData } from "./PromptGenerator";

interface StepFormProps {
  step: number;
  promptData: PromptData;
  onUpdate: (field: keyof PromptData, value: string) => void;
}

export const StepForm = ({ step, promptData, onUpdate }: StepFormProps) => {
  const povOptions = [
    { value: "pov-celular", label: "POV de quem está segurando o celular" },
    { value: "terceira-pessoa", label: "Terceira pessoa, câmera distante seguindo a pessoa" },
    { value: "over-shoulder", label: "Over-the-shoulder (atrás do ombro da personagem)" },
    { value: "primeira-pessoa", label: "Primeira pessoa, como se fosse meus olhos" },
    { value: "drone-aereo", label: "Vista aérea de drone seguindo o movimento" },
    { value: "close-up", label: "Close-up focando nos detalhes faciais" },
    { value: "plano-medio", label: "Plano médio mostrando corpo da cintura para cima" },
    { value: "plano-geral", label: "Plano geral mostrando todo o cenário" },
    { value: "camera-baixa", label: "Câmera baixa olhando para cima" },
    { value: "camera-alta", label: "Câmera alta olhando para baixo" }
  ];

  const styleOptions = [
    { value: "cinematografico", label: "Filmado em estilo cinematográfico com luz suave" },
    { value: "vlog-tremido", label: "Gravação tremida como um vlog" },
    { value: "vintage", label: "Cores frias, com grão de filme e estética vintage" },
    { value: "documentary", label: "Estilo documental realista e natural" },
    { value: "noir", label: "Film noir com contrastes dramáticos de luz e sombra" },
    { value: "golden-hour", label: "Golden hour com luz dourada e quente" },
    { value: "neon-cyberpunk", label: "Iluminação neon estilo cyberpunk" },
    { value: "minimalista", label: "Composição minimalista e limpa" },
    { value: "handheld", label: "Câmera na mão com movimento orgânico" },
    { value: "steadicam", label: "Movimento fluido de steadicam profissional" }
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  🧠 <strong>Dica:</strong> Pense em uma situação específica e humana. 
                  Pode ser algo cotidiano como "acordar atrasado" ou emocional como "chorar de alívio".
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="scene" className="text-white">
                Descreva sua cena cotidiana ou emocional:
              </Label>
              <Textarea
                id="scene"
                placeholder="Ex: Uma mulher jovem acordando atrasada, correndo pela casa procurando as chaves..."
                value={promptData.scene}
                onChange={(e) => onUpdate('scene', e.target.value)}
                className="bg-white/10 border-purple-200/30 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  📍 <strong>Importante:</strong> O ponto de vista define como o espectador vai vivenciar a cena. 
                  Cada opção cria uma sensação diferente.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="pov" className="text-white">
                Escolha o ponto de vista da câmera:
              </Label>
              <Select value={promptData.pov} onValueChange={(value) => onUpdate('pov', value)}>
                <SelectTrigger className="bg-white/10 border-purple-200/30 text-white">
                  <SelectValue placeholder="Selecione um ponto de vista..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-200/30">
                  {povOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  🏠 <strong>Contexto é tudo:</strong> O ambiente ajuda a IA a posicionar corretamente o cenário. 
                  Seja específico sobre luz, espaço e atmosfera.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="environment" className="text-white">
                Descreva o ambiente e cenário:
              </Label>
              <Textarea
                id="environment"
                placeholder="Ex: em uma cozinha moderna iluminada por luz natural da manhã..."
                value={promptData.environment}
                onChange={(e) => onUpdate('environment', e.target.value)}
                className="bg-white/10 border-purple-200/30 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  🎬 <strong>Movimento é vida:</strong> Evite cenas estáticas. 
                  Pequenos gestos naturais fazem toda a diferença para parecer real.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="movements" className="text-white">
                Adicione movimentos humanos naturais:
              </Label>
              <Textarea
                id="movements"
                placeholder="Ex: ela mexe no cabelo nervosamente enquanto olha o relógio..."
                value={promptData.movements}
                onChange={(e) => onUpdate('movements', e.target.value)}
                className="bg-white/10 border-purple-200/30 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  😊 <strong>Emoção genuína:</strong> A expressão facial é o que conecta o espectador com o personagem. 
                  Seja sutil e específico.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="emotion" className="text-white">
                Descreva a expressão facial ou emoção:
              </Label>
              <Textarea
                id="emotion"
                placeholder="Ex: com um sorriso cansado mas aliviado no rosto..."
                value={promptData.emotion}
                onChange={(e) => onUpdate('emotion', e.target.value)}
                className="bg-white/10 border-purple-200/30 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  🎵 <strong>Desperte os sentidos:</strong> Som e toque dão profundidade à cena. 
                  Estes detalhes criam imersão total.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="sensory" className="text-white">
                Adicione elementos sensoriais (som, toque):
              </Label>
              <Textarea
                id="sensory"
                placeholder="Ex: som suave de chuva na janela e o tic-tac do relógio..."
                value={promptData.sensory}
                onChange={(e) => onUpdate('sensory', e.target.value)}
                className="bg-white/10 border-purple-200/30 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  🎨 <strong>Toque final:</strong> O estilo visual define a atmosfera geral do seu vídeo. 
                  Escolha o que melhor combina com sua história.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="style" className="text-white">
                Escolha o estilo visual ou cinematográfico:
              </Label>
              <Select value={promptData.style} onValueChange={(value) => onUpdate('style', value)}>
                <SelectTrigger className="bg-white/10 border-purple-200/30 text-white">
                  <SelectValue placeholder="Selecione um estilo visual..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-200/30">
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  🎭 <strong>Quantidade de personagens na cena:</strong> Informe o número de personagens presentes na cena.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="charactersCount" className="text-white">
                Quantidade de personagens:
              </Label>
              <Input
                id="charactersCount"
                type="number"
                min={1}
                placeholder="Ex: 3"
                value={promptData.charactersCount}
                onChange={(e) => onUpdate('charactersCount', e.target.value)}
                className="bg-white/10 border-purple-200/30 text-white placeholder-gray-400"
              />
            </div>
          </div>
        );

      case 9: {
        const languageOptions = [
          { value: "brasilian-portuguese", label: "Portuguese Brasil" },
          { value: "english", label: "English" },
          { value: "mandarin", label: "Mandarin Chinese" },
          { value: "spanish", label: "Spanish" },
          { value: "hindi", label: "Hindi" },
          { value: "arabic", label: "Arabic" },
          { value: "portuguese", label: "Portuguese" },
          { value: "bengali", label: "Bengali" },
          { value: "russian", label: "Russian" },
          { value: "japanese", label: "Japanese" },
          { value: "punjabi", label: "Punjabi" }
        ];
        return (
          <div className="space-y-4">
            <Card className="bg-purple-50/10 border-purple-200/30">
              <CardContent className="pt-4">
                <CardDescription className="text-gray-300 mb-4">
                  🗣️ <strong>Linguagem do diálogo do vídeo:</strong> Selecione a linguagem do diálogo.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="dialogLanguage" className="text-white">
                Linguagem do diálogo:
              </Label>
              <Select value={promptData.dialogLanguage} onValueChange={(value) => onUpdate('dialogLanguage', value)}>
                <SelectTrigger className="bg-white/10 border-purple-200/30 text-white">
                  <SelectValue placeholder="Selecione uma linguagem..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-200/30">
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return <div>{renderStepContent()}</div>;
};
