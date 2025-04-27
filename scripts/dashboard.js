const defaultContent = `<div id="tradingview-widget"></div>`;
let tvWidget = null;

function loadTradingView() {
  if (tvWidget === null) {
    tvWidget = new TradingView.widget({
      width: "100%",
      height: "400px",
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
}

function loadKycForm() {
  const kycFormContent = `
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
  chartContainer.innerHTML = kycFormContent;

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

  kycForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(kycForm);

    fetch("https://api.example.com/kyc", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("KYC data submitted successfully!");
        //  handle success - clear form?
      })
      .catch((error) => {
        alert("An error occurred: " + error);
        //  handle error
      });
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
  orders: {
    title: "Orders",
    content: "<div>Orders Content</div>",
  },
  settings: {
    title: "Settings",
    content: "<div>Settings Content</div>",
  },
};

function loadContent(target) {
  const contentData = menuContentMap[target];
  mainContentHeader.textContent = contentData.title;
  chartContainer.innerHTML = contentData.content;

  if (target === "trade") {
    loadTradingView();
  } else if (target === "kyc") {
    loadKycForm();
  } else if (tvWidget) {
    tvWidget = null;
  }
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

function submitTrade(event) {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const tradeType = document.getElementById("tradeType").value;
  const payload = { amount, tradeType };

  fetch("https://api.example.com/trade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => alert("Trade submitted successfully!"))
    .catch((error) => alert("An error occurred: " + error));
}

// trade status code
const tradeStatusContainer = document.getElementById("trade-status-container");
function displayTradeInProgress() {
  const tradeInProgressHTML = `
          <div class="trade-in-progress">
            <h3>Trade In Progress</h3>
            <p>75% Completed</p>
            <div class="progress-bar">
              <div class="progress-bar-fill"></div>
            </div>
            <p>Processing Transaction...</p>
            <div class="trade-details">
              <div>
                <div style=" margin-bottom: 1rem;"><strong>Amount:</strong> $2,000</div>
                <div ><strong>Type:</strong> Crypto</div>
              </div>
              <div>
                <div style=" margin-bottom: 1rem;"><strong>Pair:</strong> BTCUSD</div>
                <div><strong>Entry:</strong> 70,000</div>
              </div>
                <div><strong>Target:</strong> 75,000</div>
            </div>
          </div>
        `;
  tradeStatusContainer.innerHTML = tradeInProgressHTML;
}
displayTradeInProgress();

// function fetchAndDisplayTradeStatus() {
//   // Replace 'https://api.example.com/trade-status' with your actual API endpoint
//   fetch("https://api.example.com/trade-status")
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.tradeInProgress) {
//         displayTradeInProgress();
//       } else {
//         loadTradingView(); // Load TradingView if no trade in progress
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching trade status:", error);
//       loadTradingView(); // Load TradingView even on error to prevent blank page
//     });
// }

// window.onload = () => {
//   fetchAndDisplayTradeStatus();
//   loadContent("trade");
// };
