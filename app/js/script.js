import { getCommuterModes } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
  // PhotoSlider Component
  const photoSlider = document.getElementById("photoSlider");
  const photos = [
    "img/photo1.jpg",
    "img/photo2.jpg",
    "img/photo3.jpg",
    "img/photo4.jpg",
    "img/photo5.jpg",
    "img/photo6.jpg",
    "img/photo7.jpg",
    "img/photo8.jpg",
    "img/photo10.jpg",
    "img/photo11.jpg",
    "img/photo13.jpg",
  ];

  // Function to preload images
  const preloadImages = () => {
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };

  let currentPhotoIndex = 0;

  const updateSlider = () => {
    photoSlider.innerHTML = `
        <div class="slide">
          <img src="${photos[currentPhotoIndex]}" alt="Photo ${
      currentPhotoIndex + 1
    }">
          <div class="slide-overlay">
            <p class="slide-text">
              <span class="challenge-text">ARE YOU READY FOR THE NEXT CHALLENGE?</span><br>
              <span class="date-text">June 2-8, 2024</span>
            </p>
            <button class="slide-button">REGISTER NOW!</button>
          </div>
        </div>
      `;
  };

  preloadImages();
  updateSlider();

  setInterval(() => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updateSlider();
  }, 3000);

  //IGNORE THE FOLLOWING LINE IT IS JUST CHECKING CODE
  fetchCommuterModes();
});

async function fetchCommuterModes() {
  try {
    const commuterModesArray = await getCommuterModes();
    console.log(commuterModesArray);
    // Now you can call setCommuterModesArray or any other logic you need
    // setCommuterModesArray(commuterModesArray);
  } catch (error) {
    console.error("Error fetching commuter modes:", error);
  }
}

window.openEventCreationForm = function () {
  window.open("event-creation.html", "_blank");
};
