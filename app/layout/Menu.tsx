import React, { ReactElement } from "react";
import { useMatch } from "react-router-dom";
import clsx from "clsx";

import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import { styled as muiStyled } from "@mui/material/styles";
import basicStyled from "@emotion/styled";

import LogoutIcon from "@mui/icons-material/LogoutRounded";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CampaignIcon from "@mui/icons-material/Campaign";

import { useSidebarState } from "./Sidebar";
import { ListItemIcon, Tooltip } from "@mui/material";
import { Link } from "react-admin";
import { useRouter } from "next/navigation";
import { AccountBox, Apartment, Feedback, Lock } from "@mui/icons-material";

interface CustomMenuItemProps extends MenuItemProps {
  route: string;
  open?: boolean;
  icon: ReactElement;
}

const CustomMenuItem = (props: CustomMenuItemProps) => {
  const { title, className, route, icon, ...rest } = props;

  const [open] = useSidebarState();
  const match = useMatch(route);

  return (
    <Link to={`/${route}`}>
      <Tooltip
        disableHoverListener={open}
        disableFocusListener={open}
        title={title}
        placement="right"
      >
        <StyledMenuItem
          open={open}
          className={clsx(className, {
            [MenuItemClasses.active]: !!match,
          })}
          {...rest}
        >
          <ListItemIcon className={MenuItemClasses.icon}>{icon}</ListItemIcon>
          <span className={MenuItemClasses.title}>{title}</span>
        </StyledMenuItem>
      </Tooltip>
    </Link>
  );
};

const PREFIX = "RaMenuItem";

export const MenuItemClasses = {
  active: `${PREFIX}-active`,
  icon: `${PREFIX}-icon`,
  title: `${PREFIX}-title`,
};

const StyledMenuItem = muiStyled(MenuItem)(({ open, theme }: any) => ({
  color: theme.palette.grey[900],
  //borderBottom: `1px solid ${theme.palette.grey[300]}`,

  paddingLeft: "19px",
  paddingRight: "8px",
  height: "56px",

  [`& .${MenuItemClasses.icon}`]: { color: theme.palette.grey[900] },

  [`&.${MenuItemClasses.active}`]: {
    //color: theme.palette.primary.main,
    backgroundColor: "#8fa9b5",
    borderBottom: "1px solid rgba(0,0,0,0)",
    // boxShadow:
    //   "0px -1px 0px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",

    //[`& .${MenuItemClasses.icon}`]: { color: theme.palette.primary.main },
  },

  [`& .${MenuItemClasses.title}`]: {
    fontWeight: 500,
    opacity: open ? 1 : 0,
    transition: theme.transitions.create("opacity", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

const CustomMenu = () => {
  const router = useRouter();

  const role = localStorage.getItem("role");

  return (
    <MenuContainer>
      {role === "Admin" && (
        <>
          <CustomMenuItem
            route="moradores"
            title="Moradores"
            icon={<PersonIcon />}
          />
          <CustomMenuItem
            route="usuarios"
            title="Usuários"
            icon={<AccountBox />}
          />
          <CustomMenuItem
            route="apartamentos"
            title="Apartamentos"
            icon={<Apartment />}
          />
        </>
      )}

      <CustomMenuItem
        route="entregas"
        title="Entregas"
        icon={<LocalShippingIcon />}
      />
      <CustomMenuItem route="acesso" title="Acesso" icon={<Lock />} />
      {role === "Admin" && (
        <>
          <CustomMenuItem
            route="reservas"
            title="Reservas"
            icon={<CalendarMonthIcon />}
          />
          <CustomMenuItem
            route="areas"
            title="Áreas Comuns"
            icon={<CelebrationIcon />}
          />

          <CustomMenuItem
            route="avisos"
            title="Avisos"
            icon={<CampaignIcon />}
          />
          <CustomMenuItem
            route="feedbacks"
            title="Feedbacks"
            icon={<Feedback />}
          />
        </>
      )}

      <EmptySpace />
      <CustomMenuItem
        route="logout"
        title="Logout / Sair"
        icon={<LogoutIcon />}
        onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          router.replace("/login");
        }}
      />
    </MenuContainer>
  );
};

const MenuContainer = basicStyled("div")({
  marginTop: "16px",
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

const EmptySpace = basicStyled("div")({
  flex: 1,
});

export default CustomMenu;
