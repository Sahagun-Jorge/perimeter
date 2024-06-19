import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { When } from "react-if";

interface LoadingProps {
  isLoading: boolean;
}

export const Loading = ({ isLoading }: LoadingProps) => {
  return (
    <When condition={isLoading}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
        }}
      >
        <CircularProgress />
      </Box>
    </When>
  );
};
