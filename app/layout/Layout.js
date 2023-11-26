import { styled } from "@mui/material";
import { Layout } from "react-admin";
import CustomMenu from "./Menu";
import CustomSidebar from "./Sidebar";
import CustomAppBar from "./AppBar";

const MainLayout = ({ children }) => {
  return (
    <CustomLayout
      sidebar={CustomSidebar}
      appBar={CustomAppBar}
      menu={CustomMenu}
      sx={{ padding: "0" }}
    >
      {children}
    </CustomLayout>
  );
};

const CustomLayout = styled(Layout)({
  "& .RaLayout-appFrame": {
    marginTop: "56px",
  },

  "& .RaLayout-content": {
    padding: "0px",
    maxHeight: "calc(100vh - 56px)",
    overflowY: "auto",
  },
});

export default MainLayout;
