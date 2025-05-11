import { QuestZender, toast, url } from "../utils.js";

export default async function taxCodesTable() {
  const taxCodeBtn = document.querySelector(".taxCodeBtn");
  taxCodeBtn.addEventListener("click", async (e) => {
    taxCodeBtn.disabled = true;
    const response = await QuestZender(
      url() + "/admin/generate-tax-code",
      "GET"
    );
    const message = await response.json();
    if (response.ok) {
      console.log(message.data);
      toast("success", "New Tax Code Generated", message.data);
      return;
    }

    toast("error", "Error Generating Tax Code", message.error);
  });

  // FETCH DATA FROM SERVER
  async function fetchTaxCodesData() {
    const response = await QuestZender(url() + "/admin/tax-codes");
    if (!response.ok) {
      throw new Error("Unable to fetch taxCodes data from server");
    }
    const message = await response.json();
    return message.data;
  }

  //   Populate taxCodes table rows
  async function populateTaxCodesTable() {
    const allTaxCodesData = await fetchTaxCodesData();
    allTaxCodesData.forEach((taxCodesData, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${index + 1}</td>
            <td>${taxCodesData.taxCode}</td>
            <td>${taxCodesData.status}</td>
            `;
      document.getElementById("taxCodes-table-body").appendChild(row);
    });
  }
  await populateTaxCodesTable();
}
