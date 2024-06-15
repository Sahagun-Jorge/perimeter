import React from "react";
import "./global.css";
import { Stack } from "@mui/material";
import { Home } from "./views";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <Stack>
      <Home />
    </Stack>
  );
}

export default App;
