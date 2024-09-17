import React from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const location = useLocation();
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();

  const history = useHistory();
  const handleMyPageNav = () => {
    history.push("/member-page");
  };
  const handleProductsPageNav = () => {
    history.push("/products");
  };
  const handleProductPage = () => {
    history.push("/products");
  };

  // ** HANDLERS **/
  return (
    <div className="top-navbar">
      <Stack className="menu">
        <Box>
          <NavLink to="/">
            <img
              className="brand-logo"
              src="/icons/gatorade.svg"
              alt="brand-logo"
            />
          </NavLink>
        </Box>
        <Box className={"hover-line"}>
          <NavLink to="/" activeClassName={"underline"}>
            Home
          </NavLink>
        </Box>
        <Box className={"hover-line"}>
          <NavLink to="/products" activeClassName={"underline"}>
            Products
          </NavLink>
        </Box>
        {authMember ? (
          <Box className={"hover-line"}>
            <NavLink to="/orders" activeClassName={"underline"}>
              Orders
            </NavLink>
          </Box>
        ) : null}
        <Box className={"hover-line"}>
          <NavLink to="/help">Help</NavLink>
        </Box>
        <Box className={"hover-line"}>
          <NavLink to="/help">About Us</NavLink>
        </Box>
        <Stack className="links">
          <Box>
            <Basket
              cartItems={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
            />
          </Box>
          {!authMember ? (
            <Box className="left-side-menu">
              <Button
                variant="contained"
                className="login-button"
                onClick={() => {
                  setLoginOpen(true);
                }}
              >
                Login
              </Button>
            </Box>
          ) : (
            <img
              className="user-avatar"
              src={
                authMember?.memberImage
                  ? `${serverApi}/${authMember?.memberImage}`
                  : "/icons/default-user.svg"
              }
              aria-haspopup={"true"}
              onClick={handleLogoutClick}
              alt="user-avatar"
            />
          )}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleCloseLogout}
            onClick={handleCloseLogout}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {location.pathname !== "/member-page" && (
              <MenuItem onClick={handleMyPageNav}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                My Page
              </MenuItem>
            )}
            <MenuItem onClick={handleLogoutRequest}>
              <ListItemIcon>
                <Logout fontSize="small" style={{ color: "blue" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
      <div className="home-navbar" onClick={handleProductPage}>
        <Container className="navbar-container">
          <Stack className="header-frame">
            <Stack className="detail">
              <Box className="head-main-txt">
                Rep Your Squad,
                <Box>15% off site-wide*</Box>
                <Box>Code: NFL150FF</Box>
                <Box>
                  <Button
                    className="shop-now"
                    onClick={handleProductsPageNav}
                    variant="contained"
                  >
                    Shon Now
                  </Button>
                </Box>
              </Box>
              <Box className="sign-up">
                {!authMember ? (
                  <Button
                    variant={"contained"}
                    className="signup-btn"
                    onClick={(e) => {
                      setSignupOpen(true);
                      e.stopPropagation();
                    }}
                  >
                    Sign Up
                  </Button>
                ) : null}
              </Box>
            </Stack>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
