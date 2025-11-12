import MapContainer from "@/features/map/MapContainer";

export default function MapPage() {
  return (
    <div className="p-6 ">
      <div className="items-center flex flex-col pb-5 ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">Mapa de Acessibilidade</h1>
        <p className="text-base md:text-lg text-gray-800 leading-[1.5]">
          Encontre estabelecimentos e locais acessíveis no bairro{" "}
          <span className="font-bold">Campolim, Sorocaba/SP</span>
        </p>
      </div>
      <MapContainer />
    </div>
  );
}
