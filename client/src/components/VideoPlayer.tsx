import React, { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      // playsInline // run video in the same window
      muted={true} // muted
      style={{ transform: "scaleX(-1)", width: "100%" }} // rotate video horizontally
    />
  );
};
