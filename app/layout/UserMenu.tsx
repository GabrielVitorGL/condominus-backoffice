import * as React from "react";
import { ReactNode, useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useTranslate } from "ra-core";
import { Tooltip, IconButton, Menu, PopoverOrigin } from "@mui/material";
import { Logout } from "react-admin";
import { useRouter } from "next/navigation";
import { AccountCircle } from "@mui/icons-material";

export const UserMenu = (props: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const translate = useTranslate();

  const {
    children = (
      <Logout
        onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          router.replace("/login");
        }}
      />
    ),
    className,
    label = "ra.auth.user_menu",
    icon = defaultIcon2,
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
          onClick={handleMenu}
          sx={{ "&:hover": { backgroundColor: "transparent" } }}
        >
          {icon}
          <span className="ml-3 text-base tracking-wider">
            {localStorage.getItem("username")}
          </span>
        </IconButton>
      </Tooltip>
      <StyledMenu
        id="menu-appbar"
        disableScrollLock
        anchorEl={anchorEl}
        anchorOrigin={AnchorOrigin}
        transformOrigin={TransformOrigin}
        open={open}
        onClose={handleClose}
      >
        {children}
      </StyledMenu>
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

const defaultIcon2 = <AccountCircle className="!text-[28px]" />;

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    marginRight: "10px",
  },
  "& .MuiList-root": {
    padding: "0px",
  },
  "& .MuiButtonBase-root": {
    padding: "13px 20px 13px 19px",
  },
});

const AnchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

const TransformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "right",
};
