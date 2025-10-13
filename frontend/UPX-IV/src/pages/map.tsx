import MapContainer from "@/features/map/MapContainer";

export default function MapPage() {
  return (
    <div className="p-6 ">
      <div className="items-center flex flex-col pb-5 ">
        <h1 className="text-2xl font-bold mb-4 ">Mapa de Acessibilidade</h1>
        <p className="text-base text-neutral-800">
          Encontre estabelecimentos e locais acessíveis no bairro{" "}
          <span className="font-bold">Campolim, Sorocaba/SP</span>
        </p>
      </div>
      <MapContainer />
    </div>
  );
}
