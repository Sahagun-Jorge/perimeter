import React, { SetStateAction, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@mui/material";
import { config } from "@/config";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

mapboxgl.accessToken = config.mapboxAccessToken;

export const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-111.8593);
  const [lat, setLat] = useState(40.6489);
  const [zoom, setZoom] = useState(10);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current ?? "",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    console.log(map, draw);

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(draw, "top-left");

    map.on("move", () => {
      setLng(
        map.getCenter().lng.toFixed(4) as unknown as SetStateAction<number>
      );
      setLat(
        map.getCenter().lat.toFixed(4) as unknown as SetStateAction<number>
      );
      setZoom(map.getZoom().toFixed(2) as unknown as SetStateAction<number>);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Box
        sx={{
          display: "inline-block",
          position: "absolute",
          top: 0,
          left: 0,
          margin: "12px",
          backgroundColor: "#404040",
          color: "#ffffff",
          zIndex: "1 !important",
          padding: "6px",
          fontWeight: "bold",
        }}
      >
        <Box>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        ref={mapContainerRef}
      />
    </Box>
  );
};
