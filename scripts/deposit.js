import { QuestZender, toast, url } from "../scripts/utils.js";
// Open modal on any "Make Deposit" button click
document.querySelectorAll(".deposit-method button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("depositModal").style.display = "flex";
  });
});

// Close modal
document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("depositModal").style.display = "none";
});

// Handle form submission
document.getElementById("depositForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  toast("info", "Processing", "Submitting your deposit...");
  const submitBtn = document.querySelector(".submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Sending...";

  const fileInput = document.getElementById("proofUpload");
  const amountInput = document.getElementById("amount");
  const walletAddress = document.getElementById(
    "walletAddressDisplay"
  ).textContent;

  const formData = new FormData();
  formData.append("walletAddress", walletAddress);
  formData.append("amount", amountInput.value);
  formData.append("paymentProof", fileInput.files[0]);

  try {
    const response = await QuestZender(
      url() + "/dashboard/deposit-proof",
      "post",
      formData,
      null,
      false
    );

    const message = await response.json();

    if (!response.ok) {
      toast("error", "An Error Occurred", message.error);
      throw new Error("Failed to submit deposit");
    }

    toast("success", "Payment proof submitted successfully!", message.data);
    document.getElementById("depositModal").style.display = "none";
    document.getElementById("depositForm").reset();
  } catch (error) {
    console.error(error);
    toast(
      "error",
      "Unexpected Error",
      "Error submitting deposit. Please try again."
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Submit";
  }
});

const modal = document.getElementById("depositModal");
const qrContainer = document.getElementById("qrcode");
const walletDisplay = document.getElementById("walletAddressDisplay");
const copyBtn = document.getElementById("copyWalletBtn");

// Clear QR code before generating a new one
function clearQRCode() {
  qrContainer.innerHTML = "";
}

// Generate QR code and show modal
document.querySelectorAll(".deposit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const wallet = btn.getAttribute("data-wallet");
    clearQRCode();
    new QRCode(qrContainer, {
      text: wallet,
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    walletDisplay.textContent = wallet;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(wallet).then(() => {
        alert("Wallet address copied to clipboard!");
      });
    };

    modal.style.display = "flex";

    // modal header
    const modalHeader = document.querySelector(".modal-content h2");
    const headerAttr = btn.getAttribute("data-header");
    modalHeader.innerHTML = headerAttr;
  });
});

// Close modal
document.querySelector(".close-btn").addEventListener("click", () => {
  modal.style.display = "none";
  clearQRCode();
});

// LOGIC FOR PROFILE SIDEBAR
const toggleButton = document.querySelector(".dp");
const profileSidebar = document.getElementById("user-sidebar");
let isSidebarOpen = false;

function toggleProfileSidebar(event) {
  event.stopPropagation(); // Prevent the click on the button from immediately triggering the document click event
  profileSidebar.classList.toggle("open");
  isSidebarOpen = !isSidebarOpen;
}

toggleButton.addEventListener("click", toggleProfileSidebar);

document.addEventListener("click", function (event) {
  if (
    isSidebarOpen &&
    !profileSidebar.contains(event.target) &&
    event.target !== toggleButton
  ) {
    profileSidebar.classList.remove("open");
    isSidebarOpen = false;
  }
});

//  LOGIC TO FETCH USER DATA AND UPDATE UI
var usernameG;
var balanceG;
QuestZender(url() + "/dashboard/me", "GET", null)
  .then((response) => {
    if (!response.ok) {
      toast("error", "Error", "An error occurred while fetching user data");
      return;
    }
    return response.json();
  })
  .then((data) => {
    if (!data) return;
    const { fullName, phone, email, username, balance, accountType, country } =
      data.data;
    usernameG = username;
    balanceG = balance;

    const usernameDis = document.querySelector(".user-info strong");
    usernameDis.textContent = username;

    // update profile UI data
    document.getElementById("profileFullName").value = fullName;
    document.getElementById("profileEmail").value = email;
    document.getElementById("profilePhone").value = phone;
    document.getElementById("profileCOR").value = country;
    document.getElementById("profileBalance").innerText = balanceG;
  })
  .catch((error) => {
    console.error(error);
    toast("error", "Error", "Failed to fetch dashboard data");
  });
