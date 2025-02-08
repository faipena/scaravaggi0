import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  props.class ??= "px-2 py-1 border-gray-300 border-2 rounded bg-purple-400";
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={props.class}
    />
  );
}
