"use client"; 

// We replace `next/image` with a standard `<img>` tag to fix the compilation error.
// import Image from "next/image"; // For optimized image display 
import { Copy } from 'lucide-react';
import { useState } from 'react'; // Make sure useState is imported

const predefinedPrompts = [
  {
    id: 1,
    prompt: "A lone cyberpunk hacker, vibrant neon lights reflecting off a rainy Tokyo street, intricate data streams, wide-angle shot, cinematic lighting, 8K, highly detailed.",
    imageUrl: "https://placehold.co/800x600/2a2a2a/ffffff?text=Cyberpunk",
    category: "Cyberpunk",
  },
  {
    id: 2,
    prompt: "An ancient elven archer standing on a moss-covered rock in a misty, enchanted forest, rays of sunlight piercing through the canopy, epic fantasy art, high detail, volumetric lighting.",
    imageUrl: "https://placehold.co/800x600/1a3a2a/ffffff?text=Fantasy",
    category: "Fantasy",
  },
  {
    id: 3,
    prompt: "A person in a bright yellow swimsuit relaxing on a sun-drenched beach, clear turquoise water, palm trees swaying gently, golden hour, photorealistic, 4K.",
    imageUrl: "https://placehold.co/800x600/f0e0a0/000000?text=Nature",
    category: "Nature",
  },
  {
    id: 4,
    prompt: "A futuristic astronaut exploring a desolate Martian landscape, sleek white spacesuit, advanced rover nearby, red dust, dramatic low-angle shot, sci-fi photography, ultra realistic.",
    imageUrl: "https://placehold.co/800x600/d06040/ffffff?text=Sci-Fi",
    category: "Sci-Fi",
  },
  {
    id: 5,
    prompt: "A whimsical cottage nestled in a vibrant mushroom forest, glowing bioluminescent plants, soft magical light, intricate details, fairytale illustration style.",
    imageUrl: "https://placehold.co/800x600/a050d0/ffffff?text=Whimsical",
    category: "Fantasy",
  },
  {
    id: 6,
    prompt: "A sleek, black sports car speeding through a modern city tunnel at night, streaks of light, dynamic motion blur, cinematic action shot, 4K, aggressive styling.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/ffffff?text=Vehicles",
    category: "Vehicles",
  },
  {
    id: 7,
    prompt: "A majestic dragon perched atop a snowy mountain peak, breathing icy mist, dramatic sunset sky, highly detailed scales, epic fantasy painting.",
    imageUrl: "https://placehold.co/800x600/c0c0e0/000000?text=Dragon",
    category: "Fantasy",
  },
  {
    id: 8,
    prompt: "A vintage detective in a trench coat walking down a dimly lit alley in a 1940s film noir city, rain puddles reflecting streetlights, dramatic shadows, black and white.",
    imageUrl: "https://placehold.co/800x600/4a4a4a/ffffff?text=Film+Noir",
    category: "Vintage",
  },
];

export default function PromptGallery() {
  // --- Hooks and handlers MUST be inside the component ---
  const [copiedId, setCopiedId] = useState(null);
  
  const handleCopy = (prompt, id) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2s
  };
  // ----------------------------------------------------

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-6">Inspiration Gallery</h2>
      <p className="text-slate-300 mb-8">
        Browse these examples to see the kind of detailed prompts AI can generate for image creation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {predefinedPrompts.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center overflow-hidden"> {/* Added overflow-hidden */}
              {/* Replaced Next.js Image with standard <img> tag to fix build error */}
              <img
                src={item.imageUrl}
                alt={item.prompt.substring(0, 50) + "..."}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy" // Added lazy loading for performance
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-white mb-2">{item.category} Example</h3>
              <p className="text-slate-300 text-sm flex-grow line-clamp-4 mb-4">{item.prompt}</p> {/* Added mb-4 */}
              
              {/* --- Copy Button --- */}
              <button
                onClick={() => handleCopy(item.prompt, item.id)}
                className="mt-auto w-full text-sm flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md" // used mt-auto
              >
                <Copy className="h-4 w-4" />
                {copiedId === item.id ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

//done