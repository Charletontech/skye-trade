// LOGIC TO TOGGLE MENU
function toggleMenuBtn() {
  document.querySelector(".nav-links").classList.toggle("show-nav-links");
}

// LOGIC FOR CAROUSEL
document.addEventListener("DOMContentLoaded", function () {
  const textContentElement = document.querySelector(".text-content");
  const headingElement = textContentElement.querySelector("h1");
  const paragraphElement = textContentElement.querySelector("p");
  const heroImageElement = document.getElementById("heroImage");
  const heroImageContentElement = document.getElementById("hero-image-content");
  // heroImageElement.src = "./assets/arrow.png"; // Set initial image source
  const writeUpsAndImages = [
    {
      heading:
        'Invest Your Money<br>With <span class="highlight">Higher Return</span>',
      paragraph:
        "Anyone can invest money into different currencies to increase their earnings through online trading.",
      imageSrc: "./assets/arrow2.png",
    },
    {
      heading:
        'Grow Your Savings<br>Unlock Financial <span class="highlight">Freedom</span>',
      paragraph:
        "Start building your future with smart investments and achieve your financial goals.",
      imageSrc: "./assets/computer.png",
    },
    {
      heading:
        'Secure Your Future<br>Invest <span class="highlight">Wisely</span> Today',
      paragraph:
        "Explore diverse investment opportunities for long-term growth and stability.",
      imageSrc: "./assets/arrow-and-coin.png",
    },
    {
      heading:
        'Maximize Your Returns<br>Discover Smart <span class="highlight">Trading</span>',
      paragraph:
        "Learn how our platform can help you amplify your earnings through intelligent online trading tools.",
      imageSrc: "./assets/arrow2.png",
    },
    {
      heading:
        'Build Your Wealth<br>Accessible Investment <span class="highlight">Options</span>',
      paragraph:
        "Empowering everyone to participate in the financial markets with user-friendly and accessible investment solutions.",
      imageSrc: "./assets/computer.png",
    },
  ];
  let currentIndex = 0;
  const changeInterval = 5000;

  function updateContent() {
    // 1. Fade out and slide up the current text
    textContentElement.classList.add("fade-out-slide-up");
    // 2. Slide out the current image (optional fade out can be added in CSS)
    heroImageElement.classList.remove("slide-in");

    setTimeout(() => {
      const currentContent = writeUpsAndImages[currentIndex];
      headingElement.innerHTML = currentContent.heading;
      paragraphElement.textContent = currentContent.paragraph;
      heroImageElement.src = currentContent.imageSrc;

      // Remove the fade-out class and add the fade-in class for text
      textContentElement.classList.remove("fade-out-slide-up");
      textContentElement.classList.add("fade-in-slide-down");
      // Slide in the new image
      heroImageElement.classList.add("slide-in");

      currentIndex = (currentIndex + 1) % writeUpsAndImages.length;

      // After the fade-in for text, remove the class
      setTimeout(() => {
        textContentElement.classList.remove("fade-in-slide-down");
      }, 500);
    }, 500);
  }

  // Initial call to set the first content (without animation)
  const initialContent = writeUpsAndImages[currentIndex];
  headingElement.innerHTML = initialContent.heading;
  paragraphElement.textContent = initialContent.paragraph;
  heroImageElement.src = initialContent.imageSrc;
  currentIndex = (currentIndex + 1) % writeUpsAndImages.length;

  // Set the interval for changing the content
  setInterval(updateContent, changeInterval);
});

// Get elements
const modal = document.getElementById("video-modal");
const watchVideoBtn = document.getElementById("watch-video-btn");
const playButton = document.querySelector(".play-button");
const closeBtn = document.querySelector(".close");
const iframe = document.getElementById("youtube-video");

// Store original video URL
const videoSrc = iframe.src;
iframe.src = "";

watchVideoBtn.addEventListener("click", openModal);
playButton.addEventListener("click", openModal);
// Open modal
function openModal(e) {
  console.log("first");
  e.preventDefault();
  modal.style.display = "flex";
  iframe.src = videoSrc; // Set src when opening
}

// Close modal
function closeModal() {
  modal.style.display = "none";
  iframe.src = ""; // Remove src to stop video
}

