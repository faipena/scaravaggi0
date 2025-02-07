export default function LogoWidget() {
  return (
    <>
      <div class="min-h-screen flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div class="mb-8">
          <img
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
        </div>

        <div class="relative">
          <div class="live-indicator">
            <span class="text-red-500 font-bold">LIVE</span>
            <div class="live-dot"></div>
          </div>
          <h1 class="py-3 font-godzilla text-6xl font-bold text-purple-500">
            GodzillaZ
          </h1>
        </div>
      </div>
    </>
  );
}
