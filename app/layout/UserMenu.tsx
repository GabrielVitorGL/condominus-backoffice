import * as React from "react";
import { ReactNode, useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useTranslate } from "ra-core";
import { Tooltip, IconButton, Menu, PopoverOrigin } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Logout } from "react-admin";
import { useRouter } from "next/navigation";

export const UserMenu = (props: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const translate = useTranslate();

  const {
    children = (
      <Logout
        onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("username");
          router.replace("/login");
        }}
      />
    ),
    className,
    label = "ra.auth.user_menu",
    icon = defaultIcon,
  } = props;

  const handleMenu = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = useCallback(() => setAnchorEl(null), []);

  if (!children) return null;
  const open = Boolean(anchorEl);

  return (
    <Root className={className}>
      <Tooltip title={label && translate(label, { _: label })}>
        <IconButton
          color="inherit"
          className="text-neutral-800"
          onClick={handleMenu}
          sx={{ "&:hover": { backgroundColor: "transparent" } }}
        >
          {icon}
          <span className="ml-3 text-base tracking-wide	text-neutral-800">
            {localStorage.getItem("username")}
          </span>
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        disableScrollLock
        anchorEl={anchorEl}
        anchorOrigin={AnchorOrigin}
        transformOrigin={TransformOrigin}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </Root>
  );
};

UserMenu.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  label: PropTypes.string,
  icon: PropTypes.node,
};

export interface UserMenuProps {
  children?: ReactNode;
  className?: string;
  label?: string;
  icon?: ReactNode;
}

const PREFIX = "RaUserMenu";

export const UserMenuClasses = {
  userButton: `${PREFIX}-userButton`,
  avatar: `${PREFIX}-avatar`,
};

const Root = styled("div", {
  name: PREFIX,
  overridesResolver: (styles) => styles.root,
})(({ theme }) => ({
  [`& .${UserMenuClasses.userButton}`]: {
    textTransform: "none",
    fontWeight: "normal",
  },

  [`& .${UserMenuClasses.avatar}`]: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },

  borderRadius: "4px",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
}));

const defaultIcon = (
  <div className="bg-indigo-700 w-8 h-8 rounded-full flex items-center justify-center">
    <span className="text-white text-xl">
      {localStorage.getItem("username")?.charAt(0)}
    </span>
  </div>
);

const AnchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

const TransformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "right",
};
