import * as React from "react";
import { useSidebarState, useTranslate } from "react-admin";

import { IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/MenuOpenRounded";

export const SidebarToggleButton = (props: SidebarToggleButtonProps) => {
  const translate = useTranslate();
  const { className } = props;
  const [open, setOpen] = useSidebarState();

  return (
    <Tooltip
      className={className}
      title={translate(open ? "ra.action.close_menu" : "ra.action.open_menu")}
      enterDelay={500}
    >
      <StyledIconButton color="primary" onClick={() => setOpen(!open)}>
        <MenuIcon
          classes={{
            root: open
              ? SidebarToggleButtonClasses.menuButtonIconOpen
              : SidebarToggleButtonClasses.menuButtonIconClosed,
          }}
        />
      </StyledIconButton>
    </Tooltip>
  );
};

export type SidebarToggleButtonProps = {
  className?: string;
};

const PREFIX = "RaSidebarToggleButton";

export const SidebarToggleButtonClasses = {
  menuButtonIconClosed: `${PREFIX}-menuButtonIconClosed`,
  menuButtonIconOpen: `${PREFIX}-menuButtonIconOpen`,
};

const StyledIconButton = styled(IconButton, {
  name: PREFIX,
  overridesResolver: ( styles) => styles.root,
})(({ theme }) => ({
  [`& .${SidebarToggleButtonClasses.menuButtonIconClosed}`]: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    transform: "rotate(180deg)",
  },

  [`& .${SidebarToggleButtonClasses.menuButtonIconOpen}`]: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    transform: "rotate(0deg)",
  },
}));
