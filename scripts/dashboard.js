import { QuestZender, toast, url } from "./utils.js";

function showNotLoggedModal() {
  const notLoggedDisplay = document.querySelector(".notLoggedCont");
  notLoggedDisplay.classList.add("showNotLogged");
}
QuestZender(url() + "/dashboard/me", "GET", null, showNotLoggedModal)
  .then((response) => {
    if (!response.ok) {
      toast("error", "Error", "An error occurred while fetching user data");
      return;
    }
    return response.json();
  })
  .then((data) => {
    if (!data) return;
    const { username, balance, btc, currency, accountType } = data.data;

    const usernameDis = document.querySelector(".user-info strong");
    const balanceDis = document.getElementById("balanceDis");
    const btcDis = document.getElementById("btcDis");
    const accountTypeDis = document.getElementById("accountType");

    usernameDis.textContent = username;
    balanceDis.textContent = `${currency} ${balance}`;
    const trimmedBtc = Math.floor(btc * 1e9) / 1e9;
    btcDis.textContent = `${trimmedBtc} BTC`;
    accountTypeDis.textContent = accountType;
  })
  .catch((error) => {
    console.error(error);
    toast("error", "Error", "Failed to fetch dashboard data");
  });

const defaultContent = `<div id="tradingview-widget"></div>`;
let tvWidget = null;

// function loadTradingView() {
//   if (tvWidget === null) {
//     tvWidget = new TradingView.widget({
//       width: "100%",
//       height: "400px",
//       symbol: "BTCUSD",
//       interval: "1",
//       timezone: "Etc/UTC",
//       theme: "dark",
//       style: "1",
//       locale: "en",
//       toolbar_bg: "#f1f3f6",
//       enable_publishing: false,
//       allow_symbol_change: true,
//       container_id: "tradingview-widget",
//     });
//   }
// }

// set initial content of KYC form
var kycContent = `
<div class="kyc-form-container">
  <form id="kyc-form">
    <div class="kyc-form-group">
      <label for="idType">ID Type</label>
      <select id="idType" name="idType" required>
        <option value="">Select ID Type</option>
        <option value="national_id">National ID Card</option>
        <option value="drivers_license">Driver's License</option>
        <option value="residence_permit">Residence Permit</option>
      </select>
    </div>
    <div class="kyc-form-group">
      <label for="idFront">Upload ID Card (Front)</label>
      <div class="file-upload-wrapper">
        <span class="file-upload-text">Choose File</span>
        <span class="file-upload-button">Browse</span>
        <input type="file" id="idFront" name="idFront" accept="image/*" required />
      </div>
      <div class="preview-container" id="idFrontPreview"></div>
    </div>
    <div class="kyc-form-group">
      <label for="idBack">Upload ID Card (Back)</label>
      <div class="file-upload-wrapper">
        <span class="file-upload-text">Choose File</span>
        <span class="file-upload-button">Browse</span>
        <input type="file" id="idBack" name="idBack" accept="image/*" required />
      </div>
      <div class="preview-container" id="idBackPreview"></div>
    </div>
    <div class="kyc-form-actions">
      <button type="button" id="preview-button">Preview</button>
      <button type="submit">Submit</button>
    </div>
  </form>
</div>
`;

