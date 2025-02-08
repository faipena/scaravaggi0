import type { Signal } from "@preact/signals";
import YoutubePlayer from "../components/YoutubePlayer.tsx";

export enum MainStatus {
  Start,
  First,
  Second,
}

interface MainProps {
  videoId: Signal<string>;
  status: Signal<MainStatus>;
}

export default function Main(props: MainProps) {
  const firstStage = props.status.value === MainStatus.Start;
  const secondStage = props.status.value == MainStatus.First;
  return (
    <>
      {firstStage && (
        <>
          <div class="w-full max-w-4xl mb-8 justify-center flex">
            <YoutubePlayer videoId={props.videoId.value}></YoutubePlayer>
          </div>
          <button
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 "
            onClick={() => props.status.value = MainStatus.First}
          >
            Richiedi uno scherzo
          </button>
        </>
      )}
      {secondStage && (
        <>
          <div
            id="formSection"
            class="w-full max-w-4xl mt-4 p-8 bg-gray-800 rounded-lg shadow-lg"
          >
            <h2 class="text-3xl font-bold text-purple-500 mb-6">
              Richiedi uno scherzo
            </h2>
            <form id="prankForm" class="space-y-6">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-300"
                >
                  Il nome della vittima
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-300"
                >
                  La tua email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label
                  for="prankDetails"
                  class="block text-sm font-medium text-gray-300"
                >
                  Dettagli dello scherzo
                </label>
                <textarea
                  id="prankDetails"
                  name="prankDetails"
                  rows={4}
                  class="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                Invia richiesta
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
