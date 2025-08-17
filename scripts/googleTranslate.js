// INITIALIZE GOOGLE TRANSLATE
function googleTranslateElementInit2() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      autoDisplay: false,
    },
    "google_translate_element2"
  );
}

window.addEventListener("DOMContentLoaded", () => {
  const defaultFlag = document.querySelector(".defaultFlag");
  // Force page to load in English
  setGoogTransCookie("en");
  doGTranslate("en|en", "gb");

  function setGoogTransCookie(lang) {
    document.cookie = "googtrans=/en/" + lang + "; path=/";
    document.cookie =
      "googtrans=/en/" + lang + "; path=/; domain=" + window.location.hostname;
  }

  // LOGIC FOR LANGUAGE TRANSLATE DROPDOWN
  const translateBtn = document.querySelector(".translate-btn");
  translateBtn.addEventListener("click", toggleDropdown);
  function toggleDropdown() {
    const menu = document.getElementById("language-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }

  // LOGIC FOR LANGUAGE SELECTION (MENU ITEMS)
  const menuItems = document.querySelectorAll(".dropdown-content div");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const langCode = this.getAttribute("data-code");
      const flagCode = this.getAttribute("data-flag");
      doGTranslate(langCode, flagCode);
    });
  });

  function doGTranslate(langPair, code) {
    if (langPair === "") return;
    // construct flag url
    var url = `https://flagcdn.com/w40/${code}.png`;
    defaultFlag.src = url;

    // select language
    var lang = langPair.split("|")[1];
    var select = document.querySelector("select.goog-te-combo");
    if (!select) {
      setTimeout(function () {
        doGTranslate(langPair, code);
      }, 500);
    } else {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      document.getElementById("language-menu").style.display = "none";
    }
  }
});
