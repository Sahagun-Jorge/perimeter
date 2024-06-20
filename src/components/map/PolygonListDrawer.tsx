import { Polygon, PolygonDocument } from "@/models";
import { Button, Drawer, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { Else, If, Then } from "react-if";

interface PolygonListDrawerProps {
  draw: MapboxDraw;
  map: mapboxgl.Map;
  polygonList?: PolygonDocument[];
  setSelectedPolygonIds: (ids: string[]) => void;
}
export const PolygonListDrawer = ({
  draw,
  map,
  polygonList,
  setSelectedPolygonIds,
}: PolygonListDrawerProps) => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleClick = (polygon: Polygon) => {
    const { id, geometry } = polygon;
    draw.changeMode("");
    setSelectedPolygonIds([`${id}`]);
    map.flyTo({
      center: geometry.coordinates[0][0] as [number, number],
      zoom: 12,
    });
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={toggleDrawer(true)}
        sx={{ m: 2 }}
      >
        Polygon List
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        hideBackdrop={true}
        disableAutoFocus={true}
        disableEnforceFocus={true}
        PaperProps={{ sx: { height: "auto", maxWidth: "300px" } }}
        sx={{
          position: "static",
        }}
      >
        <If condition={polygonList === undefined}>
          <Then> No polygons created</Then>
          <Else>
            <Stack sx={{ py: 3, px: 3, gap: 2, position: "relative" }}>
              <IconButton
                onClick={toggleDrawer(false)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  py: 0,
                }}
              >
                x
              </IconButton>
              <Typography variant="h5">Created Polygons</Typography>
              <Stack>
                {polygonList!.map(({ title, polygon }) => (
                  <Button
                    variant="text"
                    key={polygon.id}
                    onClick={() => handleClick(polygon)}
                    sx={{ textAlign: "left", justifyContent: "flex-start" }}
                  >
                    {title}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Else>
        </If>
      </Drawer>
    </>
  );
};
