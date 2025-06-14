import { QuestZender, toast, url } from "./utils.js";
const loginForm = document.getElementById("loginForm");
const loginIdentifierInput = document.getElementById("loginIdentifier");
const loginIdentifierError = document.getElementById("loginIdentifierError");
const submitBtn = document.getElementById("submitBtn");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let isValid = true;

  if (!loginIdentifierInput.value.trim()) {
    loginIdentifierError.innerText = "Please enter your email or username.";
    isValid = false;
  } else {
    loginIdentifierError.textContent = "";
  }

  if (isValid) {
    const payload = {
      identifier: loginIdentifierInput.value,
    };

    // alert user to wait
    toast(
      "info",
      "Verifying...",
      "Lets check if your email exists then send you an OTP."
    );
    submitBtn.innerText = "Requesting OTP...";
    submitBtn.disabled = true;

    // Send request to login api
    try {
      const response = await QuestZender(
        url() + "/auth/forgot-password",
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
        "Recovery Token sent!",
        "We found your account. We have sent a Recovery Token to your email..."
      );
      window.location = `/reset-password/index.html?identifier=${loginIdentifierInput.value}`;
    } catch (error) {
      console.log(error);
      toast("error", "Error", error);
    } finally {
      submitBtn.innerText = "Log In";
      submitBtn.disabled = false;
    }
  }
});
