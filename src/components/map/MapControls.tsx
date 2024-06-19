import { Box, Button, Stack, TextField } from "@mui/material";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { SwipeableDrawer } from "@/components";
import { useSavePolygon } from "./hooks";
import { Polygon, Feature, GeoJsonProperties } from "geojson";
import { PolygonDocument } from "@/models";
import { Timestamp, serverTimestamp } from "firebase/firestore";

interface MapControlsProps {
  draw: MapboxDraw;
  map: mapboxgl.Map;
  polygonList: PolygonDocument[] | undefined;
}

export const MapControls = ({ draw, map, polygonList }: MapControlsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, toggleDrawer] = useState(true);
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const { savePolygon } = useSavePolygon();

  const resetState = () => {
    setTitle("");
    setSelectedPolygonIds([]);
    draw.changeMode("simple_select");
    setIsEditing(false);
  };

  const getExistingPolygon = useCallback(
    (id: string) => {
      return polygonList?.find((p) => p.polygon.id === id);
    },
    [polygonList]
  );

  const handleAddPolygon = () => {
    setIsEditing(true);
    toggleDrawer(true);
    draw.changeMode("draw_polygon");
  };

  const handleDeletePolygon = () => {
    if (selectedPolygonIds.length > 0) {
      selectedPolygonIds.forEach((id) => {
        const polygon = getExistingPolygon(id);
        if (polygon) {
          // delete polygon from DB
          savePolygon({
            ...polygon,
            deletedAt: serverTimestamp() as Timestamp,
          });
        }
      });

      draw.delete(selectedPolygonIds);
      console.log("Deleted polygon");
    }

    resetState();
    console.log("Reset state");
  };

  const handleCreatePolygon = () => {
    setIsEditing(false);
  };

  const handleSavePolygon = async () => {
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

    // Check if polygon exists
    const existingPolygon = getExistingPolygon(`${polygon.id}`);

    if (existingPolygon) {
      // Update existing polygon
      await savePolygon({ ...existingPolygon, title, polygon });
    } else {
      // Save new polygon
      await savePolygon({
        title,
        polygon,
        createdAt: serverTimestamp() as Timestamp,
        deletedAt: null,
      });
    }

    resetState();
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
      // Set title to existing polygon title
      if (selectedPolygonIds.length === 1) {
        const polygon = getExistingPolygon(selectedPolygonIds[0]);

        if (polygon) {
          setTitle(polygon.title);
        }
      }
    } else {
      setTitle("");
      setIsEditing(false);
    }
  }, [getExistingPolygon, polygonList, selectedPolygonIds]);

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
