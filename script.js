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
    image:
      "https://superglobaltrade.com/uploads/testimonies/thumb/998bbc715738adbee6391aa77185ed78.jpg",
    text: "I love the way the platform is very easy to use, no complicated UI. its user friendly. Totally amazing!",
    name: "Micheal Reeves",
    username: "@michealreeves",
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
  "Dirk from AUSTRALIA has just earned $19,046",
  "Angela from NIGERIA has just earned $12,320",
  "Carlos from BRAZIL has just earned $8,750",
  "Leila from UAE has just earned $15,100",
  "John from UK has just earned $10,200",
  "Fatima from EGYPT has just earned $11,987",
  "Ivan from RUSSIA has just earned $13,300",
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
