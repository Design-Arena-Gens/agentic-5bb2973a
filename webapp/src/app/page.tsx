"use client";

import { useState } from "react";

type ThemePreset = {
  id: string;
  keywords: string[];
  mood: string;
  tone: string;
  visualStyle: string;
  palette: string[];
  lighting: string[];
  cameraEnergy: string[];
  atmosphere: string[];
  defaultSetting: string;
  characterVibe: string;
  motionKeywords: string[];
};

type ScenePlan = {
  name: string;
  location: string;
  characters: string;
  camera: string;
  lighting: string;
  action: string;
  atmosphere: string;
};

type Blueprint = {
  idea: string;
  theme: ThemePreset;
  summary: {
    title: string;
    logline: string;
    mood: string;
    visualStyle: string;
  };
  scenes: ScenePlan[];
  finalPrompt: string;
  voiceoverLines?: string[];
  thumbnailPrompt?: string;
};

type GeneratorOptions = {
  includeVoiceover: boolean;
  includeThumbnail: boolean;
};

const THEME_PRESETS: ThemePreset[] = [
  {
    id: "cosmic-odyssey",
    keywords: [
      "space",
      "galaxy",
      "nebula",
      "cosmic",
      "stars",
      "astronaut",
      "asteroid",
      "planet",
      "lunar",
    ],
    mood: "awe-struck and expansive",
    tone: "epic and wonder-filled",
    visualStyle: "cinematic sci-fi realism",
    palette: ["deep indigo", "electric cyan", "burnished gold"],
    lighting: ["rim-lit silhouettes", "starlit gradients", "glowing nebula haze"],
    cameraEnergy: ["floating dolly shots", "slow orbital moves", "wide IMAX framing"],
    atmosphere: ["cosmic dust motes", "aurora veils", "zero-gravity debris"],
    defaultSetting: "outer space observatory overlooking a luminous nebula",
    characterVibe: "astronauts in reflective visors, faces lit by instrument glow",
    motionKeywords: ["weightless drifts", "gravitational arcs", "stellar ignition"],
  },
  {
    id: "neon-metropolis",
    keywords: [
      "city",
      "cyberpunk",
      "neon",
      "rain",
      "urban",
      "metropolis",
      "future",
      "nightlife",
      "tech",
      "skyscraper",
    ],
    mood: "electric and restless",
    tone: "gritty yet hopeful",
    visualStyle: "stylized neon-drenched futurism",
    palette: ["magenta neon", "teal highlights", "wet asphalt grey"],
    lighting: ["blade-runner side light", "reflective rain glow", "holographic flicker"],
    cameraEnergy: ["drone swoops", "shoulder-level tracking", "wide establishing pans"],
    atmosphere: ["rain streaks", "steam vents", "floating holo adverts"],
    defaultSetting: "multi-level megacity street with holographic billboards",
    characterVibe: "street-smart protagonists in reflective jackets, eyes determined",
    motionKeywords: ["dash through crosswalks", "glitching signage", "subway tremors"],
  },
  {
    id: "mythic-wilds",
    keywords: [
      "forest",
      "mountain",
      "nature",
      "myth",
      "ancient",
      "creature",
      "legend",
      "folklore",
      "spirit",
      "wild",
    ],
    mood: "mystical and reverent",
    tone: "lyrical and hopeful",
    visualStyle: "cinematic fantasy realism",
    palette: ["emerald moss", "sunlit amber", "silver mist"],
    lighting: ["shafts of god rays", "soft dawn diffusions", "lantern glow"],
    cameraEnergy: ["slow crane reveals", "macro nature inserts", "gentle steadicam glide"],
    atmosphere: ["floating pollen", "mist curls", "ember sparks"],
    defaultSetting: "ancient forest clearing surrounded by towering pines",
    characterVibe: "guardians clad in woven cloaks, eyes reflecting firelight",
    motionKeywords: ["hand brushing leaves", "ancestral symbols pulsing", "wind carrying embers"],
  },
  {
    id: "coastal-dream",
    keywords: [
      "ocean",
      "sea",
      "island",
      "beach",
      "sail",
      "sunset",
      "wave",
      "tide",
      "reef",
      "coast",
    ],
    mood: "serene and wistful",
    tone: "intimate and reflective",
    visualStyle: "sun-kissed cinematic naturalism",
    palette: ["turquoise water", "golden hour amber", "coral blush"],
    lighting: ["low sun flares", "reflected water caustics", "lantern twilight"],
    cameraEnergy: ["drone coastline sweeps", "handheld shoreline chase", "underwater dolly glide"],
    atmosphere: ["sea spray", "salt breeze haze", "distant gull silhouettes"],
    defaultSetting: "twilight beach with waves glittering under fading sun",
    characterVibe: "barefoot dreamers with windswept hair and open expressions",
    motionKeywords: ["tidal surges", "footprints in wet sand", "bioluminescent shimmer"],
  },
  {
    id: "industrial-noir",
    keywords: [
      "detective",
      "noir",
      "mystery",
      "crime",
      "shadow",
      "nocturne",
      "whodunit",
      "alley",
      "cigarette",
    ],
    mood: "tense and calculated",
    tone: "moody and introspective",
    visualStyle: "high-contrast cinematic noir",
    palette: ["sodium vapor amber", "deep charcoal", "muted teal"],
    lighting: ["harsh key light", "venetian blind streaks", "fog-diffused street lamps"],
    cameraEnergy: ["static surveillance frames", "slow push-ins", "low-angle reveals"],
    atmosphere: ["hanging fog", "dripping fire escapes", "cigarette smoke spirals"],
    defaultSetting: "rain-slicked alley framed by flickering signage",
    characterVibe: "sharp silhouettes in trench coats, eyes scanning the dark",
    motionKeywords: ["cautious footfalls", "briefcase handoff", "neon reflections pulsing"],
  },
  {
    id: "high-speed",
    keywords: [
      "race",
      "speed",
      "chase",
      "engine",
      "adrenaline",
      "car",
      "motorcycle",
      "drift",
      "rally",
    ],
    mood: "adrenaline-charged and visceral",
    tone: "high-stakes and urgent",
    visualStyle: "high-contrast kinetic realism",
    palette: ["glossy crimson", "carbon black", "white-hot highlights"],
    lighting: ["headlight streaks", "sparks shower", "dashboard glow"],
    cameraEnergy: ["gimbal mounted hood shots", "FPV dives", "whip pans"],
    atmosphere: ["tire smoke plumes", "heat mirage", "asphalt grit"],
    defaultSetting: "mountain pass raceway with city glow on the horizon",
    characterVibe: "helmeted racers focused behind visors, veins thrumming",
    motionKeywords: ["gear shift snap", "nitro burst", "apex drift"],
  },
];

