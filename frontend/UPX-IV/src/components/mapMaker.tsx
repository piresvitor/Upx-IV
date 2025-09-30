import { Marker } from "@react-google-maps/api";

type Props = {
  position: google.maps.LatLngLiteral;
};

export default function MapMarker({ position }: Props) {
  return <Marker position={position} />;
}
