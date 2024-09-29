import {
  Box,
  Button,
  ClickAwayListener,
  Container,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import "../../../css/userPage.css";
import { useEffect, useRef, useState } from "react";

interface UserPageProps {
  setDeleteOpen: (isOpen: boolean) => void;
  setChangeEmailOpen: (isOpen: boolean) => void;
  setChangePasswordOpen: (isOpen: boolean) => void;
}

export default function UserPage(props: UserPageProps) {
  const { setDeleteOpen, setChangeEmailOpen, setChangePasswordOpen } = props;

  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const history = useHistory();
  const { authMember } = useGlobals();

  if (!authMember) history.push("/");
  return (
    <div className={"user-page"}>
      <Container>
        <Stack className={"my-page-frame"}>
          <Stack className={"my-page-left"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className={"my-page"}>My Page</Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <div className="setting-icon">
                  <Stack direction="row" spacing={2}>
                    <div>
                      <Button
                        ref={anchorRef}
                        id="composition-button"
                        aria-controls={open ? "composition-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        className="set-icon"
                      >
                        <img
                          src="icons/setting.svg"
                          alt="settings icon"
                          className="setting"
                        />
                      </Button>
                      <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-start"
                        transition
                        disablePortal
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === "bottom-start"
                                  ? "left top"
                                  : "left bottom",
                            }}
                          >
                            <Paper className="paper">
                              <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                  autoFocusItem={open}
                                  id="composition-menu"
                                  aria-labelledby="composition-button"
                                  onKeyDown={handleListKeyDown}
                                  className="menu-list"
                                >
                                  <MenuItem
                                    onClick={() => setChangePasswordOpen(true)}
                                    className="password"
                                  >
                                    Change Password
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => setChangeEmailOpen(true)}
                                    className="email"
                                  >
                                    Change Email
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => setDeleteOpen(true)}
                                    className="deleteAccount"
                                  >
                                    Delete Account
                                  </MenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </div>
                  </Stack>
                </div>

                <div className={"order-user-img"}>
                  <img
                    src={
                      authMember?.memberImage
                        ? `${serverApi}/${authMember.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    className={"order-user-avatar"}
                    alt="order-user-avatar"
                  />
                  <div className={"order-user-icon-box"}>
                    <img
                      src={
                        authMember?.memberType === MemberType.RESTAURANT
                          ? "icons/restaurant.svg"
                          : "/icons/user-badge.svg"
                      }
                      alt="logo"
                    />
                  </div>
                </div>
                <span className={"order-user-name"}>
                  {authMember?.memberNick}
                </span>
                <span className={"order-user-prof"}>
                  {authMember?.memberType}
                </span>
                <span className={"order-user-prof"}>
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "No address"}
                </span>
              </Box>
              <Box className={"user-media-box"}>
                <img src="icons/telegram.svg" alt="telegram" className="tg" />
                <img src="icons/facebook.svg" alt="facebook" />
                <img src="icons/instagram.svg" alt="instagram" />
                <YouTubeIcon className="youTube" />
              </Box>
              <p className={"user-desc"}>
                {authMember?.memberDesc
                  ? authMember.memberDesc
                  : "No description"}
              </p>
              <p
                className={"user-email"}
                onClick={() => {
                  setChangeEmailOpen(true);
                }}
              >
                {authMember?.memberEmail ? authMember.memberEmail : "No Email"}
              </p>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
