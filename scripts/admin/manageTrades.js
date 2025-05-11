import { QuestZender, url } from "../utils.js";

export default async function manageTrades() {
  // FETCH ALL TRADES DATA FROM SERVER

  async function fetchAllTrades() {
    const response = await QuestZender(url() + "/admin/all-trades", "GET");
    const message = await response.json();
    if (!response.ok) {
      alert("An error occured while fetching trades...");
      throw new Error("An error occurred while fetching trades...");
    }
    return message.data;
  }

  //   populate manage trades table
  async function populateManageTradesTable() {
    const allTradesData = await fetchAllTrades();
    allTradesData.forEach((tradeData) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tradeData.tradeId}</td>
        <td>${tradeData.userId}</td>
        <td>${tradeData.amount}</td>
        <td>${tradeData.tradeType}</td>
        <td>${tradeData.pair}</td>
        <td>${tradeData.target ?? "Not Set"}</td>
        <td>${tradeData.profit}</td>
        <td>${tradeData.status}</td>
        <td>${new Date(tradeData.createdAt).toLocaleDateString()}</td>
        <td> <button class="button editTradeBtn" data-tradeid="${
          tradeData.tradeId
        }"> Edit </button> </td>
        `;
      document.getElementById("manage-trades-table-body").appendChild(row);
    });
  }
  await populateManageTradesTable();

  //   EDIT TRADE LOGIC/DISPLAY MODAL
  let tradeId;
  const editTradeBtns = document.querySelectorAll(".editTradeBtn");
  editTradeBtns.forEach((editTradeBtn) => {
    editTradeBtn.addEventListener("click", () => {
      tradeId = editTradeBtn.dataset.tradeid;
      document.querySelector(".tradeID").textContent = `Trade ID: ${tradeId}`;
      toggleManageTradeModal();
    });
  });

  const closeTradesModal = document.getElementById("closeTradesModal");
  closeTradesModal.addEventListener("click", toggleManageTradeModal);

  //   SEND EDIT TRADE REQUEST
  const editTradeForm = document.getElementById("edit-trade-form");
  editTradeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editTradeForm);
    var payload = {};
    formData.entries().forEach((each) => {
      payload[`${each[0]}`] = each[1];
    });

    // delete empty unfilled fields
    for (const key in payload) {
      if (payload[key] == "") {
        delete payload[key];
      }
    }

    const response = await QuestZender(
      url() + `/admin/edit-trade/${tradeId}`,
      "PUT",
      JSON.stringify(payload)
    );

    const message = await response.json();
    if (response.ok) {
      alert(message.data);
      toast("success", "Success", message.data);
      return;
    }
    alert(message.error);
    toast("info", "Error", message.error);
  });
}

function toggleManageTradeModal() {
  const manageTradesModal = document.getElementById("manage-trades-modal");
  manageTradesModal.classList.toggle("show-Modal");
}
