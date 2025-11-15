"use client"; // This line is required at the top for React hooks

import { useState } from "react";

export default function Home() {
  // State for all the form inputs
  const [cloth, setCloth] = useState("t-shirt");
  const [clothColor, setClothColor] = useState("blue");
  const [hasCar, setHasCar] = useState(false);
  const [carModel, setCarModel] = useState("Tesla Model 3");
  const [location, setLocation] = useState("cyberpunk city street at night");
  const [vibe, setVibe] = useState("relaxed");
  const [customOptions, setCustomOptions] = useState("");

  // State for the output
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState(null);

  // This function is called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setGeneratedPrompt("");
    setError(null);

    try {
      // Send the form data to our *own* API endpoint
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        // If the server response is not OK, throw an error
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
    <main style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>AI Image Prompt Generator</h1>
      <p>Fill in the details and let AI create a detailed prompt for you.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        <div>
          <label>Clothing Item:</label>
          <input
            type="text"
            value={cloth}
            onChange={(e) => setCloth(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>Clothing Color:</label>
          <input
            type="text"
            value={clothColor}
            onChange={(e) => setClothColor(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>Vibe:</label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="happy">Happy</option>
            <option value="relaxed">Relaxed</option>
            <option value="angry">Angry</option>
            <option value="mysterious">Mysterious</option>
            <option value="epic">Epic</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={hasCar}
              onChange={(e) => setHasCar(e.target.checked)}
            />
            Include a car?
          </label>
        </div>
        {hasCar && ( // Only show this input if 'hasCar' is true
          <div>
            <label>Car Model:</label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        )}
        <div>
          <label>Custom Options (optional):</label>
          <textarea
            value={customOptions}
            onChange={(e) => setCustomOptions(e.target.value)}
            placeholder="e.g., holding a coffee, has a pet dog..."
            style={{ width: "100%", padding: "8px", minHeight: "80px" }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: "12px", background: "blue", color: "white", border: "none", cursor: "pointer" }}
        >
          {isLoading ? "Generating..." : "Generate Prompt"}
        </button>
      </form>

      {/* --- Output Section --- */}
      {generatedPrompt && (
        <div style={{ background: "#f0f0f0", padding: "15px", marginTop: "20px", borderRadius: "5px" }}>
          <strong>Your Generated Prompt:</strong>
          <p>{generatedPrompt}</p>
        </div>
      )}
      {error && (
        <div style={{ background: "#ffcccc", padding: "15px", marginTop: "20px", borderRadius: "5px", color: "red" }}>
          <strong>Error:</strong>
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}