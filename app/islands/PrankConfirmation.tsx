import { Button } from "../components/Button.tsx";

interface PrankConfirmationProps {
  success: boolean;
}

export default function ConfirmationResult(props: PrankConfirmationProps) {
  const success = props.success;
  return (
    <div class="w-full max-w-4xl mt-4 p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-purple-500 mb-6">
        {success ? "Scherzo confermato" : "Scherzo non trovato"}
      </h2>
      <p class="text-white">
        Grazie per aver richiesto uno scherzo! Controlla la tua email per
        confermare la richiesta.
      </p>
      <Button
        class="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
        onClick={() => {
          globalThis.location.assign("/");
        }}
      >
        Torna alla pagina iniziale
      </Button>
    </div>
  );
}
