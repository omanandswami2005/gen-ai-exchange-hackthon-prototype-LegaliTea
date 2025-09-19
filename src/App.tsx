import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import { useAppStore } from "./stores/appStore";
import { useDevHelpers } from "./stores/devHelpers";
import { UploadPage } from "./components/UploadPage";
import { ProcessingPage } from "./components/ProcessingPage";
import { ResultsPage } from "./components/ResultsPage";
import { SaveAnalysis } from "./components/SaveAnalysis";
import { LegalDisclaimer, TrustSignals } from "./components/LegalDisclaimer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { LanguageProvider } from "./contexts/LanguageContext";
import {
  LanguageSelector,
  AnimatedLanguageText,
} from "./components/LanguageSelector";
import { DashboardResultsPage } from "./components/DashboardResultsPage";

// Import dev helpers in development
if (import.meta.env.DEV) {
  import("./stores/devHelpers");
}

function App() {
  const { processingStage, analysisResult } = useAppStore();
  const devHelpers = useDevHelpers();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <div className="container mx-auto px-4 py-8">
              {/* Header with controls */}
              <header className="flex justify-between items-center mb-8">
                <div className="text-center flex-1">
                  <h1 className="text-4xl font-bold mb-2">LegaliTea</h1>
                  <p className="text-muted-foreground">
                    Understand any legal document in plain{" "}
                    <AnimatedLanguageText />
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
              </header>

              <main className="max-w-7xl mx-auto">
                {/* App content based on current stage */}
                {processingStage === "upload" && !analysisResult && (
                  <UploadPage />
                )}

                {(processingStage === "extract" ||
                  processingStage === "analyze") && <ProcessingPage />}

                {processingStage === "complete" && analysisResult && (
                  <div className="space-y-6">
                    <DashboardResultsPage />
                    <SaveAnalysis />
                  </div>
                )}

                {/* Legal Disclaimer */}
                <LegalDisclaimer variant="banner" className="mt-8" />

                {/* Trust Signals */}
                {processingStage === "upload" && (
                  <TrustSignals className="mt-6" />
                )}
              </main>
            </div>
          </div>

          {/* React Query Devtools */}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
