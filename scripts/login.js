import { createSession, QuestZender, toast, url } from "./utils.js";
const loginForm = document.getElementById("loginForm");
const loginIdentifierInput = document.getElementById("loginIdentifier");
const passwordInput = document.getElementById("password");
const loginIdentifierError = document.getElementById("loginIdentifierError");
const passwordError = document.getElementById("passwordError");
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

  if (!passwordInput.value.trim()) {
    passwordError.innerText = "Please enter your password.";
    isValid = false;
  } else {
    passwordError.textContent = "";
  }

  if (isValid) {
    const loginData = {
      identifier: loginIdentifierInput.value,
      password: passwordInput.value,
    };

    // alert user to wait
    toast(
      "info",
      "Verifying...",
      "We want to be sure its really you. Please wait."
    );
    submitBtn.innerText = "Authenticating...";
    submitBtn.disabled = true;

    // Send request to login api
    try {
      const response = await QuestZender(
        url() + "/auth/login",
        "POST",
        JSON.stringify(loginData)
      );

      var message = await response.json();

      if (response.status === 403) {
        var tempToken = JSON.parse(message.error);
        tempToken = tempToken.token;
        localStorage.setItem("auth", JSON.stringify({ token: tempToken }));
        window.location = "/dashboard/account-verification.html";
        return;
      }

      if (!response.ok) {
        toast("error", "Login Failed!", message.error);
        return;
      }

      // store auth data in localStorage
      createSession(message);

      // redirect user based on authorization
      if (message.data.permission == "admin") {
        toast("success", "Welcome back Admin!");
        window.location = "/admin";
      } else {
        toast("success", "Login Success!", "Nice to have you back...");
        window.location = "/dashboard";
      }
    } catch (error) {
      console.log(error);
      toast("error", "Error", error);
    } finally {
      submitBtn.innerText = "Log In";
      submitBtn.disabled = false;
    }
  }
});
