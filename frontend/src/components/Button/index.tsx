import React from "react";
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FONT } from "../../utils/constants";

const StyledButton = styled(MUIButton)(() => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  font: FONT,
}));

const Button: React.FC<MUIButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButton variant="contained" color="primary" {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
