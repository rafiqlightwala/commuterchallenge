document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll('.slider-image');
  let currentImageIndex = 0;

  function changeImage() {
    images.forEach(img => img.classList.remove('active'));
    images[currentImageIndex].classList.add('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
  }

  setInterval(changeImage, 3000); // Change image every 3 seconds
  changeImage(); // Initialize first image
});
