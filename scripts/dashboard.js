import { changePassword, editUserData } from "./dashboard/editProfile.js";
import { QuestZender, toast, url } from "./utils.js";

export function showNotLoggedModal() {
  const notLoggedDisplay = document.querySelector(".notLoggedCont");
  notLoggedDisplay.classList.add("showNotLogged");
}

// TOGGLE PROFILE MODAL
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

// LOGIC TO FETCH USER DATA AND UPDATE UI
var usernameG;
var balanceG;
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
    const {
      fullName,
      phone,
      email,
      username,
      balance,
      btc,
      currency,
      accountType,
      country,
    } = data.data;
    usernameG = username;
    balanceG = balance;

    const usernameDis = document.querySelector(".user-info strong");
    const balanceDis = document.getElementById("balanceDis");
    const btcDis = document.getElementById("btcDis");
    const accountTypeDis = document.getElementById("accountType");

    usernameDis.textContent = username;
    balanceDis.textContent = `${currency} ${balance}`;
    const trimmedBtc = Math.floor(btc * 1e9) / 1e9;
    btcDis.textContent = `${trimmedBtc} BTC`;
    accountTypeDis.textContent = accountType;

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

const defaultContent = `<div id="tradingview-widget"></div>`;
let tvWidget = null;

function loadTradingView() {
  document.getElementById("tradingview-widget").innerHTML = `
  <div
            class="tradingview-widget-container"
            style="height: 100%; width: 100%"
          >
            <div
              class="tradingview-widget-container__widget"
              style="height: calc(100% - 32px); width: 100%"
            ></div>
            <div class="tradingview-widget-copyright">
              <a
                href="https://www.tradingview.com/"
                rel="noopener nofollow"
                target="_blank"
                ><span class="blue-text"
                  >Track all markets on TradingView</span
                ></a
              >
            </div>
            <script
              type="text/javascript"
              src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
              async
            >
                {
                "autosize": true,
                "symbol": "BINANCE:BTCUSDT",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "allow_symbol_change": true,
                "support_host": "https://www.tradingview.com"
              }
            </script>
          </div>
  `;
  tvWidget = new TradingView.widget({
    width: "100%",
    height: "370px",
    symbol: "BTCUSD",
    interval: "1",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: "tradingview-widget",
  });
}

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
          (activeTradeData.profit / activeTradeData.target) * 100
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
    <div><strong>Target:</strong> <br> $${takeProfit}</div>
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
              <p>Your KYC verification has been declined. Please upload another document and re-apply. Ensure it meets our verification requirements this time.</p>
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

  // LOGIC TO HANDLE EDIT USER DATA FORM
  const editUserDataForm = document.getElementById("edit-user-data-form");
  editUserDataForm.addEventListener("submit", editUserData);

  // LOGIC TO HANDLE CHANGE PASSWORD
  changePassword();
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

// Deposit methods modal
document.getElementById("depositBtn").addEventListener("click", toggleModal);
document
  .getElementById("closeDepositModal")
  .addEventListener("click", toggleModal);
function toggleModal() {
  document.getElementById("depositModal").classList.toggle("hidden");
}

// Copy wallet address on click
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("wallet")) {
    const text = e.target.dataset.wallet;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Address copied: " + text);
      })
      .catch(() => {
        alert("Failed to copy address.");
      });
  }
});

// ALL LOGIC FOR WITHDRAWAL MODAL
// logic to close withdrawal modal
const withdrawalModal = document.getElementById("withdrawalModal");
const closeWithdrawalModal = document.getElementById("closeWithdrawalModal");
closeWithdrawalModal.addEventListener("click", displayBitcoinForm);

// Display withdrawal methods modal
function displayBitcoinForm() {
  withdrawalModal.classList.toggle("hidden");
}

// logic for bitcoin withdraw method
const bitcoinForm = document.getElementById("bitcoin-form");
const bankForm = document.getElementById("bank-form");

const bitcoinBtn = document.getElementById("bitcoinBtn");
bitcoinBtn.addEventListener("click", bitcoinWithdraw);
function bitcoinWithdraw() {
  bitcoinForm.classList.remove("hidden");
  bankForm.classList.add("hidden");
}

