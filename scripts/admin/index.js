import usersTableLogic from "./usersTable.js";
import manageTrades from "./manageTrades.js";
import kycTable from "./kycTable.js";
import withdrawalTable from "./withdrawalTable.js";
import taxCodesTable from "./taxCodes.js";
import composeMail from "./composeMail.js";
window.addEventListener("DOMContentLoaded", async () => {
  // execute users table logic && also get user data
  const userData = await usersTableLogic();
  // execute manage trades logic
  manageTrades();
  // execute logic for KYC table
  kycTable();
  // execute logic for withdrawal table
  withdrawalTable();
  // execute logic for tax codes table
  taxCodesTable();
  // execute logic for composeMail
  composeMail();
});
