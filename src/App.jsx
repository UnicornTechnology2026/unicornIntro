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
// Set `url` to make a line clickable. Lines with url: null are not links yet.

const LINES = [
  {
    src: eventsText,
    alt: "Events",
    gap: "mt-3",
    url: "https://www.unicornevent.com/",
  },
  { src: infrasText, alt: "Infrastructure", gap: "mt-3", url: null },
  { src: conceptText, alt: "Concepts", gap: "mt-3", url: null },
  { src: foundationsText, alt: "Foundations", gap: "mt-3", url: null },
  {
    src: techText,
    alt: "Technologies",
    gap: "mt-3",
    url: "https://www.unicorntechnologiess.com/",
  },
  { src: destinationsText, alt: "Destinations", gap: "mt-3", url: null },
];

const START_DELAY = 0.4; // seconds after the loader finishes, before "Events" starts
const STEP = 0.9; // seconds between each line

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const bgRef = useRef(null);

  // Start the background video only when the loader is gone
  useEffect(() => {
    if (loaded && bgRef.current) {
      bgRef.current.currentTime = 0;
      bgRef.current.play().catch(() => {});
    }
  }, [loaded]);

  return (
    <>
      {/* Site is ALWAYS mounted (hidden behind the loader) so images are
          already loaded & decoded when the loader ends -> no gap */}
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

        {/* <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
          <img
            src={horse}
            alt=""
            aria-hidden="true"
            draggable="false"
            decoding="sync"
            loading="eager"
            className="watermark h-auto w-[80vw] max-w-[620px] select-none"
          />
        </div> */}

        {/* Logo block */}
        <div className="relative z-10 flex min-h-screen items-start justify-center px-6 pt-[10vh]">
          <div className="flex w-full max-w-[300px] flex-col items-center sm:max-w-[360px]">
            {/* Horse: visible immediately, no animation */}
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
            {/* UNICORN text: visible immediately, no animation */}
            <img
              src={unicornText}
              alt="Unicorn"
              draggable="false"
              decoding="sync"
              loading="eager"
              className="unicorn-text mt-1 h-auto w-full select-none"
            />

            {/* Only these lines animate (after the loader finishes) */}
            {LINES.map((line, i) => {
              const image = (
                <img
                  src={line.src}
                  alt={line.alt}
                  draggable="false"
                  loading="eager"
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

      {/* Loader sits on top; removed instantly when its video ends */}
      {!loaded && <Loader onFinish={() => setLoaded(true)} />}
    </>
  );
}
