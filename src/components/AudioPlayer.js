import { useEffect, useRef } from "react";

const AudioPlayer = ({ currentTrackUrl, setIsPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (currentTrackUrl) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  }, [currentTrackUrl]);

  return (
    <audio
      ref={audioRef}
      onEnded={() => setIsPlaying(false)}
      onPause={() => setIsPlaying(false)}
      onPlay={() => setIsPlaying(true)}
    >
      <source src={currentTrackUrl} type="audio/mpeg" />
    </audio>
  );
};

export default AudioPlayer;
