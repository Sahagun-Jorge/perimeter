import { Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";

interface MapControlsProps {
  draw: MapboxDraw;
  map: mapboxgl.Map;
}

export const MapControls = ({ draw, map }: MapControlsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<string[]>([]);

  const handleAddPolygon = () => {
    setIsEditing(true);
    draw.changeMode("draw_polygon");
  };

  const handleDeletePolygon = () => {
    draw.delete(selectedPolygonIds);
    setSelectedPolygonIds([]);
    draw.changeMode("simple_select");
    setIsEditing(false);
  };

  const handleCreatePolygon = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    map.on("draw.create", () => {
      handleCreatePolygon();
    });

    map.on("draw.selectionchange", () => {
      setSelectedPolygonIds(draw.getSelectedIds());
    });
  }, [draw, map]);

  useEffect(() => {
    if (selectedPolygonIds.length > 0) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [selectedPolygonIds]);

  return (
    <>
      <Stack sx={{ position: "absolute", bottom: 50, left: 20 }}>
        <If condition={isEditing}>
          <Then>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeletePolygon}
            >
              Delete Polygon
            </Button>
          </Then>
          <Else>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPolygon}
            >
              Add Polygon
            </Button>
          </Else>
        </If>
      </Stack>
      {/* TODO: Add a SwipeableDrawer */}
    </>
  );
};
