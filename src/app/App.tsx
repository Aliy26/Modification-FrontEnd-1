import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UserPage from "./screens/userPage";
import HelpPage from "./screens/helpPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { T } from "../lib/types/common";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import { useGlobals } from "./hooks/useGlobals";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";

function App() {
  const location = useLocation();
  console.log(location.pathname);
  const { setAuthMember } = useGlobals();
  const {
    cartItems,
    updateCartPrices,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
  } = useBasket();

  const [signupOpen, setSighupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState<boolean>(false);
  const [changeEmailOpen, setChangeEmailOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  //** HANDLERS **/

  const handleSignupClose = () => setSighupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);
  const handleDeleteClose = () => setDeleteOpen(false);
  const handleChangePasswordClose = () => setChangePasswordOpen(false);
  const handleChangeEmailClose = () => setChangeEmailOpen(false);

  const handleLogoutClick = (e: T) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseLogout = () => setAnchorEl(null);

  const handleLogoutRequest = async () => {
    try {
      await sweetTopSuccessAlert("Logged out!", 700);
      setAuthMember(null);
      const member = new MemberService();
      await member.logout();
    } catch (err) {
      console.log(err);
      sweetErrorHandling(Messages.error1);
    }
  };

  return (
    <>
      {location.pathname === "/" ? (
        <HomeNavbar
          cartItems={cartItems}
          updateCartPrices={updateCartPrices}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
          setSignupOpen={setSighupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      ) : (
        <OtherNavbar
          cartItems={cartItems}
          onAdd={onAdd}
          updateCartPrices={updateCartPrices}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
          setSignupOpen={setSighupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      )}
      <Switch>
        <Route path="/products">
          <ProductsPage onAdd={onAdd} />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/member-page">
          <UserPage
            setDeleteOpen={setDeleteOpen}
            setChangeEmailOpen={setChangeEmailOpen}
            setChangePasswordOpen={setChangePasswordOpen}
          />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <Footer />

      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        deleteOpen={deleteOpen}
        changePasswordOpen={changePasswordOpen}
        changeEmailOpen={changeEmailOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
        handleDeleteClose={handleDeleteClose}
        handleChangePasswordClose={handleChangePasswordClose}
        handleChangeEmailClose={handleChangeEmailClose}
      />
    </>
  );
}

export default App;
