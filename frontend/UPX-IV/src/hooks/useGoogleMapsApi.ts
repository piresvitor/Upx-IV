import { useState, useEffect } from "react";

export function useGoogleMapsApi(): boolean {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    const checkGoogle = () => {
      if (window.google && window.google.maps) {
        setLoaded(true);
      } else {
        requestAnimationFrame(checkGoogle);
      }
    };

    checkGoogle();
  }, []);

  return loaded;
}
