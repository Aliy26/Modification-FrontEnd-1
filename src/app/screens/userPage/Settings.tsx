import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { Member, MemberUpdateInput } from "../../../lib/types/member";
import { useEffect, useState } from "react";
import { T } from "../../../lib/types/common";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
  showSaveConfirmation,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberAddress: authMember?.memberAddress,
      memberDesc: authMember?.memberDesc,
      memberImage: authMember?.memberImage,
    }
  );

  // Helper to check if there are any changes
  const isDataChanged = () => {
    return (
      memberUpdateInput.memberNick !== authMember?.memberNick ||
      memberUpdateInput.memberPhone !== authMember?.memberPhone ||
      memberUpdateInput.memberAddress !== authMember?.memberAddress ||
      memberUpdateInput.memberDesc !== authMember?.memberDesc ||
      memberUpdateInput.memberImage !== authMember?.memberImage
    );
  };

  //** HANDLERS **/
  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAddressHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDescHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async (e: T) => {
    try {
      if (!isDataChanged()) {
        Swal.fire("No changes detected", "", "info");
        return;
      }

      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }

      const member = new MemberService();

      const swalResult = await showSaveConfirmation(
        "Do you want to save the changes?",
        true
      );

      if (swalResult.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
        setMemberUpdateInput({
          memberNick: authMember?.memberNick,
          memberPhone: authMember?.memberPhone,
          memberAddress: authMember?.memberAddress,
          memberDesc: authMember?.memberDesc,
          memberImage: authMember?.memberImage,
        });
        return false;
      } else if (swalResult.isConfirmed) {
        const result = await member.updateMember(memberUpdateInput);
        Swal.fire("Saved!", "", "success");
        setAuthMember(result);
      }
    } catch (err) {
      console.log(err);
      setMemberUpdateInput({
        memberNick: authMember?.memberNick,
        memberPhone: authMember?.memberPhone,
        memberAddress: authMember?.memberAddress,
        memberDesc: authMember?.memberDesc,
        memberImage: authMember?.memberImage,
      });
      sweetErrorHandling(err).then();
    }
  };

  const handleImageDelete = async () => {
    const confirm = await showSaveConfirmation(
      "Do you want to delete your photo?"
    );
    if (confirm.isConfirmed) {
      const member = new MemberService();
      const result: Member = await member.deleteImage();
      await sweetTopSmallSuccessAlert("Successfully deleted", 1200);
      setMemberImage("/icons/default-user.svg");
      setAuthMember(result);
    } else {
      return false;
    }
  };

  const handleImageViewer = (e: T) => {
    if (e.target && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type,
        validateImageTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!validateImageTypes.includes(fileType)) {
        sweetErrorHandling({ message: Messages.error5 }).then();
      } else if (file) {
        memberUpdateInput.memberImage = file;
        setMemberUpdateInput({ ...memberUpdateInput });
        setMemberImage(URL.createObjectURL(file));
      } else {
        console.error("No file selected or the event target is invalid");
      }
    }
  };

  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img src={memberImage} className={"mb-image"} alt={"member-image"} />
        <div className={"media-change-box"}>
          <span>Upload image</span>
          <p>JPG, JPEG, PNG formats only!</p>
          <div className={"up-del-box"}>
            <Button
              component="label"
              className="label"
              onChange={handleImageViewer}
            >
              <CloudDownloadIcon className="cloud" />
              <input type="file" hidden />
            </Button>
            {authMember?.memberImage && authMember.memberImage.length > 5 ? (
              <Button onClick={handleImageDelete}>
                <DeleteIcon className="bin" />
              </Button>
            ) : null}
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={authMember?.memberNick ?? "No name"}
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={memberNickHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={authMember?.memberPhone ?? "No phone"}
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandler}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={
              authMember?.memberAddress
                ? authMember.memberAddress
                : "No address"
            }
            value={memberUpdateInput.memberAddress}
            name="memberAddress"
            onChange={memberAddressHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={
              authMember?.memberDesc ? authMember.memberDesc : "No description"
            }
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            onChange={memberDescHandler}
          />
        </div>
      </Box>
      <Box className={"save-box"}>
        <Button
          variant={"contained"}
          className="save-btn"
          onClick={handleSubmitButton}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
