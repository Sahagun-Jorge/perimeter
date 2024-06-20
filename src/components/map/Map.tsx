import React, { SetStateAction, useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { Box } from "@mui/material";
import { config } from "@/config";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { MapControls } from "./MapControls";
import { When } from "react-if";
import { usePolygons } from "./hooks/usePolygons";
import { Loading } from "@/components";

mapboxgl.accessToken = config.mapboxAccessToken;

export const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-111.8593);
  const [lat, setLat] = useState(40.6489);
  const [zoom, setZoom] = useState(10);
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [draw, setDraw] = useState<MapboxDraw | null>(null);
  const [polygonList, isLoading] = usePolygons();
  const [mapLoaded, setMapLoaded] = useState(false);

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

    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");
    newMap.addControl(newDraw, "top-left");
    newMap.addControl(new mapboxgl.GeolocateControl(), "top-right");

    newMap.on("move", () => {
      setLng(
        newMap.getCenter().lng.toFixed(4) as unknown as SetStateAction<number>
      );
      setLat(
        newMap.getCenter().lat.toFixed(4) as unknown as SetStateAction<number>
      );
      setZoom(newMap.getZoom().toFixed(2) as unknown as SetStateAction<number>);
    });

    newMap.on("load", () => {
      setMapLoaded(true);
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

  useEffect(() => {
    if (mapLoaded && !isLoading && polygonList) {
      polygonList.forEach(({ polygon }) => {
        draw?.add(polygon);
      });
    }
  }, [draw, isLoading, mapLoaded, polygonList]);

  return (
    <Box>
      <Loading isLoading={isLoading} />
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
        <MapControls draw={draw!} map={map!} polygonList={polygonList} />
      </When>
    </Box>
  );
};
