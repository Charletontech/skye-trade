import { QuestZender, toast, url } from "../utils.js";

export default async function kycTable() {
  // FETCH KYC DATA FROM SERVER
  async function fetchKycData() {
    const response = await QuestZender(url() + "/admin/all-kyc");
    if (!response.ok) {
      throw new Error("Unable to fetch KYC data from server");
    }
    const message = await response.json();
    return message.data;
  }

  //   Populate KYC table rows
  async function populateKycTable() {
    const allKycData = await fetchKycData();
    allKycData.forEach((kycData) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${kycData.kycId}</td>
        <td>${kycData.userId}</td>
        <td>${kycData.idType}</td>
        <td> <a href="${
          kycData.idFrontUrl
        }" target="_blank">View image</a> </td>
        <td><a href="${kycData.idBackUrl}" target="_blank">View image</a></td>
        <td>${kycData.status}</td>
        <td>${new Date(kycData.createdAt).toLocaleDateString()}</td>
        <td> <button class="button editKycBtn" data-kycid="${
          kycData.kycId
        }"> Edit </button> </td>
        `;
      document.getElementById("kyc-table-body").appendChild(row);
    });
  }
  await populateKycTable();

  //   HANDLE MODAL LOGIC
  var kycId;
  const editKycBtns = document.querySelectorAll(".editKycBtn");
  editKycBtns.forEach((editKycBtn) => {
    editKycBtn.addEventListener("click", () => {
      kycId = editKycBtn.dataset.kycid;
      document.querySelector(".kycID").textContent = `KYC ID: ${kycId}`;
      toggleKycModal();
    });
  });

  //   close modal btn
  document
    .getElementById("closeKycModal")
    .addEventListener("click", toggleKycModal);

  // EDIT KYC FORM
  const kycForm = document.getElementById("kyc-form");
  kycForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = kycForm.querySelector('select[name="status"]').value;
    const response = await QuestZender(
      url() + `/admin/edit-kyc/${kycId}`,
      "PUT",
      JSON.stringify({ status })
    );
    const message = await response.json();
    if (response.ok) {
      toast("success", "KYC Status Updated!", message.data);
      return;
    }
    toast("error", "Error", message.error);
  });
}

function toggleKycModal() {
  document.getElementById("kycModal").classList.toggle("show-Modal");
}
