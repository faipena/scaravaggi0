import { Button } from "../components/Button.tsx";

interface PrankConfirmationProps {
  success: boolean;
}

export default function ConfirmationResult(props: PrankConfirmationProps) {
  const success = props.success;
  const headerColor = props.success ? "text-purple-500" : "text-red-500";
  return (
    <div class="w-full max-w-4xl mt-4 p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 class={"text-3xl font-bold mb-6 " + headerColor}>
        {success ? "Scherzo confermato" : "Scherzo non trovato"}
      </h2>
      <p class="text-white">
        {success
          ? "Lo scherzo è stato confermato. I nostri zuzzurelloni se ne prenderanno carico e, se vorranno, lo faranno live!"
          : "Scherzo non trovato o precedentemente confermato."}
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
