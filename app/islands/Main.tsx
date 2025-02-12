import type { Signal } from "@preact/signals";
import YoutubePlayer from "../components/YoutubePlayer.tsx";
import { Button } from "../components/Button.tsx";
import FormField from "../components/FormField.tsx";
import FormTextArea from "../components/FormTextArea.tsx";
import { useSignal } from "@preact/signals";

// Enum representing the different stages of the form
export enum MainStage {
  Video,
  VictimDetails,
  PrankDetails,
  RequestSent,
}

interface MainProps {
  videoId: Signal<string>;
  stage: Signal<MainStage>;
}

// Class representing the form data
class PrankForm {
  victimName: string = "";
  victimBirthCity: string = "";
  victimCurrentCity: string = "";
  victimBirthDate: string = "";
  victimPhoneNumber: string = "";
  relationship: string = "";
  prankTypeId: string = "";
  description: string = "";
  email: string = "";
  // Captcha elements
  weddingDate: string = `${new Date().getTime()}`;
  superSecretCode: string = "";
}

export default function Main(props: MainProps) {
  const prankForm = useSignal(new PrankForm());

  // Determine the current stage
  const isVideoStage = props.stage.value === MainStage.Video;
  const isVictimDetailsStage = props.stage.value == MainStage.VictimDetails;
  const isPrankDetailsStage = props.stage.value == MainStage.PrankDetails;
  const isRequestSentStage = props.stage.value == MainStage.RequestSent;

  // Handle input changes and update the form data
  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    prankForm.value = { ...prankForm.value, [target.name]: target.value };
  };

  // Handle form submission for victim details
  const handleVictimDetailsSubmit = (event: Event) => {
    event.preventDefault();
    props.stage.value = MainStage.PrankDetails;
  };

  // Handle form submission for prank details
  const handlePrankDetailsSubmit = async (event: Event) => {
    event.preventDefault();
    props.stage.value = MainStage.RequestSent;
    await fetch("/api/v1/prank", {
      method: "POST",
      body: JSON.stringify(prankForm.value),
    });
  };

  // Reset the form data
  const resetForm = () => {
    prankForm.value = new PrankForm();
  };

  // Render the close button
  const renderCloseButton = () => (
    <button
      class="absolute top-4 right-4 text-white text-2xl"
      onClick={() => {
        resetForm();
        props.stage.value = MainStage.Video;
      }}
    >
      &times;
    </button>
  );

  // Render the video stage
  const renderVideoStage = () => (
    <>
      <div class="w-full max-w-4xl mb-8 justify-center flex">
        <YoutubePlayer videoId={props.videoId.value}></YoutubePlayer>
      </div>
      <Button
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 "
        onClick={() => {
          resetForm();
          props.stage.value = MainStage.VictimDetails;
        }}
      >
        Richiedi uno scherzo
      </Button>
    </>
  );

  // Render the victim details stage
  const renderVictimDetailsStage = () => (
    <>
      <div class="w-full max-w-4xl mt-4 p-8 bg-gray-800 rounded-lg shadow-lg relative">
        {renderCloseButton()}
        <h2 class="text-3xl font-bold text-purple-500 mb-6">
          Dettagli della vittima
        </h2>
        <form class="space-y-6" onSubmit={handleVictimDetailsSubmit}>
          <FormField
            label="Il nome della vittima"
            type="text"
            name="victimName"
            required
            value={prankForm.value.victimName}
            onChange={handleInputChange}
          />
          <FormField
            label="Numero di telefono della vittima"
            type="text"
            name="victimPhoneNumber"
            required
            pattern="^\+?[1-9]\d{1,14}$" // E.164 international phone number format
            title="Inserisci un numero di telefono valido"
            value={prankForm.value.victimPhoneNumber}
            onChange={handleInputChange}
          />
          <FormField
            label="Città di nascita della vittima"
            type="text"
            name="victimBirthCity"
            value={prankForm.value.victimBirthCity}
            onChange={handleInputChange}
          />
          <FormField
            label="Città attuale della vittima"
            type="text"
            name="victimCurrentCity"
            value={prankForm.value.victimCurrentCity}
            onChange={handleInputChange}
          />
          <FormField
            label="Data di nascita della vittima"
            type="date"
            name="victimBirthDate"
            value={prankForm.value.victimBirthDate}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          >
            Procedi alla fase successiva
          </Button>
        </form>
      </div>
    </>
  );

  // Render the prank details stage
  const renderPrankDetailsStage = () => (
    <>
      <div class="w-full max-w-4xl mt-4 p-8 bg-gray-800 rounded-lg shadow-lg relative">
        {renderCloseButton()}
        <h2 class="text-3xl font-bold text-purple-500 mb-6">
          Dettagli dello scherzo
        </h2>
        <form class="space-y-6" onSubmit={handlePrankDetailsSubmit}>
          <FormField
            label="La tua email"
            type="email"
            name="email"
            required
            value={prankForm.value.email}
            onChange={handleInputChange}
          />
          <FormTextArea
            label="Descrizione dello scherzo"
            name="description"
            value={prankForm.value.description}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Codice super super super super segreto"
            type="text"
            name="superSecretCode"
            value={prankForm.value.superSecretCode}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Data di matrimonio"
            type="number"
            name="weddingDate"
            value={prankForm.value.weddingDate}
            onChange={handleInputChange}
            hidden
            required
          />
          <FormField
            label="Relazione con la vittima"
            type="text"
            name="relationship"
            value={prankForm.value.relationship}
            onChange={handleInputChange}
          />
          <FormField
            label="Tipo di scherzo"
            type="number"
            name="prankTypeId"
            value={prankForm.value.prankTypeId}
            onChange={handleInputChange}
            hidden
          />
          <div class="flex justify-between">
            <Button
              type="button"
              class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              onClick={() => props.stage.value = MainStage.VictimDetails}
            >
              Torna indietro
            </Button>
            <Button
              type="submit"
              class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              Invia la richiesta
            </Button>
          </div>
        </form>
      </div>
    </>
  );

  // Render the request sent stage
  const renderRequestSentStage = () => (
    <>
      <div class="w-full max-w-4xl mt-4 p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 class="text-3xl font-bold text-purple-500 mb-6">
          Richiesta inviata
        </h2>
        <p class="text-white">
          Grazie per aver richiesto uno scherzo! Controlla la tua email per
          confermare la richiesta.
        </p>
        <Button
          class="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          onClick={() => {
            resetForm();
            props.stage.value = MainStage.Video;
          }}
        >
          Torna alla pagina iniziale
        </Button>
      </div>
    </>
  );

  return (
    <>
      {isVideoStage && renderVideoStage()}
      {isVictimDetailsStage && renderVictimDetailsStage()}
      {isPrankDetailsStage && renderPrankDetailsStage()}
      {isRequestSentStage && renderRequestSentStage()}
    </>
  );
}
