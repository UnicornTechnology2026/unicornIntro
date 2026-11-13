import { useEffect, useRef } from "react";
import loaderVideo from "./assets/loaderfinal.mp4";

export default function Loader({ fading, onFinish }) {
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onFinish();
  };

  // Safety net: if the video can't play or never ends, continue anyway.
  useEffect(() => {
    const t = setTimeout(finish, 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-700 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        className="h-full w-full object-cover"
        src={loaderVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        aria-hidden="true"
      />
    </div>
  );
}
