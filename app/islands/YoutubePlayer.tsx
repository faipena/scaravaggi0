import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface YoutubePlayerProps {
  videoId: Signal<string>;
}

export default function YoutubePlayer(props: YoutubePlayerProps) {
  return (
    <>
      <span>{props.videoId.value}</span>
      <iframe
        width="560"
        height="315"
        src={"https://www.youtube-nocookie.com/embed/" + props.videoId.value}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowFullScreen
      >
      </iframe>
    </>
  );
}
