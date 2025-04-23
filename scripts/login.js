const loginForm = document.getElementById("loginForm");
const loginIdentifierInput = document.getElementById("loginIdentifier");
const passwordInput = document.getElementById("password");
const loginIdentifierError = document.getElementById("loginIdentifierError");
const passwordError = document.getElementById("passwordError");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let isValid = true;

  if (!loginIdentifierInput.value.trim()) {
    loginIdentifierError.textContent = "Please enter your email or username.";
    isValid = false;
  } else {
    loginIdentifierError.textContent = "";
  }

  if (!passwordInput.value.trim()) {
    passwordError.textContent = "Please enter your password.";
    isValid = false;
  } else {
    passwordError.textContent = "";
  }

  if (isValid) {
    // Simulate successful login
    alert(`Logging in with: ${loginIdentifierInput.value}`);
    // In a real application, you would send this data to your server for authentication.
    const loginData = {
      identifier: loginIdentifierInput.value,
      password: passwordInput.value,
    };
    console.log("Login Data:", loginData);
    // You would typically use fetch or another method to send this data.
  }
});
