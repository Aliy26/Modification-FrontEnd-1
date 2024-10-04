import React, { useEffect } from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { useLocation } from "react-router-dom";

const Footers = styled.div`
  width: 100%;
  height: 735px;
  display: flex;
  background: #c5c8c9;
  background-size: cover;
`;

export default function Footer() {
  const { authMember } = useGlobals();
  const { pathname } = useLocation();
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleHomePageNav = () => {
    history.push("/products");
    window.scrollTo(0, 0);
  };

  const locationHandler = () => {
    window.open(
      "https://www.google.com/maps/?entry=ttu&g_ep=EgoyMDI0MDkzMC4wIKXMDSoASAFQAw%3D%3D",
      "_blank"
    );
  };

  return (
    <Footers>
      <Container>
        <Stack flexDirection={"row"} sx={{ mt: "54px" }}>
          <Stack flexDirection={"column"} style={{ width: "340px" }}>
            <Box className="footer-icon">
              <img
                width={"100px"}
                src={"/icons/gatorade.svg"}
                alt="logo"
                onClick={handleHomePageNav}
                className="check"
              />
            </Box>
            <Box className={"foot-desc-txt"}>
              the drink intended for people who play a lot of sport. It replaces
              liquids in the body rapidly and adds carbohydrates. .
            </Box>
            <Box className="sns-context">
              <img src={"/icons/telegram.svg"} alt="telegram" />
              <img src={"/icons/facebook.svg"} alt="facebook" />
              <img src={"/icons/instagram.svg"} alt="instagram" />
              <img src={"/icons/twitter.svg"} alt="twitter" />
              <img src={"/icons/youtube.svg"} alt="youtube" />
            </Box>
          </Stack>
          <Stack sx={{ ml: "288px" }} flexDirection={"row"}>
            <Stack>
              <Box>
                <Box className={"foot-category-title"}>Pages</Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">Home</Link>
                  <Link to="/products">Products</Link>
                  {authMember && <Link to="/orders">Orders</Link>}
                  <Link to="/help">Help</Link>
                </Box>
              </Box>
            </Stack>
            <Stack sx={{ ml: "100px" }}>
              <Box>
                <Box className={"foot-category-title"}>Find us</Box>
                <Box
                  flexDirection={"column"}
                  sx={{ mt: "20px" }}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div
                      onClick={locationHandler}
                      style={{ cursor: "pointer" }}
                    >
                      Downtown, Seoul
                    </div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>+8210 5889 0660</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>umaraliy092@gmail.com</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>Visit 24 hours</div>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #C5C8C9", width: "100%", opacity: "0.2" }}
          sx={{ mt: "20px" }}
        ></Stack>
        <Stack className="footer-logo">GATORADE</Stack>
        <Stack className={"copyright-txt"}>
          © 2024 Umar Aliy, Inc All rights reserved.
        </Stack>
      </Container>
    </Footers>
  );
}
