import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

const apiPollingInterval = 5000;

export default function LiveLogo() {
  const isLiveSignal = useSignal(false);

  useEffect(() => {
    const fetchInterval = setInterval(async () => {
      const resp = await fetch("api/v1/live");
      const respBody = await resp.json();
      isLiveSignal.value = respBody.isLive;
    }, apiPollingInterval);
    return () => clearInterval(fetchInterval);
  });

  //if (isLiveSignal.value) {
  //  return <img src="./img/live.webp"></img>;
  //} else {
  //  return <img src="./img/live.webp" style="display:none;"></img>;
  //}
}