document.addEventListener("DOMContentLoaded", function () {
  // LOGIC TO HANDLE SUBMIT TRADE
  var tradeForm = document.querySelector(".trade-form");
  tradeForm.addEventListener("submit", submitTrade);
  async function submitTrade(event) {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    var tradeType = document.getElementById("tradeType").value;
    const payload = { amount, tradeType };
    try {
      const response = await QuestZender(
        url() + "/dashboard/new-trade",
        "POST",
        JSON.stringify(payload),
        null,
        showNotLoggedModal
      );

      var message = await response.json();
      console.log(message);
      if (response.status == 402) {
        toast(
          "info",
          "Insufficient funds!",
          "You do not have enough funds to execute this trade"
        );
        return;
      }

      if (!response.ok) {
        toast("error", "Error", message.error);
        return;
      }
      toast("success", "New trade opened!", message.data);
    } catch (error) {
      alert("An error occurred: " + error);
    }
  }

  // LOGIC TO HANDLE ACTIVE TRADE
  handleActiveTrade();
  async function handleActiveTrade() {
    const fetchActiveTradeData = await QuestZender(
      url() + "/dashboard/get-active-trade",
      "get",
      null,
      showNotLoggedModal
    );
    var activeTradeData = await fetchActiveTradeData.json();
    activeTradeData = activeTradeData.data;
    // check if user has any active trade
    if (activeTradeData === null) {
      // eject if user has no active trade...
      return;
    } else {
      // prepare data
      let progressPercentage;
      if (activeTradeData.target === null) {
        progressPercentage = 0;
      } else {
        progressPercentage = Math.round(
          activeTradeData.profit * activeTradeData.target * 100
        );
      }

      var takeProfit = activeTradeData.target ?? "not set";

      // Logic to update trade progress UI
      const tradeStatusContainer = document.getElementById(
        "trade-status-container"
      );
      displayTradeInProgress();
      function displayTradeInProgress() {
        const tradeInProgressHTML = `
    <div class="trade-in-progress">
    <h3>Trade In Progress</h3>
    <p>${progressPercentage}% Completed</p>
    <div class="progress-bar">
    <div class="progress-bar-fill"></div>
    </div>
    <p>Trade ongoing...</p>
    <div class="trade-details">
    <div>
    <div style=" margin-bottom: 1rem;"><strong>Amount:</strong> $${
      activeTradeData.amount
    }</div>
    <div ><strong>Type:</strong> ${activeTradeData.tradeType.toUpperCase()}</div>
    </div>
    <div>
    <div style=" margin-bottom: 1rem;"><strong>Pair:</strong> ${
      activeTradeData.pair
    }</div>
    <div><strong>profit:</strong> $${activeTradeData.profit}</div>
    </div>
    <div><strong>Target:</strong> <br> ${takeProfit}</div>
    </div>
    </div>
    `;
        tradeStatusContainer.innerHTML = tradeInProgressHTML;
        document.querySelector(
          ".progress-bar-fill"
        ).style.width = `${progressPercentage}%`;
      }
    }
  }

  // HANDLE LOGIC TO CHECK/FETCH KYC STATUS
  handleFetchKycStatus();
  async function handleFetchKycStatus() {
    try {
      var response = await QuestZender(
        url() + "/dashboard/check-kyc-status",
        "GET",
        null,
        showNotLoggedModal
      );
      const message = await response.json();
      if (response.ok) {
        switch (message.data) {
          case "approved":
            kycContent = `
            <div class="kyc-pending">
              <h3>KYC Approved</h3>
              <p>Congratulations! You have been verified.</p>
              <img src="../assets/Green Approved Stamp Image_simple_compose.png" alt="KYC Pending" class="pending-image" />
            </div>
            `;
            break;
          case "pending":
            kycContent = `
            <div class="kyc-pending">
              <h3>KYC Under Review</h3>
              <p>Your KYC verification is currently being processed. Please check back later.</p>
              <img src="../assets/Under Review Stamp.png" alt="KYC Pending" class="pending-image" />
            </div>
            `;
            break;
          case "declined":
            kycContent = `
            <div class="kyc-form-container">
              <h3 style="color: red">KYC Verification Declined</h3>
              <p>Your KYC verification has been declined. Please another document for re-apply.</p>
              <form id="kyc-form">
                <div class="kyc-form-group">
                  <label for="idType">ID Type</label>
                  <select id="idType" name="idType" required>
                    <option value="">Select ID Type</option>
                    <option value="national_id">National ID Card</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="residence_permit">Residence Permit</option>
                  </select>
                </div>
                <div class="kyc-form-group">
                  <label for="idFront">Upload ID Card (Front)</label>
                  <div class="file-upload-wrapper">
                    <span class="file-upload-text">Choose File</span>
                    <span class="file-upload-button">Browse</span>
                    <input type="file" id="idFront" name="idFront" accept="image/*" required />
                  </div>
                  <div class="preview-container" id="idFrontPreview"></div>
                </div>
                <div class="kyc-form-group">
                  <label for="idBack">Upload ID Card (Back)</label>
                  <div class="file-upload-wrapper">
                    <span class="file-upload-text">Choose File</span>
                    <span class="file-upload-button">Browse</span>
                    <input type="file" id="idBack" name="idBack" accept="image/*" required />
                  </div>
                  <div class="preview-container" id="idBackPreview"></div>
                </div>
                <div class="kyc-form-actions">
                  <button type="button" id="preview-button">Preview</button>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
            `;
            break;
        }
      }
      if (response.status === 404) {
        console.log(message.data);
      }
    } catch (error) {
      console.log("Error fetching KYC status");
    }
  }
});

function loadKycForm() {
  chartContainer.innerHTML = kycContent;

  const idFrontInput = document.getElementById("idFront");
  const idBackInput = document.getElementById("idBack");
  const previewButton = document.getElementById("preview-button");
  const kycForm = document.getElementById("kyc-form");

  idFrontInput.addEventListener("change", (event) => {
    handleFileChange(event, "idFrontPreview");
  });

  idBackInput.addEventListener("change", (event) => {
    handleFileChange(event, "idBackPreview");
  });

  previewButton.addEventListener("click", () => {
    // Handle preview logic here.  For simplicity, you can
    // display the form values in an alert, or in a designated
    // preview section within the form.
    const idType = document.getElementById("idType").value;
    const idFrontFile = idFrontInput.files[0];
    const idBackFile = idBackInput.files[0];

    let previewText = `ID Type: ${idType}`;
    if (idFrontFile) {
      previewText += `, Front Image: ${idFrontFile.name}`;
    }
    if (idBackFile) {
      previewText += `, Back Image: ${idBackFile.name}`;
    }
    alert(`Preview Data:\n${previewText}`);
  });

  // HANDLE SUBMIT KYC FORM
  kycForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(kycForm);

      const response = await QuestZender(
        url() + "/dashboard/kyc",
        "POST",
        formData,
        showNotLoggedModal,
        false
      );

      let message = await response.json();
      if (response.ok) {
        toast("success", "Success!", message.data);
      } else {
        toast(
          "error",
          "Error",
          `Unable to submit KYC your request. Error: ${message.error}`
        );
      }
    } catch (error) {
      alert("An unexpected error occurred");
    }
  });
}

