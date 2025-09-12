import { QuestZender, toast, url } from "../utils.js";

export default async function depositTable() {
  try {
    // FETCH DATA FROM SERVER
    async function fetchDepositData() {
      const response = await QuestZender(url() + "/admin/get-deposit-proofs");
      if (!response.ok) {
        throw new Error("Error fetching deposit requests");
      }
      const message = await response.json();
      return message.data;
    }

    // populate deposit table data
    async function populateDepositTable() {
      const depositData = await fetchDepositData();
      depositData.forEach((each) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${each.id}</td>
      <td>${each.userId}</td>
      <td>${each.username}</td>
      <td>${each.amount}</td>
      <td><a href="${each.proofUrl}">View Proof</a></td>
      <td>${each.walletAddress}</td>
      <td>${each.status}</td>
      <td><button class="button editWithdrawalBtn" data-username="${each.username}" data-withdrawalid="${each.withdrawalId}"> Edit </button> </td>
      `;
        document.getElementById("deposit-table-body").appendChild(row);
      });
    }

    await populateDepositTable();
  } catch (error) {
    console.log(error);
  }
}
