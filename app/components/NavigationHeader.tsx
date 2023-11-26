import React from "react";
import { styled } from "@mui/material/styles";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconProps, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type PageInfo = {
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">>;
  title: string;
};

type NavigationHeaderProps = {
  routePath: PageInfo[];
};

const NavigationHeader = ({ routePath }: NavigationHeaderProps) => {
  return (
    <HeaderContainer>
      {routePath.map((pageInfo, index) => (
        <React.Fragment key={index}>
          <StyledPageIcon
            icon={pageInfo.icon}
            isLast={index === routePath.length - 1}
          />
          <StyledTitle isLast={index === routePath.length - 1}>
            {pageInfo.title}
          </StyledTitle>
          {(index === 0 || index !== routePath.length - 1) && <StyledChevron />}
        </React.Fragment>
      ))}
    </HeaderContainer>
  );
};

const HeaderContainer = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "0",
  height: "54px",
  paddingTop: "2px",
  backgroundColor: theme.palette.grey[100],
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: "32px",
  zIndex: 10,
}));

interface StyledPageIconProps extends IconProps {
  isLast: boolean;
  icon: any;
}

const StyledPageIcon = ({ icon, isLast, ...props }: StyledPageIconProps) => {
  const Icon = styled(icon)(({ theme }) => ({
    color: isLast ? theme.palette.primary.main : theme.palette.grey[600],
    marginRight: "8px",
  }));

  return <Icon {...props} />;
};

interface StyledTitleProps {
  isLast: boolean;
}

const StyledTitle = styled("span")<StyledTitleProps>(({ isLast, theme }) => ({
  fontWeight: isLast ? 600 : 400,
  color: isLast ? theme.palette.primary.main : theme.palette.grey[600],
}));

const StyledChevron = styled(ChevronRightIcon)(({ theme }) => ({
  height: "20px",
  marginLeft: "6px",
  color: theme.palette.grey[600],
}));

export default NavigationHeader;
