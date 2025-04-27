document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const successMessage = document.getElementById("successMessage");
  const submitButton = document.querySelector(".btn-submit");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Disable button and show spinner
    submitButton.disabled = true;
    submitButton.innerHTML = `<div class="spinner"></div> Signing Up...`;

    // Gather form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // validate passwords match
    const password = form.querySelector('input[name="password"]').value;
    const repeatPassword = form.querySelector(
      'input[name="repeatPassword"]'
    ).value;

    if (password !== repeatPassword) {
      successMessage.style.display = "block";
      successMessage.style.backgroundColor = "#7d1d1d"; // Red background
      successMessage.textContent = "❌ Passwords do not match.";

      // Reset the button if needed
      submitButton.disabled = false;
      submitButton.innerHTML = `Sign Up`;
      return;
    }

    try {
      //   // Actually send request to a fake API
      //   const response = await fetch("https://example.com/api/register", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(data),
      //   });

      //   if (!response.ok) {
      //     throw new Error("Something went wrong!");
      //   }

      // Simulate random API success or failure
      const randomSuccess = Math.random() < 0.7; // 70% success rate

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (randomSuccess) {
            resolve(); // pretend it succeeded
          } else {
            reject(new Error("Random API failure!")); // pretend it failed
          }
        }, 2000); // simulate 2 sec network delay
      });

      // If successful
      successMessage.style.display = "block";
      successMessage.style.backgroundColor = "#1d643b"; // green background
      successMessage.textContent = "🎉 Registration Successful!";

      // Reset form
      form.reset();
    } catch (error) {
      // If failed
      successMessage.style.display = "block";
      successMessage.style.backgroundColor = "#7d1d1d"; // red background
      successMessage.textContent = "❌ Registration Failed. Please try again.";
    } finally {
      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = `Sign Up`;

      // Hide success/error message after some time
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 4000);
    }
  });
});