const DEFAULT_THEME: ThemePreset = {
  id: "default",
  keywords: [],
  mood: "curious and inspiring",
  tone: "hopeful and cinematic",
  visualStyle: "high-fidelity cinematic storytelling",
  palette: ["warm gold", "deep navy", "soft ivory"],
  lighting: ["balanced soft key", "motivated practicals", "gentle backlight"],
  cameraEnergy: ["measured dolly moves", "purposeful push-ins", "wide establishing shots"],
  atmosphere: ["floating dust motes", "ambient haze", "subtle particles"],
  defaultSetting: "versatile studio space that transforms with projection mapping",
  characterVibe: "thoughtful protagonists with expressive eyes and grounded costuming",
  motionKeywords: ["purposeful stride", "lingering gazes", "breath catching moments"],
};

const SCENE_TEMPLATES: Omit<ScenePlan, "location" | "characters" | "action" | "lighting" | "atmosphere" | "camera">[] = [
  {
    name: "Scene 1 · Opening Tableau",
  },
  {
    name: "Scene 2 · Rising Momentum",
  },
  {
    name: "Scene 3 · Emotional Apex",
  },
  {
    name: "Scene 4 · Resonant Finale",
  },
];

const sentenceCase = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const toTitle = (value: string) => {
  const cleaned = value.replace(/[^a-zA-Z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return "Cinematic Vision";
  }
  return cleaned
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (["and", "or", "the", "of", "in", "a", "an"].includes(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
};

const determineTheme = (idea: string): ThemePreset => {
  const lowerIdea = idea.toLowerCase();
  for (const preset of THEME_PRESETS) {
    if (preset.keywords.some((keyword) => lowerIdea.includes(keyword))) {
      return preset;
    }
  }
  return DEFAULT_THEME;
};

const buildLogline = (idea: string, theme: ThemePreset) => {
  const cleaned = sentenceCase(idea.replace(/\s+/g, " ").trim());
  if (!cleaned) {
    return `A ${theme.tone} short film that transforms simple prompts into rich cinematic storytelling.`;
  }
  return `A ${theme.tone} short film that turns “${cleaned}” into a vivid, high-impact narrative journey.`;
};

const fuse = (parts: string[]) =>
  parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

const ensureSentence = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
};

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const buildScenes = (idea: string, theme: ThemePreset): ScenePlan[] => {
  const baseSetting = theme.defaultSetting;
  const trimmedIdea = idea.trim();
  const ideaFocus =
    trimmedIdea.length > 0
      ? trimmedIdea.replace(/[.?!]+$/, "")
      : "transforming a simple idea into a cinematic experience";

  const cameraA = theme.cameraEnergy[0] ?? "wide cinematic dolly";
  const cameraB = theme.cameraEnergy[1] ?? "immersive tracking shot";
  const cameraC = theme.cameraEnergy[2] ?? "intimate close-up sweep";

  const lightingA = theme.lighting[0] ?? "motivated key light with contrast";
  const lightingB = theme.lighting[1] ?? "dynamic practical glow";
  const lightingC = theme.lighting[2] ?? "atmospheric rim light";

  const atmosphereA = theme.atmosphere[0] ?? "floating particulate haze";
  const atmosphereB = theme.atmosphere[1] ?? "ambient kinetic energy";
  const atmosphereC = theme.atmosphere[2] ?? "textured movement in the air";

  const characterDescriptor = theme.characterVibe;
  const motionA = theme.motionKeywords[0] ?? "purposeful movement through the frame";
  const motionB = theme.motionKeywords[1] ?? "kinetic interaction that escalates stakes";
  const motionC = theme.motionKeywords[2] ?? "charged motion that seals the moment";

  const scenes: ScenePlan[] = [
    {
      name: SCENE_TEMPLATES[0].name,
      location: fuse([
        "Establish",
        baseSetting,
        "as the world that embodies",
        `${ideaFocus}.`,
      ]),
      characters: fuse([
        characterDescriptor,
        "poised with anticipation, expressions reflecting fresh curiosity.",
      ]),
      camera: `${cameraA} that drifts forward, revealing layered depth and scale.`,
      lighting: `${lightingA} paired with ${theme.palette.join(", ")} accents.`,
      action: fuse([
        "Introduce the protagonist interacting with tactile details,",
        motionA,
        "while the environment hints at the story stakes.",
      ]),
      atmosphere: fuse([
        "Ambient texture of",
        atmosphereA,
        "envelops the frame, adding dimensionality to the air.",
      ]),
    },
    {
      name: SCENE_TEMPLATES[1].name,
      location: fuse([
        "Shift to a contrasting micro-location that amplifies",
        ideaFocus,
        "through dynamic spatial layering.",
      ]),
      characters: fuse([
        "Characters exchange charged glances,",
        "body language sharpening with intent and determination.",
      ]),
      camera: `${cameraB} weaving between foreground and background elements, heightening urgency.`,
      lighting: `${lightingB} that splashes across surfaces, sculpting silhouettes and reflections.`,
      action: fuse([
        "Escalate momentum with",
        motionB,
        "punctuated by prop interactions that foreshadow the climax.",
      ]),
      atmosphere: fuse([
        "Environmental energy swirls —",
        atmosphereB,
        "— adding kinetic texture to every beat.",
      ]),
    },
    {
      name: SCENE_TEMPLATES[2].name,
      location: fuse([
        "Cut to an intimate pocket within the world where the emotional truth of",
        ideaFocus,
        "is laid bare.",
      ]),
      characters: fuse([
        "Close portraits reveal micro-emotions: trembling hands, focused eyes, restrained breath.",
      ]),
      camera: `${cameraC} that gravitates toward faces, lingering long enough to capture resonance.`,
      lighting: `${lightingC} blooming around edges, etching depth with soft gradients.`,
      action: fuse([
        "Deliver a pivotal gesture or revelation that crystallizes the stakes and heart of the story.",
      ]),
      atmosphere: fuse([
        "Particles of",
        atmosphereC,
        "hover in slow motion, amplifying the emotional gravity.",
      ]),
    },
    {
      name: SCENE_TEMPLATES[3].name,
      location: fuse([
        "Reopen the space to a grand perspective, showing the world transformed by",
        `${ideaFocus}.`,
      ]),
      characters: fuse([
        "Figures stand framed by the environment, energy resolved yet charged with new potential.",
      ]),
      camera: `${cameraA} returning for a full-circle move, closing in on the final decisive image.`,
      lighting: `A synthesis of ${theme.lighting.join(", ")} converges into a luminous crescendo.`,
      action: fuse([
        "Seal the narrative with",
        motionC,
        "that locks the viewer into the aftermath.",
      ]),
      atmosphere: fuse([
        "A final wave of",
        theme.atmosphere.join(", "),
        "rolls through the frame as the music swells.",
      ]),
    },
  ];

  return scenes;
};

const buildFinalPrompt = (idea: string, theme: ThemePreset, scenes: ScenePlan[]) => {
  const trimmedIdea = idea.trim().replace(/[.?!]+$/, "");
  const baseIdea = trimmedIdea.length > 0 ? trimmedIdea : "a blank concept that blossoms on screen";
  const sceneSentences = scenes
    .map((scene, index) => {
      const details = normalizeWhitespace(
        [
          ensureSentence(scene.location),
          ensureSentence(scene.characters),
          ensureSentence(scene.camera),
          ensureSentence(scene.lighting),
          ensureSentence(scene.action),
          ensureSentence(scene.atmosphere),
        ].join(" "),
      );
      return `Scene ${index + 1}: ${details}`;
    })
    .join(" ");

  const cameraIntro = ensureSentence(
    `Cinematic camera glides through ${theme.defaultSetting}, translating ${baseIdea} into ${theme.visualStyle}`,
  );
  const paletteSentence = ensureSentence(
    `Colors lean into ${theme.palette.join(", ")} while ${theme.lighting[0]} sculpts silhouettes`,
  );
  const atmosphereSentence = ensureSentence(
    `Air carries ${theme.atmosphere.join(", ")} as tactile texture around the characters`,
  );
  const motionSentence = ensureSentence(
    `Emotion stays ${theme.mood} as movement hits ${theme.motionKeywords.join(", ")}`,
  );

  return normalizeWhitespace(
    `${cameraIntro} ${sceneSentences} ${paletteSentence} ${atmosphereSentence} ${motionSentence}`,
  );
};

const buildVoiceover = (idea: string) => {
  const cleaned = idea.trim().length > 0 ? idea.trim() : "this vision";
  return [
    `Open on a breath: “Every idea begins as a whisper.”`,
    `Momentum builds: “Watch ${cleaned} spark to life, one beat at a time.”`,
    `At the climax: “Feel the weight, the rush, the heart inside the motion.”`,
    `Final image: “Now let ${cleaned} live beyond the screen.”`,
  ];
};

const buildThumbnailPrompt = (idea: string, theme: ThemePreset) => {
  const cleaned = idea.trim().length > 0 ? idea.trim() : "a cinematic concept";
  return `Ultra-wide poster of ${cleaned} rendered in ${theme.visualStyle}, saturated ${theme.palette.join(
    ", ",
  )} palette, strong rim light, dynamic typography floating in atmospheric ${theme.atmosphere[0]}, hero posed with ${theme.motionKeywords[0]}.`;
};

const generateBlueprint = (idea: string, options: GeneratorOptions): Blueprint => {
  const theme = determineTheme(idea);
  const scenes = buildScenes(idea, theme);

  return {
    idea,
    theme,
    summary: {
      title: toTitle(idea),
      logline: buildLogline(idea, theme),
      mood: theme.mood,
      visualStyle: theme.visualStyle,
    },
    scenes,
    finalPrompt: buildFinalPrompt(idea, theme, scenes),
    voiceoverLines: options.includeVoiceover ? buildVoiceover(idea) : undefined,
    thumbnailPrompt: options.includeThumbnail ? buildThumbnailPrompt(idea, theme) : undefined,
  };
};

const SectionHeading = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold tracking-tight text-slate-100">{title}</h2>
);

const Label = ({ text }: { text: string }) => (
  <span className="text-sm font-medium text-slate-300">{text}</span>
);

const OutputLabel = ({ text }: { text: string }) => (
  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
    {text}
  </span>
);

const OptionToggle = ({
  id,
  label,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <label
    htmlFor={id}
    className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-black/20 backdrop-blur transition hover:border-cyan-400/60 hover:bg-white/10"
  >
    <span className="font-medium">{label}</span>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onToggle(event.target.checked)}
      className="h-4 w-4 accent-cyan-400"
    />
  </label>
);

const SummaryCard = ({ blueprint }: { blueprint: Blueprint }) => {
  const { summary } = blueprint;

  return (
    <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl shadow-black/30 backdrop-blur">
      <SectionHeading title="1. Video Summary" />
      <div className="space-y-3 text-sm text-slate-200">
        <div>
          <OutputLabel text="Short Title" />
          <p className="mt-1 text-base font-semibold text-white">{summary.title}</p>
        </div>
        <div>
          <OutputLabel text="One-Sentence Idea" />
          <p className="mt-1 leading-relaxed text-slate-200">{summary.logline}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <OutputLabel text="Mood & Tone" />
            <p className="mt-1 leading-relaxed text-slate-200 capitalize">{summary.mood}</p>
          </div>
          <div>
            <OutputLabel text="Visual Style" />
            <p className="mt-1 leading-relaxed text-slate-200 capitalize">
              {summary.visualStyle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SceneBreakdown = ({ scenes }: { scenes: ScenePlan[] }) => (
  <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl shadow-black/30 backdrop-blur">
    <SectionHeading title="2. Scene Breakdown" />
    <div className="space-y-6">
      {scenes.map((scene) => (
        <div
          key={scene.name}
          className="rounded-xl border border-white/5 bg-slate-900/40 p-5 shadow-lg shadow-black/30"
        >
          <h3 className="text-base font-semibold text-cyan-300">{scene.name}</h3>
          <dl className="mt-3 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
            <div>
              <OutputLabel text="Location & Setting" />
              <p className="mt-1 leading-relaxed">{scene.location}</p>
            </div>
            <div>
              <OutputLabel text="Characters" />
              <p className="mt-1 leading-relaxed">{scene.characters}</p>
            </div>
            <div>
              <OutputLabel text="Camera Angle & Movement" />
              <p className="mt-1 leading-relaxed">{scene.camera}</p>
            </div>
            <div>
              <OutputLabel text="Lighting" />
              <p className="mt-1 leading-relaxed">{scene.lighting}</p>
            </div>
            <div>
              <OutputLabel text="Key Actions" />
              <p className="mt-1 leading-relaxed">{scene.action}</p>
            </div>
            <div>
              <OutputLabel text="Atmosphere" />
              <p className="mt-1 leading-relaxed">{scene.atmosphere}</p>
            </div>
          </dl>
        </div>
      ))}
    </div>
  </div>
);

const FinalPromptCard = ({ finalPrompt }: { finalPrompt: string }) => (
  <div className="space-y-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-6 shadow-xl shadow-cyan-500/30 backdrop-blur">
    <SectionHeading title="3. Final Video Prompt (Most Important)" />
    <p className="text-sm leading-loose text-slate-100">{finalPrompt}</p>
  </div>
);

const Extras = ({
  voiceoverLines,
  thumbnailPrompt,
}: {
  voiceoverLines?: string[];
  thumbnailPrompt?: string;
}) => {
  if (!voiceoverLines && !thumbnailPrompt) return null;

  return (
    <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl shadow-black/30 backdrop-blur">
      <SectionHeading title="4. Extras" />
      <div className="space-y-6 text-sm text-slate-200">
        {voiceoverLines && (
          <div className="space-y-3">
            <OutputLabel text="Voiceover Lines" />
            <ul className="space-y-2">
              {voiceoverLines.map((line, index) => (
                <li
                  key={line}
                  className="rounded-lg border border-white/5 bg-slate-900/50 px-4 py-3 leading-relaxed shadow-inner shadow-black/20"
                >
                  <span className="mr-2 text-xs font-semibold text-cyan-300">
                    VO{index + 1}.
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
        {thumbnailPrompt && (
          <div>
            <OutputLabel text="Thumbnail / Poster Prompt" />
            <p className="mt-2 rounded-lg border border-white/5 bg-slate-900/50 px-4 py-3 leading-relaxed shadow-inner shadow-black/20">
              {thumbnailPrompt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [idea, setIdea] = useState("");
  const [includeVoiceover, setIncludeVoiceover] = useState(false);
  const [includeThumbnail, setIncludeThumbnail] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  const regenerateIfNeeded = (nextVoiceover: boolean, nextThumbnail: boolean) => {
    setBlueprint((prev) => {
      if (!prev) return prev;
      return generateBlueprint(prev.idea, {
        includeVoiceover: nextVoiceover,
        includeThumbnail: nextThumbnail,
      });
    });
  };

  const handleGenerate = () => {
    const sanitizedIdea = idea.trim();
    if (sanitizedIdea.length < 3) return;
    const freshBlueprint = generateBlueprint(sanitizedIdea, {
      includeVoiceover,
      includeThumbnail,
    });
    setBlueprint(freshBlueprint);
  };

  const handleVoiceoverToggle = (next: boolean) => {
    setIncludeVoiceover(next);
    regenerateIfNeeded(next, includeThumbnail);
  };

  const handleThumbnailToggle = (next: boolean) => {
    setIncludeThumbnail(next);
    regenerateIfNeeded(includeVoiceover, next);
  };

  const isDisabled = idea.trim().length < 3;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <header className="space-y-6 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Agentic Text-to-Video Architect
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Transform any idea into a cinematic text-to-video blueprint
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Feed the agent a concept and instantly receive a production-ready breakdown with mood,
            tone, detailed scenes, and a polished master prompt ready for AI video generators.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="space-y-3">
              <Label text="Your Idea" />
              <textarea
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="Example: A bioluminescent surfer riding midnight waves alongside orca whales."
                className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent transition focus:border-cyan-400/70 focus:ring-cyan-500/50"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <OptionToggle
                id="voiceover"
                label="Add voiceover suggestions"
                checked={includeVoiceover}
                onToggle={handleVoiceoverToggle}
              />
              <OptionToggle
                id="thumbnail"
                label="Add thumbnail / poster prompt"
                checked={includeThumbnail}
                onToggle={handleThumbnailToggle}
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isDisabled}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_20px_60px_-15px_rgba(56,189,248,0.6)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              Generate Blueprint
            </button>
            <p className="text-xs text-slate-400">
              Tip: Describe the mood, setting, characters, and motion you want. The agent interprets
              keywords like “space”, “noir”, “forest”, “chase”, and more.
            </p>
          </div>

          <div className="space-y-6">
            {blueprint ? (
              <>
                <SummaryCard blueprint={blueprint} />
                <SceneBreakdown scenes={blueprint.scenes} />
                <FinalPromptCard finalPrompt={blueprint.finalPrompt} />
                <Extras
                  voiceoverLines={blueprint.voiceoverLines}
                  thumbnailPrompt={blueprint.thumbnailPrompt}
                />
              </>
            ) : (
              <div className="flex h-full min-h-[540px] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-cyan-500/30 bg-slate-900/40 text-center">
                <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Awaiting Concept
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-slate-300">
                  Drop an idea in the panel and the agent will compose a high-definition video
                  blueprint with scene-by-scene cinematography and a master prompt ready for your
                  favorite text-to-video model.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
