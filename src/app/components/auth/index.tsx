import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Fab, Stack, TextField } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import {
  LoginInput,
  MemberInput,
  UpdateEmail,
  UpdatePassword,
} from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import {
  showSaveConfirmation,
  sweetErrorHandling,
  sweetTopSuccessAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
}));

const ModalImg = styled.img`
  width: 62%;
  height: 100%;
  border-radius: 10px;
  background: #000;
  margin-top: 9px;
  margin-left: 10px;
`;

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  deleteOpen: boolean;
  changePasswordOpen: boolean;
  changeEmailOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  handleDeleteClose: () => void;
  handleChangePasswordClose: () => void;
  handleChangeEmailClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const {
    signupOpen,
    loginOpen,
    deleteOpen,
    changePasswordOpen,
    changeEmailOpen,
    handleSignupClose,
    handleLoginClose,
    handleDeleteClose,
    handleChangeEmailClose,
    handleChangePasswordClose,
  } = props;
  const classes = useStyles();
  const member = new MemberService();
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const { setAuthMember } = useGlobals();

  /** HANDLERS **/

  const handleUsername = (e: T) => {
    setMemberNick(e.target.value);
  };

  const handleEmail = (e: T) => {
    setMemberEmail(e.target.value);
  };

  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };

  const handleNewPassword = (e: T) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    } else if (e.key === "Enter" && deleteOpen) {
      handleDeleteRequest().then();
    } else if (e.key === "Enter" && changePasswordOpen) {
      handlePasswordChangeRequest().then();
    } else if (e.key === "Enter" && changeEmailOpen) {
      handleEmailChangeRequest();
    }
  };

  const handleSignupRequest = async () => {
    try {
      const isFulfill =
        memberNick !== "" &&
        memberEmail !== "" &&
        memberPhone !== "" &&
        memberPassword !== "";

      if (!isFulfill) {
        setMemberNick("");
        setMemberPhone("");
        setMemberPassword("");
        setMemberEmail("");
        throw new Error(Messages.error3);
      }
      if (!memberEmail.includes("@")) throw new Error(Messages.error6);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberEmail: memberEmail,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const result = await member.signup(signupInput);
      // Saving Authenticated user

      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFulfill = memberNick !== "" && memberPassword !== "";
      if (!isFulfill) {
        setMemberNick("");
        setMemberPassword("");
        throw new Error(Messages.error3);
      }

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const result = await member.login(loginInput);
      // Saving Authenticated user
      setAuthMember(result);

      handleLoginClose();
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleEmailChangeRequest = async () => {
    try {
      const isFullfil = memberNick !== "" && memberEmail !== "";
      if (!isFullfil) {
        setMemberNick("");
        setMemberEmail("");
        throw new Error(Messages.error3);
      }
      if (!memberEmail.includes("@")) throw new Error(Messages.error6);

      const newEmailInput: UpdateEmail = {
        memberNick: memberNick,
        memberEmail: memberEmail,
      };
      handleChangeEmailClose();
      const confirm = await showSaveConfirmation(
        "Do you want to change you email?"
      );
      if (confirm.isConfirmed) {
        const result = await member.updateEmail(newEmailInput);
        setAuthMember(result);
        handleChangeEmailClose();
        await sweetTopSuccessAlert("The email has been changed!", 3000);
      } else {
        handleChangeEmailClose();
        return false;
      }
    } catch (err) {
      console.log(err);
      handleChangeEmailClose();
      sweetErrorHandling(err).then();
    }
  };

  const handlePasswordChangeRequest = async () => {
    try {
      const isFullfil =
        memberNick !== "" && memberPassword !== "" && newPassword !== "";
      if (!isFullfil) {
        setMemberNick("");
        setMemberPassword("");
        setNewPassword("");
        throw new Error(Messages.error3);
      }

      const newPasswordInput: UpdatePassword = {
        memberNick: memberNick,
        memberPassword: memberPassword,
        newPassword: newPassword,
      };
      handleChangePasswordClose();
      const confirm = await showSaveConfirmation(
        "Do you want to change your password?"
      );
      if (confirm.isConfirmed) {
        const result = await member.updatePassowrd(newPasswordInput);
        handleChangePasswordClose();
        setAuthMember(result);
        await sweetTopSuccessAlert("The password has been changed!", 1500);
      } else {
        handleChangePasswordClose();
        return false;
      }
    } catch (err) {
      console.log(err);
      handleChangePasswordClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const isFulfill = memberNick !== "" && memberPassword !== "";
      if (!isFulfill) {
        setMemberNick("");
        setMemberPassword("");
        throw new Error(Messages.error3);
      }

      const deleteInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      handleDeleteClose();
      const confirm = await showSaveConfirmation(
        `Dear ${memberNick} do you really want to delete your account? 😩`
      );
      if (confirm.isDenied) {
        return false;
      } else if (confirm.isDismissed) {
        return false;
      } else {
        await member.deleteAccount(deleteInput);
        await sweetTopSuccessAlert("The account has been deleted!", 3000);
        handleDeleteClose();
        setAuthMember(null);
      }
    } catch (err) {
      console.log(err);
      handleDeleteClose();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={signupOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "800px" }}
          >
            <ModalImg src={"/img/auth.webp"} alt="camera" />
            <Stack sx={{ marginLeft: "69px", alignItems: "center" }}>
              <h2>Signup Form</h2>
              <TextField
                sx={{ my: "8px" }}
                id="outlined-basic"
                label="username"
                variant="outlined"
                onChange={handleUsername}
              />
              <TextField
                sx={{ my: "8px" }}
                id="outlined-basic"
                label="email"
                variant="outlined"
                onChange={handleEmail}
              />
              <TextField
                sx={{ my: "8px" }}
                id="outlined-basic"
                label="phone number"
                variant="outlined"
                onChange={handlePhone}
              />
              <TextField
                sx={{ my: "8px" }}
                id="outlined-basic"
                label="password"
                variant="outlined"
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "30px", width: "120px" }}
                variant="extended"
                color="primary"
                onClick={handleSignupRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Signup
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={loginOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "700px" }}
          >
            <ModalImg src={"/img/auth.webp"} alt="camera" />
            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2>Login Form</h2>
              <TextField
                id="outlined-basic"
                label="username"
                variant="outlined"
                sx={{ my: "10px" }}
                onChange={handleUsername}
              />
              <TextField
                id={"outlined-basic"}
                label={"password"}
                variant={"outlined"}
                type={"password"}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant={"extended"}
                color={"primary"}
                onClick={handleLoginRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={changePasswordOpen}
        onClose={handleChangePasswordClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={changePasswordOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "700px" }}
          >
            <ModalImg src={"/img/change-password.webp"} alt="camera" />
            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2>Change Password</h2>
              <TextField
                id="outlined-basic"
                label="username"
                variant="outlined"
                sx={{ my: "10px" }}
                onChange={handleUsername}
              />
              <TextField
                id={"outlined-basic"}
                label={"password"}
                variant={"outlined"}
                type={"password"}
                onChange={handlePassword}
              />
              <TextField
                sx={{ mt: "10px" }}
                id={"outlined-basic"}
                label={"new password"}
                variant={"outlined"}
                type={"password"}
                onChange={handleNewPassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant={"extended"}
                color={"primary"}
                onClick={handlePasswordChangeRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Change
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={changeEmailOpen}
        onClose={handleChangeEmailClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={changeEmailOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "700px" }}
          >
            <ModalImg src={"/img/change-email.webp"} alt="camera" />
            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2>Change Email</h2>
              <TextField
                id="outlined-basic"
                label="username"
                variant="outlined"
                sx={{ my: "10px" }}
                onChange={handleUsername}
              />
              <TextField
                id={"outlined-basic"}
                label={"email"}
                variant={"outlined"}
                type={"email"}
                onChange={handleEmail}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant={"extended"}
                color={"primary"}
                onClick={handleEmailChangeRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Change
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={deleteOpen}
        onClose={handleDeleteClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={deleteOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "700px" }}
          >
            <ModalImg src={"/img/delete-account.webp"} alt="camera" />
            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2>Delete Account</h2>
              <TextField
                id="outlined-basic"
                label="username"
                variant="outlined"
                sx={{ my: "10px" }}
                onChange={handleUsername}
              />
              <TextField
                id={"outlined-basic"}
                label={"password"}
                variant={"outlined"}
                type={"password"}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant={"extended"}
                color={"primary"}
                onClick={handleDeleteRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Confirm
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </div>
  );
}
