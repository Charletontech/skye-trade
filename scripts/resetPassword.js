import { QuestZender, toast, url } from "./utils.js";
const loginForm = document.getElementById("loginForm");
const recoveryTokenInput = document.getElementById("recoveryToken");
const recoveryTokenError = document.getElementById("recoveryTokenError");
const newPasswordInput = document.getElementById("newPassword");
const newPasswordError = document.getElementById("newPasswordError");
const submitBtn = document.getElementById("submitBtn");

function getIdentifier() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString); // parse params

  const identifier = urlParams.get("identifier");
  return identifier;
}

const identifier = getIdentifier();
if (!identifier) {
  toast(
    "error",
    "Error",
    "No identifier found in the URL. Please try again or contact support."
  );
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let isValid = true;

  if (!recoveryTokenInput.value.trim()) {
    recoveryTokenError.innerText =
      "Please enter recovery token sent to your registered email.";
    isValid = false;
  } else {
    recoveryTokenError.textContent = "";
  }

  //   check for new password
  if (!newPasswordInput.value.trim()) {
    newPasswordError.innerText = "Please choose a new password.";
    isValid = false;
  } else {
    newPasswordError.textContent = "";
  }

  if (isValid) {
    const payload = {
      identifier,
      otp: recoveryTokenInput.value,
      newPassword: newPasswordInput.value,
    };

    // alert user to wait
    toast(
      "info",
      "Validating...",
      "Lets validate your Recovery Token and reset your password."
    );
    submitBtn.innerText = "In progress...";
    submitBtn.disabled = true;

    // Send request to login api
    try {
      const response = await QuestZender(
        url() + "/auth/reset-password",
        "POST",
        JSON.stringify(payload)
      );

      var message = await response.json();

      if (!response.ok) {
        toast("info", "Oops!", message.error);
        return;
      }

      // redirect user to change password page
      toast(
        "success",
        "Password Set!",
        "Your new password has successfully been set. Congratulations on recovering your account..."
      );
    } catch (error) {
      console.log(error);
      toast("error", "Error", error);
    } finally {
      submitBtn.innerText = "Log In";
      submitBtn.disabled = false;
    }
  }
});
