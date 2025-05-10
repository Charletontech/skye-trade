import { showNotLoggedModal } from "../dashboard.js";
import { QuestZender, toast, url } from "../utils.js";

export async function editUserData(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const response = await QuestZender(
    url() + "/dashboard/edit-profile",
    "POST",
    formData,
    showNotLoggedModal,
    false
  );
  const message = await response.json();
  if (response.ok) {
    alert("success");
    // toast("success", "Update Successful!", message.data);
    return;
  }
  if (response.status == 400) {
    alert(message.error);
    // toast("info", "Email Conflict!", message.error);
    return;
  }
  alert(`We experienced an error ${message.error}`);
  //   toast("error", "Oops!", `We experienced an error ${message.error}`);
}

export function changePassword() {
  const editPasswordForm = document.getElementById("edit-password-form");
  editPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editPasswordForm);
    let newPassword = formData.get("newPassword");
    let confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast(
        "info",
        "Passwords do not match",
        "Ensure old and new passwords match"
      );
      return;
    }

    const response = await QuestZender(
      url() + "/dashboard/change-password",
      "POST",
      formData,
      showNotLoggedModal,
      false
    );
    const message = await response.json();
    if (response.ok) {
      // toast("success", "Password Updated!", message.data)
      alert(message.data);
      return;
    }

    // toast('error', "Oops!", `We experienced an error ${message.error}`)
    alert(message.error);
  });
}
