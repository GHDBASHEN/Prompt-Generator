"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Bookmark,
  Wand2,
  User,
  MapPin,
  Sparkles,
  Palette,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  X,
  Smile,
  Frown,
  Moon,
  Zap,
  Github,
} from "lucide-react";
import PromptGallery from "../components/PromptGallery"; // We'll keep the gallery!

// --- Vibe Options ---
const vibeOptions = [
  { name: "Happy", icon: <Smile className="w-8 h-8" /> },
  { name: "Relaxed", icon: <Moon className="w-8 h-8" /> },
  { name: "Angry", icon: <Frown className="w-8 h-8" /> },
  { name: "Mysterious", icon: <Moon className="w-8 h-8" /> },
  { name: "Epic", icon: <Zap className="w-8 h-8" /> },
  { name: "Cyberpunk", icon: <Github className="w-8 h-8" /> }, // Placeholder icon
];

export default function Home() {
  // --- State for the Wizard ---
  const [step, setStep] = useState(1);

  // --- State for Form Inputs ---
  const [subject, setSubject] = useState("a person");
  const [cloth, setCloth] = useState("t-shirt");
  const [clothColor, setClothColor] = useState("blue");
  const [hasCar, setHasCar] = useState(false);
  const [carModel, setCarModel] = useState("Tesla Model 3");
  const [location, setLocation] = useState("cyberpunk city street at night");
  const [vibe, setVibe] = useState("relaxed");
  const [customOptions, setCustomOptions] = useState("");

  // --- State for Output ---
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // --- State for Favorites ---
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoritePrompts');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // --- Wizard Navigation ---
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // --- API Call ---
  const handleSubmit = async () => {
    setIsLoading(true);
    setGeneratedPrompt("");
    setError(null);
    setCopySuccess(false);

    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject, // New field
          cloth,
          clothColor,
          hasCar,
          carModel,
          location,
          vibe,
          customOptions,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helper Functions ---
  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const saveFavorite = () => {
    if (generatedPrompt && !favorites.includes(generatedPrompt)) {
      const newFavorites = [generatedPrompt, ...favorites];
      setFavorites(newFavorites);
      localStorage.setItem('favoritePrompts', JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = (prompt) => {
    const newFavorites = favorites.filter((f) => f !== prompt);
    setFavorites(newFavorites);
    localStorage.setItem('favoritePrompts', JSON.stringify(newFavorites));
  };

  // --- Step Components ---

  const Step1 = () => (
    <div className="flex flex-col items-center"> {/* Removed text-center */}
      <div className="flex-center h-16 w-16 rounded-full bg-blue-600/10 text-blue-500">
        <User className="w-8 h-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-center">What's the main subject?</h2> {/* Added text-center */}
      <p className="mt-2 text-zinc-400 text-center"> {/* Added text-center */}
        Start with the core of your image. e.g., "a person", "a red dragon", "two friends".
      </p>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="input-base mt-6 w-full"
        placeholder="e.g., a person"
      />
    </div>
  );

  const Step2 = () => (
    <div className="flex flex-col items-center"> {/* Removed text-center */}
      <div className="flex-center h-16 w-16 rounded-full bg-blue-600/10 text-blue-500">
        <MapPin className="w-8 h-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-center">Where is the scene?</h2> {/* Added text-center */}
      <p className="mt-2 text-zinc-400 text-center"> {/* Added text-center */}
        Describe the environment. e.g., "a rainy city street", "a sun-drenched beach".
      </p>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="input-base mt-6 w-full"
        placeholder="e.g., a rainy city street at night"
      />
    </div>
  );

  const Step3 = () => (
    <div className="flex flex-col items-center text-center">
      <div className="flex-center h-16 w-16 rounded-full bg-blue-600/10 text-blue-500">
        <Sparkles className="w-8 h-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">What's the vibe?</h2>
      <p className="mt-2 text-zinc-400">
        Choose a mood or style for your image.
      </p>
      <div className="mt-6 grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
        {vibeOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => setVibe(option.name)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200
              ${vibe === option.name
                ? "border-blue-500 bg-blue-600/10 text-blue-300"
                : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500"
              }`}
          >
            {option.icon}
            <span className="font-medium">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="flex flex-col items-center"> {/* Removed text-center */}
      <div className="flex-center h-16 w-16 rounded-full bg-blue-600/10 text-blue-500">
        <Palette className="w-8 h-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-center">Add extra details</h2> {/* Added text-center */}
      <p className="mt-2 text-zinc-400 text-center"> {/* Added text-center */}
        Refine your prompt with more specific details.
      </p>
      <div className="mt-6 w-full space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-base">Clothing Item:</label>
            <input
              type="text"
              value={cloth}
              onChange={(e) => setCloth(e.target.value)}
              className="input-base w-full"
            />
          </div>
          <div>
            <label className="label-base">Clothing Color:</label>
            <input
              type="text"
              value={clothColor}
              onChange={(e) => setClothColor(e.target.value)}
              className="input-base w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-4">
          <input
            id="hasCar"
            type="checkbox"
            checked={hasCar}
            onChange={(e) => setHasCar(e.target.checked)}
            className="h-5 w-5 rounded border-zinc-600 bg-zinc-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900"
          />
          <label htmlFor="hasCar" className="flex-1 font-medium text-zinc-200">
            Include a car?
          </label>
        </div>
        {hasCar && (
          <div className="pl-4">
            <label className="label-base">Car Model:</label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="input-base w-full"
              placeholder="e.g., DeLorean"
            />
          </div>
        )}
        <div>
          <label className="label-base">Custom Options (optional):</label>
          <textarea
            value={customOptions}
            onChange={(e) => setCustomOptions(e.target.value)}
            placeholder="e.g., holding a coffee, has a pet dog..."
            className="input-base min-h-[100px] w-full"
          />
        </div>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="flex flex-col items-center text-center">
      <div className="flex-center h-16 w-16 rounded-full bg-green-600/10 text-green-500">
        <Check className="w-8 h-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">Generate Your Prompt!</h2>
      <p className="mt-2 text-zinc-400">
        You're all set. Click the button below to generate your detailed prompt.
      </p>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="btn btn-primary mt-8 w-full"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Wand2 className="h-5 w-5" />
        )}
        <span>{isLoading ? "Generating..." : "Generate Prompt"}</span>
      </button>

      {/* --- Output Section --- */}
      <div className="mt-8 w-full">
        {error && (
          <p className="rounded-md bg-red-900/50 p-4 text-center text-red-300">
            {error}
          </p>
        )}
        {generatedPrompt && (
          <div className="space-y-4">
            <h3 className="text-left text-lg font-semibold text-zinc-200">
              Your Generated Prompt:
            </h3>
            <div className="relative w-full rounded-xl bg-zinc-950 p-6 text-left">
              <p className="font-mono text-zinc-300 whitespace-pre-wrap pr-20">
                {generatedPrompt}
              </p>
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-icon"
                  title="Copy prompt"
                >
                  {copySuccess ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={saveFavorite}
                  className="btn-icon"
                  title="Save prompt"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* --- Header --- */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-bold">AI Prompt Studio</h1>
          </div>
          <a
            href="https://github.com/ghdbashen/prompt-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Github className="h-4 w-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4 py-12 md:p-8 md:py-16">
        {/* --- Wizard --- */}
        <div className="rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-zinc-800">
          <div className="p-6 md:p-10">
            {/* --- Step Indicator --- */}
            {step <= 4 && (
              <p className="mb-6 text-center text-sm font-medium text-zinc-400">
                Step <span className="text-zinc-100">{step}</span> of 4
              </p>
            )}

            {/* --- Step Content --- */}
            <div className="min-h-[350px]">{renderStep()}</div>
          </div>

          {/* --- Navigation --- */}
          {step <= 4 && (
            <div className="flex items-center justify-between rounded-b-2xl border-t border-zinc-800 bg-zinc-900/50 p-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="btn btn-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary bg-green-600 hover:bg-green-700 focus-visible:ring-green-500"
                >
                  <span>Review & Generate</span>
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          {step === 5 && (
             <div className="flex items-center justify-center rounded-b-2xl border-t border-zinc-800 bg-zinc-900/50 p-6">
               <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Start Over</span>
                </button>
             </div>
          )}
        </div>

        {/* --- Saved Prompts Section --- */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white">Saved Prompts</h2>
          <div className="mt-6 flex flex-col gap-4">
            {favorites.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-700 p-6 text-center text-zinc-400">
                Your saved prompts will appear here.
              </p>
            ) : (
              favorites.map((prompt, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg bg-zinc-900 p-4 ring-1 ring-zinc-800"
                >
                  <p className="flex-1 font-mono text-sm text-zinc-300 line-clamp-2">
                    {prompt}
                  </p>
                  <button
                    onClick={() => removeFavorite(prompt)}
                    className="btn-icon flex-shrink-0 text-red-400 hover:bg-red-900/50 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Inspiration Gallery --- */}
        <PromptGallery />
      </main>
    </div>
  );
}