// logic for bank withdrawal
const bankTransferBtn = document.getElementById("bankTransferBtn");
bankTransferBtn.addEventListener("click", bankTransferWithdraw);
function bankTransferWithdraw() {
  bankForm.classList.remove("hidden");
  bitcoinForm.classList.add("hidden");
}

// logic to handle bitcoin and bank submission methods
const withdrawalForm = document.querySelectorAll(".withdrawalForm");
withdrawalForm.forEach((form) => {
  form.addEventListener("submit", withdrawalMethodSubmission);
});
async function withdrawalMethodSubmission(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  // check if balance is enough
  var amount = parseFloat(formData.get("amount"));
  if (amount > balanceG) {
    withdrawalModal.classList.add("hidden");
    await toast(
      "info",
      "Insufficient funds!",
      "You have tried to withdraw an amount that is greater than your wallet balance. Please reduce the amount."
    );
    return;
  }

  const payload = {
    amount,
    username: usernameG,
    method: formData.get("method"),
    fullDetails: JSON.stringify(formObject),
  };

  if (payload.method === "Bitcoin withdrawal") {
    payload.walletAddress = formData.get("wallet");
  }

  const submitButton = form.querySelector('button[type="submit"]');
  try {
    submitButton.disabled = true;
    submitButton.innerText = "Processing...";

    const response = await QuestZender(
      url() + "/dashboard/withdrawal-request",
      "POST",
      JSON.stringify(payload),
      showNotLoggedModal
    );

    var message = await response.json();
    if (response.ok) {
      toast(
        "success",
        "Request Sent!",
        message.data + " To proceed you have to input your withdrawal code."
      );

      withdrawalModal.classList.add("hidden");
      chartContainer.innerHTML = menuContentMap.withdrawal.content[0];
      window.location = "/dashboard/#tradingview-widget";
      activateWithdrawalCodeSubmission();
    } else {
      toast("error", "Withdrawal Request Failed", message.error);
    }
  } catch (error) {
    alert(error);
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = "Proceed";
  }
}

// LOGIC TO HANDLE SUBMIT WITHDRAWAL CODE
async function submitWithdrawalCode() {
  const pin = document.getElementById("withdrawPin").value.trim();

  if (!pin) {
    toast("info", "No Code Provided", "Please enter your unique code.");
    return;
  }

  // verify code with api
  const response = await QuestZender(
    url() + `/dashboard/verify-tax-code/?taxCode=${pin}`,
    "GET",
    null,
    showNotLoggedModal
  );
  const message = await response.json();
  if (!response.ok) {
    toast("error", "Oops!", message.error);
    return;
  }

  toast(
    "success",
    "Verification successful!",
    "Withdrawal code verification successful. To proceed you need to provide a TAX CODE next."
  );
  // insert tax code form
  chartContainer.innerHTML = menuContentMap.withdrawal.content[1];
  activateTaxCodeSubmission();
}

// LOGIC TO HANDLE SUBMIT TAX CODE
async function submitTaxCode() {
  console.log("first");
  const pin = document.getElementById("taxPin").value.trim();
  if (!pin) {
    toast("info", "No Code Provided", "Please enter your unique code.");
    return;
  }
  // verify code with api
  const response = await QuestZender(
    url() + `/dashboard/verify-tax-code/?taxCode=${pin}`,
    "GET",
    null,
    showNotLoggedModal
  );
  const message = await response.json();
  if (!response.ok) {
    toast("error", "Oops!", message.error);
    return;
  }
  toast(
    "success",
    "Verification successful",
    message.data +
      " Your withdrawal request process is complete. Congratulations!"
  );
  window.location = "/dashboard/#header";
}

// initialize event listener for withdrawal code form
function activateWithdrawalCodeSubmission() {
  // LOGIC TO SUBMIT  WITHDRAWAL CODE
  const submitWithdrawalCodeBtn = document.getElementById("submit-pin");
  submitWithdrawalCodeBtn.addEventListener("click", submitWithdrawalCode);
}

// initialize event listener for tax code form
function activateTaxCodeSubmission() {
  // LOGIC TO SUBMIT  TAX CODE
  const submitTaxCodeBtn = document.getElementById("submitTaxCodeBtn");
  submitTaxCodeBtn.addEventListener("click", submitTaxCode);
}

