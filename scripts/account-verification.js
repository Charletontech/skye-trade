import { QuestZender, toast, url } from "./utils.js";

export function showNotLoggedModal() {
  const notLoggedDisplay = document.querySelector(".notLoggedCont");
  notLoggedDisplay.classList.add("showNotLogged");
}

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
    const { fullName, phone } = data.data;
    const username = document.querySelector(".username");
    username.innerText = fullName;
  });

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("idFile");
    const docType = document.getElementById("docType").value;

    if (!fileInput.files.length || !docType) {
      alert("Please select a file and document type.");
      return;
    }

    const authRaw = localStorage.getItem("auth");
    const auth = authRaw ? JSON.parse(authRaw) : null;
    if (!auth || !auth.token) {
      toast("info", "Login needed!", "You must be logged in to upload an ID.");
      return;
    }

    const formData = new FormData();
    formData.append("idFile", fileInput.files[0]);
    formData.append("docType", docType);

    try {
      const response = await QuestZender(
        url() + "/dashboard/upload-id",
        "POST",
        formData,
        false,
        false
      );

      const message = await response.json();
      if (!response.ok) {
        toast("error", "Upload Failed!", message.error);
        throw new Error("Upload failed");
      }

      toast("success", "Upload Successful!", message.data);
      document.getElementById("uploadForm").reset();
    } catch (error) {
      console.error(error);
    }
  });
