import React, {
  ComponentType,
  JSXElementConstructor,
  ReactElement,
} from "react";
import { useStore } from "ra-core";

import Image from "next/image";
import logo from "../assets/logo.png";
import icon from "../assets/icon.png";

import { styled } from "@mui/material/styles";
import { Drawer, DrawerProps } from "@mui/material";

export const DRAWER_WIDTH = 218;
export const CLOSED_DRAWER_WIDTH = 64;

export const useSidebarState = (): UseSidebarStateResult =>
  useStore<boolean>("sidebar.open", true);

export type UseSidebarStateResult = [boolean, (open: boolean) => void];

const CustomSidebar: ComponentType<SidebarProps> = (props: SidebarProps) => {
  const { children, ...rest } = props;
  const [open, setOpen] = useSidebarState();

  const toggleSidebar = () => setOpen(!open);

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      onClose={toggleSidebar}
      classes={SidebarClasses}
      {...rest}
    >
      <Image
        src={open ? logo : icon}
        alt="Condominus Logo"
        className={SidebarClasses.logo}
      />
      <div className={SidebarClasses.fixed}>{children}</div>
    </StyledDrawer>
  );
};

export interface SidebarProps extends DrawerProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  closedSize?: number;

  size?: number;
}

const PREFIX = "RaSidebar";

export const SidebarClasses = {
  docked: `${PREFIX}-docked`,
  paper: `${PREFIX}-paper`,
  paperAnchorLeft: `${PREFIX}-paperAnchorLeft`,
  paperAnchorRight: `${PREFIX}-paperAnchorRight`,
  paperAnchorTop: `${PREFIX}-paperAnchorTop`,
  paperAnchorBottom: `${PREFIX}-paperAnchorBottom`,
  paperAnchorDockedLeft: `${PREFIX}-paperAnchorDockedLeft`,
  paperAnchorDockedTop: `${PREFIX}-paperAnchorDockedTop`,
  paperAnchorDockedRight: `${PREFIX}-paperAnchorDockedRight`,
  paperAnchorDockedBottom: `${PREFIX}-paperAnchorDockedBottom`,
  modal: `${PREFIX}-modal`,
  fixed: `${PREFIX}-fixed`,
  appBarCollapsed: `${PREFIX}-appBarCollapsed`,
  appBarExpanded: `${PREFIX}-appBarExpanded`,
  logo: `${PREFIX}-logo`,
};

const StyledDrawer = styled(Drawer, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (props, styles) => styles.root,
  shouldForwardProp: () => true,
})(({ open, theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: 0,
  overflow: "visible",
  maxHeight: "calc(100vh - 56px)",

  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.standard,
  }),

  [`& .${SidebarClasses.docked}`]: {},
  [`& .${SidebarClasses.paper}`]: {},
  [`& .${SidebarClasses.paperAnchorLeft}`]: {},
  [`& .${SidebarClasses.paperAnchorRight}`]: {},
  [`& .${SidebarClasses.paperAnchorTop}`]: {},
  [`& .${SidebarClasses.paperAnchorBottom}`]: {},
  [`& .${SidebarClasses.paperAnchorDockedLeft}`]: {},
  [`& .${SidebarClasses.paperAnchorDockedTop}`]: {},
  [`& .${SidebarClasses.paperAnchorDockedRight}`]: {},
  [`& .${SidebarClasses.paperAnchorDockedBottom}`]: {},
  [`& .${SidebarClasses.modal}`]: {},

  [`& .${SidebarClasses.fixed}`]: {
    overflowX: "hidden",
    // hide scrollbar
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  [`& .${SidebarClasses.logo}`]: {
    margin: "32px 0 8px 0",
    alignSelf: "center",
    objectFit: "contain",
    width: open ? "160px" : "40px",
    height: "60px",

    transition: open
      ? theme.transitions.create(["width", "height"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        })
      : "",
  },

  [`& .MuiPaper-root`]: {
    position: "relative",
    display: "flex",
    width: open ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    backgroundColor: '#aec6cb',
    borderRight: "none",
    zIndex: "inherit",
  },
}));

export default CustomSidebar;
