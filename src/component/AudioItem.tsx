import { FC } from "react";

const AudioItem: FC<{ audioSrc: string }> = ({ audioSrc }) => {
  return (
    <audio controls>
      {audioSrc && (
        <>
          <source type="audio/ogg" src={audioSrc} />
          <source type="audio/mpeg" src={audioSrc} />
          Your browser does not support the audio tag.
        </>
      )}
    </audio>
  );
};

export default AudioItem;
