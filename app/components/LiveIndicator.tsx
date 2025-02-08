import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function LiveIndicator(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="live-indicator"
    >
      <span class="text-red-500 font-bold">LIVE</span>
      <div class="live-dot"></div>
    </div>
  );
}
