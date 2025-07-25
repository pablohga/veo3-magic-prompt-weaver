
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Video, Save } from "lucide-react";
import { StepForm } from "./StepForm";
import { PromptPreview } from "./PromptPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface PromptData {
  scene: string;
  pov: string;
  environment: string;
  movements: string;
  emotion: string;
  sensory: string;
  style: string;
}

interface PromptGeneratorWithSaveProps {
  onBack: () => void;
  onSave?: (promptData: PromptData, title: string) => void;
}

export const PromptGeneratorWithSave = ({ onBack, onSave }: PromptGeneratorWithSaveProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [promptData, setPromptData] = useState<PromptData>({
    scene: "",
    pov: "",
    environment: "",
    movements: "",
    emotion: "",
    sensory: "",
    style: ""
  });
  const [title, setTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    "Cena Cotidiana ou Emocional",
    "Ponto de Vista (POV)",
    "Ambiente",
    "Movimentos Naturais",
    "Expressão e Emoção",
    "Elementos Sensoriais",
    "Estilo Visual"
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePromptData = (field: keyof PromptData, value: string) => {
    setPromptData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave && title.trim()) {
      onSave(promptData, title);
      setIsDialogOpen(false);
    }
  };

  if (currentStep > totalSteps) {
    return (
      <PromptPreview 
        promptData={promptData} 
        onBack={() => setCurrentStep(totalSteps)}
        onStartOver={() => {
          setCurrentStep(1);
          setPromptData({
            scene: "",
            pov: "",
            environment: "",
            movements: "",
            emotion: "",
            sensory: "",
            style: ""
          });
        }}
        onSave={onSave ? () => setIsDialogOpen(true) : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="text-white hover:text-purple-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-2">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
              
            </div> */}
            <img src="/images/logo_veo3magic.png" alt="VEO3 Magic Prompt Logo" style={{ height: "4.75rem" }} className="" />
            {/* <span className="text-2xl font-bold text-white">VEO3 Magic Prompt</span> */}
          
            </div>
          </div>
          <div className="text-white text-sm">
            Etapa {currentStep} de {totalSteps}
          </div>
        </nav>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-gray-300">
            <span>Início</span>
            <span>{Math.round(progress)}% Completo</span>
            <span>Finalizar</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-purple-200/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">
                {stepTitles[currentStep - 1]}
              </CardTitle>
              <div className="w-full bg-gray-200/20 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <StepForm
                step={currentStep}
                promptData={promptData}
                onUpdate={updatePromptData}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="border-purple-200/50 text-white hover:bg-purple-500/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  onClick={currentStep === totalSteps ? () => setCurrentStep(currentStep + 1) : handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {currentStep === totalSteps ? "Ver Prompt Final" : "Próximo"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Save Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-200/20">
          <DialogHeader>
            <DialogTitle className="text-white">Salvar Prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Título do Prompt</Label>
              <Input
                id="title"
                placeholder="Digite um título para seu prompt..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/20 border-purple-200/50 text-white placeholder:text-gray-300"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!title.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
