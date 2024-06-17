import React, { SetStateAction, useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { Box } from "@mui/material";
import { config } from "@/config";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { MapControls } from "./MapControls";
import { When } from "react-if";

mapboxgl.accessToken = config.mapboxAccessToken;

export const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-111.8593);
  const [lat, setLat] = useState(40.6489);
  const [zoom, setZoom] = useState(10);

  const [map, setMap] = useState<MapboxMap | null>(null);
  const [draw, setDraw] = useState<MapboxDraw | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current ?? "",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const newDraw = new MapboxDraw({
      displayControlsDefault: false,
    });

    // Add navigation control (the +/- zoom buttons)
    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");
    newMap.addControl(newDraw, "top-left");

    newMap.on("move", () => {
      setLng(
        newMap.getCenter().lng.toFixed(4) as unknown as SetStateAction<number>
      );
      setLat(
        newMap.getCenter().lat.toFixed(4) as unknown as SetStateAction<number>
      );
      setZoom(newMap.getZoom().toFixed(2) as unknown as SetStateAction<number>);
    });

    setMap(newMap);
    setDraw(newDraw);

    // Clean up on unmount
    return () => {
      setDraw(null);
      setMap(null);
      newMap.remove();
    };
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
          bottom: "30px",
          left: 0,
          right: 0,
        }}
        ref={mapContainerRef}
      />
      <When condition={draw !== null && map !== null}>
        <MapControls draw={draw!} map={map!} />
      </When>
    </Box>
  );
};
