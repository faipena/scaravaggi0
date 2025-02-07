import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface PrankProps {
  count?: Signal<number>;
}

export default function Prank(props: PrankProps) {
  return (
    <div class="flex gap-8 py-6">
      <Button
        onClick={() => {}}
        class="w-full py-3 px-6 border-gray-300 border-2 rounded bg-purple-400"
      >
        Richiedi uno scherzo 👀
      </Button>
    </div>
  );
}
