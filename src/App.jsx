import { useState } from "react";
import Loader from "./loader.jsx";
import horse from "./assets/horse.png";
import unicornText from "./assets/unicorn-text.png";
import eventsText from "./assets/events.png";
import destinationsText from "./assets/destinations.png";
import foundationsText from "./assets/foundations.png";
import infrasText from "./assets/infras.png";
import techText from "./assets/technologies.png";
import background from "./assets/background.mp4";

// Shown one after another, in this order.
// Set `url` to make a line clickable. Lines with url: null are not links yet.

const LINES = [
  {
    src: eventsText,
    alt: "Events",
    gap: "-mt-1",
    url: "https://www.unicornevent.com/",
  },
  // { src: destinationsText, alt: "Destinations", gap: "mt-0", url: null },
  { src: foundationsText, alt: "Foundations", gap: "mt-1.5", url: null },
  { src: infrasText, alt: "Infrastructure", gap: "-mt-1.5", url: null },
  {
    src: techText,
    alt: "Technologies",
    gap: "mt-2.5",
    url: "https://www.unicorntechnologiess.com/",
  },
];

const START_DELAY = 2.5; // seconds, after the UNICORN text has finished
const STEP = 0.7; // seconds between each line
const FADE_MS = 700; // must match duration-700 in Loader.jsx

export default function App() {
  // "loading" -> "fading" -> "done"
  const [phase, setPhase] = useState("loading");

  const handleLoaderFinish = () => {
    setPhase("fading");
    setTimeout(() => setPhase("done"), FADE_MS);
  };

  return (
    <>
      {phase !== "done" && (
        <Loader fading={phase === "fading"} onFinish={handleLoaderFinish} />
      )}

      {/* The site mounts when the loader starts fading, so its animations begin then */}
      {phase !== "loading" && (
        <main className="relative min-h-screen overflow-hidden bg-black">
          {/* Background video */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={background}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />

          {/* Slight dark overlay so the logo stands out */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
            <img
              src={horse}
              alt=""
              aria-hidden="true"
              draggable="false"
              className="watermark h-auto w-[80vw] max-w-[620px] select-none"
            />
          </div>

          {/* Logo block */}
          <div className="relative z-10 flex min-h-screen items-start justify-center px-6 pt-[10vh]">
            <div className="flex w-full max-w-[300px] flex-col items-center sm:max-w-[360px]">
              <img
                src={horse}
                alt=""
                draggable="false"
                className="horse h-auto select-none"
                style={{
                  width: "34%",
                  alignSelf: "flex-start",
                  marginLeft: "65%",
                }}
              />
              <img
                src={unicornText}
                alt="Unicorn"
                draggable="false"
                className="unicorn-text mt-1 h-auto w-full select-none"
              />

              {LINES.map((line, i) => {
                const image = (
                  <img
                    src={line.src}
                    alt={line.alt}
                    draggable="false"
                    className="tech-text h-auto w-full select-none"
                    style={{ animationDelay: `${START_DELAY + i * STEP}s` }}
                  />
                );

                return line.url ? (
                  <a
                    key={line.alt}
                    href={line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${line.alt}`}
                    className={`logo-btn block w-full ${line.gap}`}
                  >
                    {image}
                  </a>
                ) : (
                  <div key={line.alt} className={`block w-full ${line.gap}`}>
                    {image}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
