import {
  FONT,
  GITHUB_URL_CREATOR,
  LINKEDIN_URL_CREATOR,
  LOGO_URL,
} from "../utils/constants";
import { Stack, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Homepage = () => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/overview");
  };

  return (
    <Stack sx={{ minHeight: "100vh", px: 2 }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box alignItems="center" display="flex" justifyContent="center">
          <img
            src={LOGO_URL}
            width={280}
            height={200}
            alt="TalentMatchAI Logo"
          />
        </Box>
        <Button
          onClick={handleOnClick}
          style={{
            fontFamily: FONT,
            fontWeight: "bold",
          }}
        >
          View Table
        </Button>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        mb={2}
      >
        <IconButton
          sx={{ color: "black" }}
          onClick={() => window.open(GITHUB_URL_CREATOR, "_blank")}
        >
          {/* @ts-ignore */}
          <FaGithub size={30} />
        </IconButton>
        <IconButton
          sx={{ color: "black" }}
          onClick={() => window.open(LINKEDIN_URL_CREATOR, "_blank")}
        >
          {/* @ts-ignore */}
          <FaLinkedin size={30} />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default Homepage;
