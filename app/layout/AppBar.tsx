import React, { FC, memo } from "react";
import muiStyled from "@emotion/styled";

import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { SidebarToggleButton } from "./SidebarToggleButton";
import { UserMenu } from "./UserMenu";

type AppBarProps = Omit<MuiAppBarProps, "title">;

const CustomAppBar: FC<AppBarProps> = memo((props: AppBarProps) => {
  const { color = "secondary", ...rest } = props;

  return (
    <StyledAppBar className="app-bar" color={color} elevation={0} {...rest}>
      <Toolbar disableGutters className="toolbar">
        <SidebarToggleButton className="menu-button" />
        <div style={{ flex: 1, margin: "0 8px" }}>
          <span className="font-bold text-neutral-800 text-lg font-serif">
            CONDOMINUS - ADMINISTRAÇÃO
          </span>
        </div>
        <div className="mr-2">
          <UserMenu />
        </div>
      </Toolbar>
    </StyledAppBar>
  );
});

const StyledAppBar = muiStyled(MuiAppBar)({
  "& .toolbar": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "0 8px",
    minHeight: "56px",
    background: `#3C9FAC`,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  "& .menu-button": {
    color: "#212121",
    marginLeft: "2px",
    marginRight: "0.2em",
    fontSize: "1.5em",
  },
});

CustomAppBar.displayName = "CustomAppBar";
export default CustomAppBar;
