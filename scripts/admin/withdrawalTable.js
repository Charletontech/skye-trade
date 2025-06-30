import { QuestZender, toast, url } from "../utils.js";

export default async function withdrawalTable() {
  // FETCH DATA FROM SERVER
  async function fetchWithdrawalData() {
    const response = await QuestZender(url() + "/admin/withdrawal-requests");
    if (!response.ok) {
      throw new Error("Error fetching withdrawal requests");
    }
    const message = await response.json();
    return message.data;
  }

  // populate withdrawal table data
  async function populateWithdrawalTable() {
    const withdrawalData = await fetchWithdrawalData();
    withdrawalData.forEach((each) => {
      const row = document.createElement("tr");
      row.innerHTML = `
    <td>${each.withdrawalId}</td>
    <td>${each.username}</td>
    <td>${each.userId}</td>
    <td>${each.amount}</td>
    <td>${each.method}</td>
    <td>${each.walletAddress}</td>
    <td>${each.status}</td>
    <td>${each.fullDetails}</td>
    <td><button class="button editWithdrawalBtn" data-username="${each.username}" data-withdrawalid="${each.withdrawalId}"> Edit </button> </td>
    `;
      document.getElementById("withdrawal-table-body").appendChild(row);
    });
  }
  await populateWithdrawalTable();

  //   HANDLE MODAL LOGIC
  let username;
  let withdrawalId;
  const editWithdrawalBtns = document.querySelectorAll(".editWithdrawalBtn");
  editWithdrawalBtns.forEach((editWithdrawalBtn) => {
    editWithdrawalBtn.addEventListener("click", () => {
      username = editWithdrawalBtn.dataset.username;
      withdrawalId = editWithdrawalBtn.dataset.withdrawalid;
      document.querySelector(
        ".withdrawalID"
      ).textContent = `Username: ${username}`;
      toggleWithdrawalModal();
    });
  });

  //   close modal btn
  document
    .getElementById("closeWithdrawalModal")
    .addEventListener("click", toggleWithdrawalModal);

  // EDIT withdrawal FORM
  const withdrawalForm = document.getElementById("withdrawal-form");
  withdrawalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = withdrawalForm.querySelector('select[name="status"]').value;
    const response = await QuestZender(
      url() + `/admin/manage-withdrawal-request/${withdrawalId}`,
      "PUT",
      JSON.stringify({ status })
    );
    const message = await response.json();
    if (response.ok) {
      toast("success", "withdrawal Status Updated!", message.data);
      return;
    }
    toast("error", "Error", message.error);
  });
}

function toggleWithdrawalModal() {
  document.getElementById("withdrawalModal").classList.toggle("show-Modal");
}
