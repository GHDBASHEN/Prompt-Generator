"use client";

import { useState } from "react";
import { Copy } from "lucide-react"; 
import PromptGallery from "../components/PromptGallery"; // Import the new component

export default function Home() {
  // ... (all your existing state for form inputs)
  const [cloth, setCloth] = useState("t-shirt");
  const [clothColor, setClothColor] = useState("blue");
  const [hasCar, setHasCar] = useState(false);
  const [carModel, setCarModel] = useState("Tesla Model 3");
  const [location, setLocation] = useState("cyberpunk city street at night");
  const [vibe, setVibe] = useState("relaxed");
  const [customOptions, setCustomOptions] = useState("");

  // State for output
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Predefined Prompt Feature (existing)
  const presets = [
    { name: "Cyberpunk", location: "Rainy neon-lit Tokyo street", cloth: "leather jacket", vibe: "mysterious", hasCar: true, carModel: "DeLorean" },
    { name: "Fantasy", location: "Ancient elven forest", cloth: "flowing robe", vibe: "epic", hasCar: false },
    { name: "Beach", location: "Sunny California beach", cloth: "swim shorts", vibe: "relaxed", hasCar: false },
  ];

  const applyPreset = (preset) => {
    setCloth(preset.cloth || "t-shirt");
    setClothColor(preset.clothColor || "white");
    setHasCar(preset.hasCar || false);
    setCarModel(preset.carModel || "");
    setLocation(preset.location || "a park");
    setVibe(preset.vibe || "normal");
    setCustomOptions("");
    setGeneratedPrompt("");
    setError(null);
  };

  // Copy to Clipboard Function (existing)
  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedPrompt("");
    setError(null);
    setCopySuccess(false);

    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloth, clothColor, hasCar, carModel, location, vibe, customOptions,
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

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <main className="max-w-6xl mx-auto flex flex-col gap-12"> {/* Changed to flex-col */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> {/* Wrap form and output in a grid */}
          {/* --- LEFT COLUMN: FORM --- */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold">AI Image Prompt Generator</h1>
            <p className="text-slate-300">
              Fill in the details and let AI create a detailed prompt for you.
            </p>

            {/* --- Predefined Prompts --- */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start with a preset:
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-sm"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* --- Form --- */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Clothing Item:</label>
                <input
                  type="text"
                  value={cloth}
                  onChange={(e) => setCloth(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Clothing Color:</label>
                <input
                  type="text"
                  value={clothColor}
                  onChange={(e) => setClothColor(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Vibe:</label>
                <select
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
                >
                  <option value="happy">Happy</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="angry">Angry</option>
                  <option value="mysterious">Mysterious</option>
                  <option value="epic">Epic</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="hasCar"
                  type="checkbox"
                  checked={hasCar}
                  onChange={(e) => setHasCar(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hasCar" className="text-sm">Include a car?</label>
              </div>
              {hasCar && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Car Model:</label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Custom Options (optional):</label>
                <textarea
                  value={customOptions}
                  onChange={(e) => setCustomOptions(e.target.value)}
                  placeholder="e.g., holding a coffee, has a pet dog..."
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md min-h-[80px]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-lg disabled:bg-slate-500 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Generate Prompt"}
              </button>
            </form>
          </div>

          {/* --- RIGHT COLUMN: OUTPUT --- */}
          <div className="sticky top-8 h-fit">
            <h2 className="text-2xl font-bold mb-4">Your Generated Prompt</h2>
            <div className="bg-slate-800 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-200">Detailed AI Image Prompt</h3>
              <div className="w-full p-4 bg-slate-900 rounded-md min-h-[150px] relative">
                {generatedPrompt && (
                  <>
                    <p className="text-slate-300 whitespace-pre-wrap pr-10">{generatedPrompt}</p>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300"
                      title="Copy prompt to clipboard"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    {copySuccess && (
                      <span className="absolute -top-6 right-2 text-xs text-green-400 bg-slate-700 px-2 py-1 rounded">Copied!</span>
                    )}
                  </>
                )}
                {error && (
                  <p className="text-red-400 p-4">{error}</p>
                )}
                {!generatedPrompt && !isLoading && !error && (
                  <p className="text-slate-400">Your detailed image generation prompt will appear here...</p>
                )}
                {isLoading && (
                  <p className="text-slate-400 animate-pulse">Generating prompt...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- NEW: Prompt Gallery Section (After the main grid) --- */}
        <PromptGallery />
      </main>
    </div>
  );
}