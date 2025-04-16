// Get elements
const modal = document.getElementById("video-modal");
const btn = document.getElementById("watch-video-btn");
const closeBtn = document.querySelector(".close");
const iframe = document.getElementById("youtube-video");

// Store original video URL
const videoSrc = iframe.src;
iframe.src = "";

// Open modal
btn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  iframe.src = videoSrc; // Set src when opening
});

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
    image: "assets/3.png",
    text: "I love the the way they are reliable and consistent. Been investing with them for a year now and so far its been great!",
    name: "Jane Smith",
    username: "@janesmith",
  },
  {
    image: "assets/2.png",
    text: "My finances have greatly improved since i started investing with SkyTrade. Highly recommended!",
    name: "David Lee",
    username: "@davidlee",
  },
  {
    image: "assets/1.png",
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
