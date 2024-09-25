/** SweetAlertHandling **/
import Swal from "sweetalert2";
import { Messages } from "./config";

export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    text: message,
    showConfirmButton: false,
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
  });
};

export const showSaveConfirmation = async () => {
  const swalResult = await Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    denyButtonText: "No",
    customClass: {
      actions: "my-actions",
      cancelButton: "order-1 right-gap",
      confirmButton: "order-2",
      denyButton: "order-3",
    },
  });
  return swalResult;
};

export const showSaveConfirmation1 = async (text: string) => {
  const swalResult = await Swal.fire({
    title: text,
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: "No",
    customClass: {
      actions: "my-actions",

      confirmButton: "order-2",
      denyButton: "order-3",
    },
  });
  return swalResult;
};

export const sweetTopSuccessAlert1 = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "center",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: msg,
  }).then();
};

export const sweetFailureProvider = async (
  msg: string,
  show_button: boolean = false,
  forward_url: string = ""
) => {
  Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};
