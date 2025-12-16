import CSGlassLoader from "@/components/cs/CSGlassLoader/CSGlassLoader";

export function MapLoading() {
  return (
    <div className="relative h-full w-full">
      <CSGlassLoader
        variant="full"
        size="md"
        message="Carregando mapa"
        className="rounded-lg"
      />
    </div>
  );
}
