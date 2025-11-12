import MapContainer from "@/features/map/MapContainer";

export default function MapPage() {
  return (
    <div className="px-3 sm:px-4 md:px-6 pt-3 pb-4 sm:pb-6">
      <div className="items-center flex flex-col pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 text-center px-2">Mapa de Acessibilidade</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-[1.5] text-center px-2">
          Encontre estabelecimentos e locais acessíveis no bairro{" "}
          <span className="font-bold">Campolim, Sorocaba/SP</span>
        </p>
      </div>
      <MapContainer />
    </div>
  );
}
