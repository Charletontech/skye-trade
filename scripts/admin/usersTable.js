import { QuestZender, toast, url } from "../utils.js";
import { toggleModal } from "./admin-utils.js";
export default async function usersTableLogic() {
  // FETCH ALL USERS FROM SERVER
  async function fetchUsersData() {
    return new Promise(async (resolve, reject) => {
      await QuestZender(url() + "/admin/all-users", "GET")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          //   console.log("Success:", data);
          resolve(data.data);
        })
        .catch((error) => {
          reject(error);
          console.error("Error:", error);
        });
    });
  }

  // Populate Users table
  async function populateUsersTable() {
    const users = await fetchUsersData();
    const userTableBody = document.getElementById("user-table-body");
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.userId}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.username}</td>
        <td>${user.phone}</td>
        <td>${user.balance}</td>
        <td>${user.gender}</td>
        <td>${user.accountType}</td>
        <td>${user.country}</td>
        <td>${user.currency}</td>
        <td><button class="button editUserBtn"  data-username="${user.username}" data-userid="${user.userId}">Edit</button></td>
      `;
      userTableBody.appendChild(row);
    });
  }
  await populateUsersTable();

  //   ATTACH EVENT LISTENERS TO EACH EDIT BUTTON
  let userId;
  const editUserBtns = document.querySelectorAll(".editUserBtn");
  editUserBtns.forEach((editUserBtn) => {
    editUserBtn.addEventListener("click", (e) => {
      const username = editUserBtn.dataset.username;
      userId = editUserBtn.dataset.userid;
      document.querySelector("#edit-user-modal-content b").innerText = username;
      toggleModal();
    });
  });

  //   control edit user form inputs display
  const formContent = document.querySelector(".form-content");
  const editTypeInput = document.getElementById("editTypeInput");
  editTypeInput.addEventListener("change", () => {
    if (
      editTypeInput.value === "credit" ||
      editTypeInput.value === "debit" ||
      editTypeInput.value === "reset"
    ) {
      const div = document.createElement("div");
      div.classList.add("form-group");
      div.innerHTML = `
               <div class="form-group">
                      <label>Amount</label>
                      <input type="number" name="amount" />
                    </div>
              `;
      formContent.appendChild(div);

      //   remove previous content
      if (formContent.children.length > 2) {
        formContent.removeChild(document.querySelectorAll(".form-group")[1]);
      }
    } else {
      const div = document.createElement("div");
      div.classList.add("form-group");
      div.innerHTML = `
                <div class="form-group">
                  <label>Select New Account Type</label>
                  <select name="accountType" required>
                    <option value="">--Select Account Type--</option>
                    <option value="Standard Account">Standard Account</option>
                    <option value="ECN Account">ECN Account</option>
                    <option value="Pro Account">Pro Account</option>
                  </select>
                </div>
              `;
      formContent.appendChild(div);
      //   remove previous content
      if (formContent.children.length > 2) {
        formContent.removeChild(document.querySelectorAll(".form-group")[1]);
      }
    }
  });

  //   HANDLE SUBMIT EDIT REQUEST
  const editUserForm = document.getElementById("edit-user-form");
  editUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {};
    const formData = new FormData(editUserForm);
    formData.entries().forEach((each) => {
      payload[`${each[0]}`] = each[1];
    });

    const response = await QuestZender(
      url() + `/admin/edit-user/${userId}`,
      "PUT",
      JSON.stringify(payload)
    );

    const message = await response.json();
    if (response.ok) {
      toast("success", "Success", message.data);
      return;
    }

    toast("error", "Error", message.error);
  });

  //   return user data so it can be used in other files
  return await fetchUsersData();
}
