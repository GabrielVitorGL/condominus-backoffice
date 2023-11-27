import React, { useEffect } from "react";
import {
  CheckCircleOutlined,
  ErrorOutline,
  WarningAmberOutlined,
  CloseRounded,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

export type AlertType = "success" | "warning" | "error";

interface AlertProps {
  type: AlertType;
  text: string;
  onClose: () => void;
  timeout?: number;
}

export default function Alert(props: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onClose();
    }, props.timeout ?? 7000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.timeout]);

  let backgroundColor;
  let icon;
  switch (props.type) {
    case "success":
      backgroundColor = "rgb(21 128 61)";
      icon = <CheckCircleOutlined />;
      break;
    case "error":
      backgroundColor = "rgb(220 38 38)";
      icon = <ErrorOutline />;
      break;
    default:
      backgroundColor = "rgb(234 179 8)";
      icon = <WarningAmberOutlined />;
      break;
  }

  return (
    <StyledAlert backgroundColor={backgroundColor} role="alert">
      <div>
        {icon}
        <TextContainer>{props.text}</TextContainer>
        <ButtonContainer>
          <StyledButton onClick={props.onClose}>
            <CloseRounded />
          </StyledButton>
        </ButtonContainer>
      </div>
    </StyledAlert>
  );
}

const StyledAlert = styled("div")(
  ({ backgroundColor }: { backgroundColor: string }) => ({
    borderRadius: "4px",
    padding: "10px",
    verticalAlign: "middle",
    fontSize: "18px",
    fontWeight: "500",
    color: "white",
    backgroundColor,
    "& > div": {
      padding: "8px",
      display: "flex",
    },
  })
);

const StyledButton = styled("button")({
  verticalAlign: "middle",
  background: "none",
  color: "inherit",
  border: "none",
  cursor: "pointer",
});

const ButtonContainer = styled("div")({ marginLeft: "auto" });

const TextContainer = styled("div")({ margin: "0px 16px" });
