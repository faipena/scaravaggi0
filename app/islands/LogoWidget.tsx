import { LiveIndicator } from "../components/LiveIndicator.tsx";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

const API_POLLING_INTERVAL = 30_000;

export default function LogoWidget() {
  const isLiveSignal = useSignal(false);

  useEffect(() => {
    const fetchApi = async () => {
      const resp = await fetch("/api/v1/live");
      const respBody = await resp.json();
      isLiveSignal.value = respBody.isLive;
    };
    fetchApi();
    const fetchInterval = setInterval(async () => {
      await fetchApi();
    }, API_POLLING_INTERVAL);
    return () => clearInterval(fetchInterval);
  });

  return (
    <>
      <div class="flex flex-col items-center p-8">
        {/* Logo */}
        <div
          class="mb-8 cursor-pointer"
          onClick={() => {
            globalThis.location.assign("/");
          }}
        >
          <img
            src="/logo-dark.svg"
            width="128"
            height="128"
            alt="GodzillaZ TV logo"
          />
        </div>

        <div
          class={`relative ${isLiveSignal.value ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (isLiveSignal.value) {
              globalThis.open("https://www.twitch.tv/godzillaz_tv", "_blank");
            }
          }}
        >
          {isLiveSignal.value && <LiveIndicator />}
          <h1 class="py-3 font-godzilla text-6xl font-bold text-white text-stroke-purple-500 text-stroke-1 select-none">
            GodzillaZ
          </h1>
        </div>
      </div>
    </>
  );
}
