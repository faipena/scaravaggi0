interface YoutubePlayerProps {
  videoId: string;
}

export default function YoutubePlayer(props: YoutubePlayerProps) {
  return (
    <>
      <iframe
        width="560"
        height="315"
        src={"https://www.youtube-nocookie.com/embed/" + props.videoId}
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
