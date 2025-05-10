import usersTableLogic from "./usersTable.js";
import { toggleModal } from "./admin-utils.js";
window.addEventListener("DOMContentLoaded", async () => {
  // execute users table logic && also get user data
  const userData = await usersTableLogic();

  //   general cope functions
  const closeModal = document.getElementById("closeModal");
  closeModal.addEventListener("click", (e) => {
    toggleModal();
  });
});
