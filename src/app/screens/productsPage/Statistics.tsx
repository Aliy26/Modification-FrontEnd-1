import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

export default function Statistics() {
  return (
    <div className="static-frame">
      <Container>
        <Stack className="info">
          <Stack className="static-box">
            <Box className="static-num">17</Box>
            <Box className="static-txt">Shops throughout Korea</Box>
          </Stack>

          <Stack className="static-box">
            <Box className="static-num">10 </Box>
            <Box className="static-txt">years in Korea</Box>
          </Stack>

          <Stack className="static-box">
            <Box className="static-num">15+</Box>
            <Box className="static-txt">Product types</Box>
          </Stack>

          <Stack className="static-box">
            <Box className="static-num">10+</Box>
            <Box className="static-txt">Energy boosters</Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