function handleFileChange(event, previewId) {
  const previewContainer = document.getElementById(previewId);
  previewContainer.innerHTML = ""; // Clear previous previews
  const files = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "150px"; // Added for consistent sizing
        img.style.maxHeight = "150px";
        img.style.border = "1px solid #4a5568";
        img.style.borderRadius = "5px";
        previewContainer.style.display = "flex"; // Ensure preview container is visible
        previewContainer.style.flexWrap = "wrap";
        previewContainer.style.gap = "10px";
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}

// HANDLE WITHDRAWAL LOGIC
function submitPin(e) {
  e.preventDefault();
  console.log("first");
  const pin = document.getElementById("withdrawPin").value.trim();

  if (!pin) {
    alert("Please enter your withdrawal PIN.");
    return;
  }

  // Simulate form submission
  console.log("Submitting PIN:", pin);

  // Fake API behavior simulation
  setTimeout(() => {
    const success = Math.random() > 0.3; // 70% chance of success

    if (success) {
      alert("PIN submitted successfully! Redirecting...");
      // window.location.href = '/fund-transfer'; // Uncomment to simulate redirect
    } else {
      alert("Invalid PIN. Please try again.");
    }
  }, 1000);
}

// HANDLE MENU CHANGE
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const mainContentHeader = document.querySelector(".right-panel h2");
const chartContainer = document.querySelector(".chart-container");
const sidebarLinks = document.querySelectorAll(".sidebar li");
const menuContentMap = {
  home: {
    title: "Home",
    content: "<div>Home Content</div>",
  },
  trade: {
    title: "Trade",
    content: defaultContent,
  },
  kyc: {
    title: "KYC Verification",
    content: "",
  },
  deposit: {
    title: "Deposit",
    content: "<div>deposit Content</div>",
  },
  withdrawal: {
    title: "withdrawal",
    content: `
        <section class="transaction-section">
          <div class="container">
            <h2 class="withdrawal-title">TAX CODE REQUIRED</h2>
            <p class="description">
              To initiate a withdrawal process, you need a verified <b>TAX CODE</b>. Contact the Support for the <b>TAX CODE</b> through: <a style="color: dodgerblue" href="mailto:support@skye-trade.com">support@skye-trade.com</a><br>
              Admin typically responds  <strong>within 2 hours</strong>. Once you've obtained this tax code return here and input below it to initiate the process.
            </p>

            <div class="input-group">
              <span class="icon">🔒</span>
              <input type="password" id="withdrawPin" placeholder="INPUT TAX CODE" />
            </div>

            <button id="submit-pin" class="submit-btn" >AUTHENTICATE TAX CODE</button>
          </div>
        </section>
      `,
  },
  // logout: {
  //   title: "logout",
  //   content: "<div>logout Content</div>",
  // },
};

function loadContent(target) {
  const contentData = menuContentMap[target];
  mainContentHeader.textContent = contentData.title;
  chartContainer.innerHTML = contentData.content;

  if (target === "trade") {
    loadTradingView();
  } else if (target === "kyc") {
    loadKycForm();
  } else if (target === "withdrawal") {
    // Register the event listener *after* injecting withdrawal content
    const submitPinBtn = document.getElementById("submit-pin");
    submitPinBtn.addEventListener("click", submitPin);
    if (submitPinBtn) {
      submitPinBtn.addEventListener("click", submitPin);
    }
  }

  if (tvWidget && target !== "trade") {
    tvWidget = null;
  }
}

// function loadContent(target) {
//   const contentData = menuContentMap[target];
//   mainContentHeader.textContent = contentData.title;
//   chartContainer.innerHTML = contentData.content;
//   if (target === "trade") {
//     loadTradingView();
//   } else if (target === "kyc") {
//     loadKycForm();
//   } else if (tvWidget) {
//     tvWidget = null;
//   }
// }
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  sidebar.classList.toggle("show");
  overlay.classList.toggle("show");
  if (hamburger.classList.contains("active")) {
    hamburger.querySelector("i").textContent = "close";
  } else {
    hamburger.querySelector("i").textContent = "menu";
  }
});
overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
  hamburger.querySelector("i").textContent = "menu";
});
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.getAttribute("data-target");
    loadContent(target);
    hamburger.classList.remove("active");
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  });
});
loadContent("trade");

window.onload = () => {
  loadContent("trade");
};
