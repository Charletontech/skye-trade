export function url() {
  return "https://skye-trade-server.onrender.com/api/v1";
}

export async function toast(icon, title, text) {
  let color;
  switch (icon) {
    case "success":
      color = "#18cb96";
      break;
    case "error":
      color = "#f27474";
      break;
    case "warning":
      color = "#f8bb86";
      break;
    case "info":
      color = "#3fc3ee";
      break;
    case "question":
      color = "#87adbd";
      break;
    default:
      color = "#87adbd";
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: color,
    customClass: { popup: "colored-toast" },
    showConfirmButton: false,
    timer: 7000,
    timerProgressBar: true,
  });

  return await Toast.fire({ icon, title, text });
}

export async function QuestZender(
  url,
  method,
  body = null,
  onUnauthorized = null,
  sendAsJSON = true
) {
  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (method !== "GET") {
    options.body = body;
  }

  if (sendAsJSON === true) {
    options.headers["Content-Type"] = "application/json";
  }

  // check if user is logged in and has auth token
  const authRaw = localStorage.getItem("auth");
  if (authRaw) {
    try {
      const auth = JSON.parse(authRaw);
      if (auth.token) {
        options.headers["Authorization"] = `Bearer ${auth.token}`;
      }
    } catch (err) {
      console.error("Invalid auth in localStorage:", err);
    }
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem("auth");
    if (typeof onUnauthorized === "function") {
      onUnauthorized();
    } else {
      window.location = "/login";
    }
  }

  return response;
}
