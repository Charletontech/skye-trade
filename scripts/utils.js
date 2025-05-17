export function url() {
  return "http://localhost:5000/api/v1";
  // return "https://skye-trade-server.onrender.com/api/v1";
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

{
  /* <script>
      (function () {
        if (!window.chatbase || window.chatbase("getState") !== "initialized") {
          window.chatbase = (...arguments) => {
            if (!window.chatbase.q) {
              window.chatbase.q = [];
            }
            window.chatbase.q.push(arguments);
          };
          window.chatbase = new Proxy(window.chatbase, {
            get(target, prop) {
              if (prop === "q") {
                return target.q;
              }
              return (...args) => target(prop, ...args);
            },
          });
        }
        const onLoad = function () {
          const script = document.createElement("script");
          script.src = "https://www.chatbase.co/embed.min.js";
          script.id = "NYluvz8BJtpqHpSXkPfWM";
          script.domain = "www.chatbase.co";
          document.body.appendChild(script);
        };
        if (document.readyState === "complete") {
          onLoad();
        } else {
          window.addEventListener("load", onLoad);
        }
      })();
    </script> */
}
