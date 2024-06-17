import React from "react";
import { Box } from "@mui/material";

export const Puller = () => {
  return (
    <Box
      sx={{
        width: 40,
        height: 5,
        backgroundColor: "grey.600",
        borderRadius: 3,
        position: "absolute",
        top: 8,
        left: "calc(50% - 20px)",
      }}
    />
  );
};
