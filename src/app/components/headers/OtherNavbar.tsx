import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";
import { useHistory } from "react-router-dom";

interface OtherNavbarProps {
  cartItems: CartItem[];
  updateCartPrices: () => void;
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

export default function OtherNavbar(props: OtherNavbarProps) {
  const {
    cartItems,
    updateCartPrices,
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

  const history = useHistory();
  const location = useLocation();

  const { authMember } = useGlobals();
  const handleMyPageNav = () => {
    history.push("/member-page");
  };
  return (
    <div className="top-other-navbar">
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
          <NavLink to="/">Home</NavLink>
        </Box>
        <Box className={"hover-line"}>
          <NavLink to="/products" activeClassName={"underline"}>
            Products
          </NavLink>
        </Box>
        {authMember ? (
          <>
            <Box className={"hover-line"}>
              <NavLink to="/member-page" activeClassName={"underline"}>
                My Page
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/orders" activeClassName={"underline"}>
                Orders
              </NavLink>
            </Box>
          </>
        ) : null}
        <Box className={"hover-line"}>
          <NavLink to="/help" activeClassName="underline">
            Help
          </NavLink>
        </Box>
        <Stack className="links">
          <Box>
            <Basket
              cartItems={cartItems}
              updateCartPrices={updateCartPrices}
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
            {location.pathname === "/member-page" ? null : (
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
      <div className="other-navbar">
        <Container className="navbar-container">
          {location.pathname === "/products" ? (
            <Box className="head-main-txt">Gear up like the pros</Box>
          ) : (
            ""
          )}
        </Container>
      </div>
    </div>
  );
}
