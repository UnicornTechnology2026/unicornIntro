import { useEffect, useRef, useState } from "react";
import Loader from "./loader.jsx";
import horse from "./assets/horse.png";
import unicornText from "./assets/unicorn-text.png";
import eventsText from "./assets/event.png";
import destinationsText from "./assets/destination.png";
import conceptText from "./assets/concept.png";
import foundationsText from "./assets/foundation.png";
import infrasText from "./assets/infra.png";
import techText from "./assets/technologies.png";
import background from "./assets/background.mp4";

// Shown one after another, in this order.
// Clicking a word shows it big in the center over a blurred background.
// If a line has a `url`, that website opens after the effect + a short pause.
const LINES = [
  {
    src: eventsText,
    alt: "Events",
    gap: "mt-3",
    url: "https://www.unicornevent.com/",
  },
  { src: infrasText, alt: "Infrastructure", gap: "mt-3" },
  { src: conceptText, alt: "Concepts", gap: "mt-3" },
  { src: foundationsText, alt: "Foundations", gap: "mt-3" },
  {
    src: techText,
    alt: "Technologies",
    gap: "mt-3",
    url: "https://www.unicorntechnologiess.com/",
  },
  { src: destinationsText, alt: "Destinations", gap: "mt-3" },
];

const START_DELAY = 0.4; // seconds after the loader finishes, before "Events" starts
const STEP = 0.9; // seconds between each line

const GROW_MS = 2000; // must match --grow-time in index.css
const PAUSE_MS = 2000; // pause after the word has grown, before the website shows

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(null); // index of the clicked word
  const bgRef = useRef(null);
  const timerRef = useRef(null);
  const [fallbackUrl, setFallbackUrl] = useState(null);

  // Start the background video only when the loader is gone
  useEffect(() => {
    if (loaded && bgRef.current) {
      bgRef.current.currentTime = 0;
      bgRef.current.play().catch(() => {});
    }
  }, [loaded]);

  const closeOverlay = () => {
    clearTimeout(timerRef.current); // cancels the website opening
    setActive(null);
    setFallbackUrl(null);
  };

  const openLine = (i) => {
    clearTimeout(timerRef.current);
    setFallbackUrl(null);
    setActive(i);

    const { url } = LINES[i];
    if (!url) return; // no website for this word: just show it big

    // word grows (GROW_MS) -> pause (PAUSE_MS) -> website opens in a new tab
    timerRef.current = setTimeout(() => {
      const win = window.open(url, "_blank");
      if (win) {
        closeOverlay();
      } else {
        // Browser blocked the new tab -> show a button instead
        setFallbackUrl(url);
      }
    }, GROW_MS + PAUSE_MS);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Esc closes the overlay
  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => e.key === "Escape" && closeOverlay();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <main
        className={`relative min-h-screen overflow-hidden bg-black ${
          loaded ? "site-started" : ""
        }`}
      >
        {/* Background video (paused until loader finishes) */}
        <video
          ref={bgRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={background}
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* Slight dark overlay so the logo stands out */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Logo block */}
        <div className="relative z-10 flex min-h-screen items-start justify-center px-6 pt-[10vh]">
          <div className="flex w-full max-w-[300px] flex-col items-center sm:max-w-[360px]">
            <img
              src={horse}
              alt=""
              draggable="false"
              decoding="sync"
              loading="eager"
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
              decoding="sync"
              loading="eager"
              className="unicorn-text mt-1 h-auto w-full select-none"
            />

            {/* Every word is a button */}
            {LINES.map((line, i) => (
              <button
                key={line.alt}
                type="button"
                onClick={() => openLine(i)}
                aria-label={`Open ${line.alt}`}
                className={`logo-btn block w-full ${line.gap}`}
              >
                <img
                  src={line.src}
                  alt={line.alt}
                  draggable="false"
                  loading="eager"
                  className="tech-text h-auto w-full select-none"
                  style={{ animationDelay: `${START_DELAY + i * STEP}s` }}
                />
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Blurred overlay with the clicked word growing in the center */}
      {active !== null && (
        <div
          className="word-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={LINES[active].alt}
          onClick={closeOverlay}
        >
          <button
            type="button"
            className="word-overlay-x"
            aria-label="Close"
            onClick={closeOverlay}
          >
            ×
          </button>
          <img
            src={LINES[active].src}
            alt={LINES[active].alt}
            draggable="false"
            className="word-overlay-img"
          />
          {fallbackUrl && (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="word-overlay-visit"
              onClick={(e) => e.stopPropagation()}
            >
              Visit site
            </a>
          )}
        </div>
      )}

      {/* Loader sits on top; removed instantly when its video ends */}
      {!loaded && <Loader onFinish={() => setLoaded(true)} />}
    </>
  );
}
