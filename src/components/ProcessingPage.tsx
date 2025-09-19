import React from "react";
import { Loader2, FileText, Brain, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { useProcessingMessage } from "@/stores/selectors";

export const ProcessingPage: React.FC = () => {
  const { processingStage, progress } = useAppStore();
  const message = useProcessingMessage();

  const getStageIcon = () => {
    switch (processingStage) {
      case "extract":
        return <FileText className="h-8 w-8 text-info" />;
      case "analyze":
        return <Brain className="h-8 w-8 text-primary" />;
      case "complete":
        return <CheckCircle2 className="h-8 w-8 text-success" />;
      default:
        return (
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        );
    }
  };

  const getTimeEstimate = () => {
    switch (processingStage) {
      case "extract":
        return "This usually takes 15-30 seconds";
      case "analyze":
        return "This usually takes 30-60 seconds";
      default:
        return "Please wait...";
    }
  };

  const getEducationalTip = () => {
    const tips = [
      "Our AI is trained on thousands of legal documents to provide accurate analysis.",
      "We focus on identifying key terms, risks, and actionable next steps.",
      "The analysis includes confidence scores to help you understand reliability.",
      "Complex legal language is translated into plain English for better understanding.",
      "We highlight potential red flags that might need your attention.",
    ];

    // Rotate tips based on processing stage
    const tipIndex =
      processingStage === "extract" ? 0 : processingStage === "analyze" ? 1 : 2;
    return tips[tipIndex] || tips[0];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">{getStageIcon()}</div>

            {/* Main Message */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {message}
              </h2>
              <p className="text-muted-foreground">{getTimeEstimate()}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(progress, 10)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0%</span>
                <span className="font-medium">{Math.round(progress)}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="flex justify-center space-x-8 text-sm">
              <div
                className={`flex items-center space-x-2 ${
                  processingStage === "extract"
                    ? "text-blue-600"
                    : progress > 50
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    processingStage === "extract"
                      ? "bg-blue-600 animate-pulse"
                      : progress > 50
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                <span>Reading</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  processingStage === "analyze"
                    ? "text-purple-600"
                    : progress >= 100
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    processingStage === "analyze"
                      ? "bg-purple-600 animate-pulse"
                      : progress >= 100
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                <span>Analyzing</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  processingStage === "complete"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    processingStage === "complete"
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                <span>Complete</span>
              </div>
            </div>

            {/* Educational Content */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                💡 <strong>Did you know?</strong> {getEducationalTip()}
              </p>
            </div>

            {/* Confidence Building */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>🔒 Your document is processed securely</p>
              <p>🤖 AI analysis powered by advanced language models</p>
              <p>⚡ Results typically ready in under 2 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
