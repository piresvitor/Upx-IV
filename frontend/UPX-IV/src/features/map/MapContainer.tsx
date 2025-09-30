import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
} from "@/services/googleMaps";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -23.55052,
  lng: -46.633308,
};

export default function MapContainer() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  if (loadError) return <p>Erro ao carregar o mapa</p>;
  if (!isLoaded) return <p>Carregando...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
    ></GoogleMap>
  );
}
