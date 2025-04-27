const steps = document.querySelectorAll(".step");
const prevBtns = document.querySelectorAll(".prev-step");
const nextBtns = document.querySelectorAll(".next-step");
const form = document.getElementById("signupForm");
let currentStep = 0;

function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.remove("active");
    if (index === stepIndex) {
      step.classList.add("active");
    }
  });
}

function validateStep(stepIndex) {
  const currentStepElements = steps[stepIndex].querySelectorAll(
    "input[required], select[required]"
  );
  let isValid = true;
  currentStepElements.forEach((element) => {
    const errorDivId = element.id + "Error";
    const errorDiv = document.getElementById(errorDivId);
    if (!element.value.trim()) {
      isValid = false;
      if (errorDiv) {
        errorDiv.textContent = "This field is required.";
      }
    } else if (
      element.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)
    ) {
      isValid = false;
      if (errorDiv) {
        errorDiv.textContent = "Please enter a valid email address.";
      }
    } else if (element.id === "password" && element.value.length < 6) {
      isValid = false;
      if (errorDiv) {
        errorDiv.textContent = "Password must be at least 6 characters long.";
      }
    } else if (
      element.id === "repeatPassword" &&
      element.value !== document.getElementById("password").value
    ) {
      isValid = false;
      if (errorDiv) {
        errorDiv.textContent = "Passwords do not match.";
      }
    } else if (element.type === "checkbox" && !element.checked) {
      isValid = false;
      if (errorDiv) {
        errorDiv.textContent = "You must agree to the terms and conditions.";
      }
    } else {
      if (errorDiv) {
        errorDiv.textContent = "";
      }
    }
  });
  return isValid;
}

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      currentStep++;
      if (currentStep < steps.length) {
        showStep(currentStep);
      }
    }
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentStep--;
    if (currentStep >= 0) {
      showStep(currentStep);
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateStep(currentStep)) {
    alert("Form submitted successfully!");
    // You can collect form data here:
    const formData = new FormData(form);
    for (const [name, value] of formData) {
      console.log(`${name}: ${value}`);
    }
  }
});

// File Upload Preview
function previewFile(inputId, previewContainerId) {
  const fileInput = document.getElementById(inputId);
  const previewContainer = document.getElementById(previewContainerId);
  const uploadWrapper = fileInput.previousElementSibling;

  const handleFileChange = () => {
    previewContainer.innerHTML = "";
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const preview = document.createElement("div");
        preview.classList.add("file-preview");
        const img = document.createElement("img");
        img.src = e.target.result;
        preview.appendChild(img);
        previewContainer.appendChild(preview);
      };

      reader.readAsDataURL(file);
    }
  };

  fileInput.addEventListener("change", handleFileChange);

  fileInput.addEventListener("focus", () => {
    uploadWrapper.classList.add("active");
  });
  fileInput.addEventListener("blur", () => {
    uploadWrapper.classList.remove("active");
  });
  uploadWrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadWrapper.classList.add("active");
  });
  uploadWrapper.addEventListener("dragleave", () => {
    uploadWrapper.classList.remove("active");
  });
  uploadWrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadWrapper.classList.remove("active");
    fileInput.files = e.dataTransfer.files; // Assign dropped files to the input
    handleFileChange(); // Trigger the preview
  });
}

previewFile("idCardFront", "idCardFrontPreview");
previewFile("idCardBack", "idCardBackPreview");
