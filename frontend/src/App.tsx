import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { createGlobalStyle } from "styled-components";
import { Toaster } from "react-hot-toast";
import { FONT } from "./utils/constants";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%; 
    width: 100%; 
    overflow: hidden;
    background: linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(58, 134, 82, 1) 100%);
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <AppRoutes />
      <Toaster
        toastOptions={{
          style: {
            fontWeight: "bold",
            fontFamily: FONT,
          },
        }}
        position="bottom-center"
        reverseOrder={false}
      />
    </>
  );
};

export default App;