// FETCH WITHDRAWAL HISTORY DATA
async function fetchWithdrawalHistory() {
  const response = await QuestZender(
    url() + `/dashboard/withdrawal-history?username=${usernameG}`,
    "GET",
    null,
    showNotLoggedModal
  );
  const message = await response.json();
  const userWithdrawalHistory = message.data;
  const historyBody = document.getElementById("history-body");

  userWithdrawalHistory.forEach((each) => {
    historyBody.innerHTML += `<tr>
    <td>${each.status}</td>
    <td>${each.withdrawalId}</td>
    <td>${each.method}</td>
    <td>${each.amount}</td>
    </tr>`;
  });
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
  // deposit: {
  //   title: "Deposit",
  //   content: "<div>deposit Content</div>",
  // },
  withdrawal: {
    title: "Withdrawal",
    content: [
      `
        <section class="transaction-section">
          <div class="container">
            <h2 class="withdrawal-title">WITHDRAWAL CODE REQUIRED</h2>
            <p class="description">
              To proceed in the withdrawal process, you need to input <b>WITHDRAWAL CODE</b>. Contact the Support for the <b>WITHDRAWAL CODE</b> through: <a style="color: dodgerblue" href="mailto:support@skye-trade.com">support@skye-trade.com</a><br>
              Admin typically responds  <strong>within 2 hours</strong>. Once you've obtained this withdrawal code return here and input below it to initiate the process.
              <br><br> <b>Disclaimer: </b>Ensure you finish your withdrawal process after you authenticate your withdrawal code as you can not use it again after authentication.
            </p>

            <div class="input-group">
              <span class="icon">🔒</span>
              <input type="password" id="withdrawPin" placeholder="INPUT WITHDRAWAL CODE" />
            </div>

            <button id="submit-pin" class="submit-btn" >AUTHENTICATE WITHDRAWAL CODE</button>
          </div>
        </section>
      `,
      `
      <section class="transaction-section">
          <div class="container">
            <h2 class="withdrawal-title">TAX CODE REQUIRED</h2>
            <p class="description">
              To finalize the withdrawal process, you need a verified <b>TAX CODE</b>. Contact the Support for the <b>TAX CODE</b> through: <a style="color: dodgerblue" href="mailto:support@skye-trade.com">support@skye-trade.com</a><br>
              Admin typically responds  <strong>within 2 hours</strong>. Once you've obtained this tax code return here and input below it to complete the process.
              <br><br> <b>Disclaimer: </b>Ensure you finish your withdrawal process after you authenticate your tax code as you can not use it again after authentication and you would have to start the process over.
            </p>

            <div class="input-group">
              <span class="icon">🔒</span>
              <input type="password" id="taxPin" placeholder="INPUT TAX CODE" />
            </div>

            <button id="submitTaxCodeBtn" class="submit-btn" >AUTHENTICATE TAX CODE</button>
          </div>
        </section> `,
    ],
  },
  history: {
    title: "Withdrawal history",
    content: ` <div class="history-card">
      <table style="width: 100%;">
        <thead>
          <tr>
            <th>Status</th>
            <th>Withdraw ID</th>
            <th>Withdraw Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody id="history-body">          
        </tbody>
      </table>
    </div> `,
  },
  logout: {
    title: "logout",
    content: "<div>logout Content</div>",
  },
};

// MENU CONTROLLER FUNCTION
function loadContent(target) {
  if (target === "trade") {
    loadTradingView();
  } else if (target === "kyc") {
    loadKycForm();
  } else if (target === "withdrawal") {
    withdrawalModal.addEventListener(
      "click",
      displayBitcoinForm(withdrawalModal)
    );

    return;
  } else if (target === "history") {
    fetchWithdrawalHistory();
  } else if (target === "logout") {
    toast("warning", "Logging Out...");
    localStorage.removeItem("auth");
    window.location = "/";
  }

  if (tvWidget && target !== "trade") {
    tvWidget = null;
  }

  const contentData = menuContentMap[target];
  mainContentHeader.textContent = contentData.title;
  chartContainer.innerHTML = contentData.content;
}

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

// ATTACH EVENT LISTENERS TO MENU BUTTONS
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.getAttribute("data-target");
    loadContent(target);
    hamburger.classList.remove("active");
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  });
});
// loadContent("trade");

// loadTradingView();