closeBtn.addEventListener("click", closeModal);

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// LOGIC FOR TESTIMONIALS SECTION
const testimonials = [
  {
    image:
      "https://superglobaltrade.com/uploads/testimonies/thumb/20aab71f88a53b30534b49407b1e61b4.jpg",
    text: "I love the the way they are reliable and consistent. Been investing with them for a year now and so far its been great!",
    name: "Jane Smith",
    username: "@janesmith",
  },
  {
    image:
      "https://superglobaltrade.com/uploads/testimonies/thumb/689098d009df1575c9e35c237e701927.jpg",
    text: "My finances have greatly improved since i started investing with SkyTrade. Highly recommended!",
    name: "David Lee",
    username: "@davidlee",
  },
  {
    image: "./assets/2.png",
    text: "I love the way the platform is very easy to use, no complicated UI. its user friendly. Totally amazing!",
    name: "Micheal Reeves",
    username: "@michealreeves",
  },
  {
    image:
      "https://superglobaltrade.com/uploads/testimonies/thumb/47cbbfcf351a84a2c74ba853146d9713.jpg",
    text: "I want to say a big thank you to SkyeTrade. Just got my profit of $7500 in my Bank account. This is indeed a trust worthy platform to invest",
    name: "Carly Phoebe",
    username: "@CarlyPhoebe11",
  },
  {
    image:
      "https://superglobaltrade.com/uploads/testimonies/thumb/998bbc715738adbee6391aa77185ed78.jpg",
    text: "Am Allen from North Carolina, Currently living in Arizona with my Family, i came across SkyeTrade while browsing through facebook, I accessed the site and contact them via whatsapp and i started investing with $5000 and am making $51,560.00 Weekly.",
    name: "Allen Brewer",
    username: "@allenbrewer02",
  },
];

let currentIndex = 0;

function changeTestimonial() {
  const currentTestimonial = testimonials[currentIndex];
  document.getElementById("testimonial-image").src = currentTestimonial.image;
  document.getElementById("testimonial-text").textContent =
    currentTestimonial.text;
  document.getElementById("author-name").textContent = currentTestimonial.name;
  document.getElementById("author-username").textContent =
    currentTestimonial.username;

  currentIndex = (currentIndex + 1) % testimonials.length;
}

setInterval(changeTestimonial, 5000);

// LOGIC FOR ALERT POP UP
const alerts = [
  "Catalina from MEXICO has just earned $12,320",
  "Carlos from BRAZIL has just earned $8,750",
  "Leila from UAE has just earned $15,100",
  "John from UK has just earned $10,200",
  "Micheal from CANADA has just earned $13,240",
  "Louis from LUXEMBOURG has just earned $9,040",
  "Dirk from AUSTRALIA has just earned $19,046",
  "Ahmed from EGYPT has just earned $11,987",
  "Muller from NETHERLANDS has just earned $11,987",
  "Ivan from RUSSIA has just earned $13,300",
  "Sofia from SWEDEN has just earned $14,500",
  "Liam from USA has just earned $20,000",
  "Emma from ITALY has just earned $18,500",
  "Olivia from USA has just earned $17,000",
];

function showAlert() {
  const alertBox = document.getElementById("earning-alert");
  const messageEl = document.getElementById("alert-message");

  // Random message
  const randomMessage = alerts[Math.floor(Math.random() * alerts.length)];
  messageEl.textContent = randomMessage;

  // Show alert
  alertBox.classList.remove("hidden");

  // Hide after 5 seconds
  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 5000);
}

// Random interval between 10 and 15 seconds
function randomInterval(min = 10000, max = 15000) {
  return Math.floor(Math.random() * (max - min) + min);
}

function triggerAlertsLoop() {
  showAlert();
  setTimeout(triggerAlertsLoop, randomInterval());
}

// Start the loop after a short delay
setTimeout(triggerAlertsLoop, 5000);

// LOGIC FOR FAQ SECTION
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    // Toggle the 'active' class on the question
    question.classList.toggle("active");
    // Toggle the 'open' class on the answer to show/hide it
    answer.classList.toggle("open");

    // Close other open answers (optional, for accordion effect)
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        const otherQuestion = otherItem.querySelector(".faq-question");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        otherQuestion.classList.remove("active");
        otherAnswer.classList.remove("open");
      }
    });
  });
});

// HOW IT WORKS SECTION ANIMATION
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.5,
  }
);

document.querySelectorAll(".animated-step").forEach((el) => {
  observer.observe(el);
});
