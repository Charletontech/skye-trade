import { QuestZender, toast, url } from "../utils.js";

export default async function composeMail() {
  // widget for Quill editor
  const quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write your email message here...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ align: [] }],
        [{ list: "bullet" }, { list: "ordered" }],
        ["clean"],
        [{ header: [1, 2, 3, false] }],
      ],
    },
  });

  //   handle the form submission
  const sendBtn = document.getElementById("sendBtn");
  document
    .getElementById("emailForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      let isValid = true;
      const fields = ["heading", "greeting", "recipient"];

      fields.forEach((field) => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          input.style.border = "1px solid red"; // Highlight missing fields
          isValid = false;
        } else {
          input.style.border = "1px solid #ccc"; // Reset border if valid
        }
      });

      if (!isValid) {
        toast("info", "Missing fields", "Please fill in all required fields.");
        return;
      }

      if (quill.getText().trim().length === 0) {
        document.getElementById("editor").style.border = "1px solid red"; // Highlight editor
        toast("info", "Missing fields", "Message field cannot be empty.");
        return;
      }

      //   prevent multiple submissions
      sendBtn.disabled = true;
      sendBtn.innerHTML = "Sending...";

      // Simulated API submission
      const formData = {
        heading: document.getElementById("heading").value,
        greeting: document.getElementById("greeting").value,
        recipient: document.getElementById("recipient").value,
        message: quill.root.innerHTML,
      };

      console.log(formData.message);

      try {
        const response = await QuestZender(
          url() + "/admin/email-service",
          "POST",
          JSON.stringify(formData)
        );
        const message = await response.json();
        if (response.ok) {
          toast("success", "Mail Sent!", message.data);
          return;
        }
        toast("error", "Failed to send mail...", message.error);
        console.error("Error sending email:", message.error);
      } catch (error) {
        console.log(error);
      } finally {
        // reset the button after submission
        sendBtn.disabled = false;
        sendBtn.innerHTML = "Send Email";
        this.reset();
      }
    });
}
