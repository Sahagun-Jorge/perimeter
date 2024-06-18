import { Box, Button, Stack, TextField } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { SwipeableDrawer } from "@/components";
import { useSavePolygon } from "./hooks";
import { Polygon, Feature, GeoJsonProperties } from "geojson";

interface MapControlsProps {
  draw: MapboxDraw;
  map: mapboxgl.Map;
}

export const MapControls = ({ draw, map }: MapControlsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, toggleDrawer] = useState(true);
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const { savePolygon } = useSavePolygon();

  const handleAddPolygon = () => {
    setIsEditing(true);
    toggleDrawer(true);
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

  const handleSavePolygon = () => {
    if (title === "") {
      setHasError(true);
      return;
    }
    setHasError(false);

    const polygon = draw.get(selectedPolygonIds[0]) as Feature<
      Polygon,
      GeoJsonProperties
    >;

    if (!polygon) {
      return;
    }

    savePolygon(title, polygon);
    setTitle("");
    setIsEditing(false);
    draw.changeMode("simple_select");
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
    <SwipeableDrawer
      open={open}
      onClose={() => toggleDrawer(false)}
      onOpen={() => toggleDrawer(true)}
    >
      <Stack direction="row" gap={2} justifyContent="center" flexWrap="wrap">
        <If condition={isEditing}>
          <Then>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleDeletePolygon}
              size="small"
              disabled={!isEditing}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePolygon}
              size="small"
              disabled={!isEditing || selectedPolygonIds.length === 0}
            >
              Save
            </Button>
            <Box component="form" width="100%">
              <TextField
                id="title"
                value={title}
                label="Title"
                fullWidth
                size="small"
                error={hasError}
                helperText={hasError ? "Title is required" : ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setTitle(e.target.value);
                }}
              />
            </Box>
          </Then>
          <Else>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPolygon}
              size="small"
              sx={{ width: "max-content" }}
            >
              Add Polygon
            </Button>
          </Else>
        </If>
      </Stack>
    </SwipeableDrawer>
  );
};
