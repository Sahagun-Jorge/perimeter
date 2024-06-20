import React, { ReactNode } from "react";
import {
  SwipeableDrawer as MuiSwipeableDrawer,
  SwipeableDrawerProps as MuiSwipeableDrawerProps,
  Box,
  drawerClasses,
} from "@mui/material";
import { Puller } from "@/components";

export interface SwipeableDrawerProps extends MuiSwipeableDrawerProps {
  children?: ReactNode;
  controls?: ReactNode;
  drawerBleeding?: number;
}

export const SwipeableDrawer = ({
  children,
  controls,
  open,
  onClose,
  onOpen,
  drawerBleeding = 30,
  sx,
  ...rest
}: SwipeableDrawerProps) => {
  return (
    <MuiSwipeableDrawer
      anchor="bottom"
      swipeAreaWidth={drawerBleeding}
      open={open}
      onClose={() => {}}
      onOpen={onOpen}
      ModalProps={{
        keepMounted: true,
        disableEscapeKeyDown: true,
      }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: "visible",
        },
        position: "static",
        ...sx,
      }}
      {...rest}
    >
      <Box
        sx={{
          backgroundColor: "grey.100",
          position: "absolute",
          top: -drawerBleeding,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          visibility: "visible",
          right: 0,
          left: 0,
          height: drawerBleeding,
        }}
      >
        <Puller />
      </Box>
      <Box
        sx={{
          backgroundColor: "grey.100",
          px: 2,
          pb: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </MuiSwipeableDrawer>
  );
};
