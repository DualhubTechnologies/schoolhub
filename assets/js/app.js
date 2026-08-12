{const e=()=>{document.documentElement.style.setProperty("--body-scroll-width",window.innerWidth-document.documentElement.clientWidth+"px")};window.addEventListener("resize",e),e()}{const e=()=>{setDarkMode(!isDarkMode());const e=isDarkMode();localStorage.setItem("darkMode",e?"1":"0")},t=e=>{e.checked=isDarkMode()};document.querySelectorAll("[data-darkmode-toggle] input, [data-darkmode-switch] input").forEach((o=>{o.addEventListener("change",e),t(o)}))}document.querySelectorAll(".uc-horizontal-scroll").forEach((e=>{e.addEventListener("wheel",(t=>{t.preventDefault(),e.scrollBy({left:t.deltaY,behavior:"smooth"})}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("[data-uc-backtotop]");if(!e)return;e.addEventListener("click",(e=>{e.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})}));let t=0;window.addEventListener("scroll",(()=>{const o=document.body.getBoundingClientRect().top;e.parentNode.classList.toggle("uc-active",o<=t),t=o}))}));

// Home Sliders
document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.getElementById("image-container");
  const dynamicImage = document.getElementById("dynamic-bg");
  // Get base URL from data attribute
  const baseUrl = imageContainer.getAttribute("data-base-url");
  const dynamicParts = [
    "Landing_Bg-01.png",
    "Landing_Bg-03.png",
    "Landing_Bg-02.png",
  ];
  const contentBlocks = [
    document.getElementById("section-one"),
    document.getElementById("section-two"),
    document.getElementById("section-three"),
  ];
  let currentIndex = 0;
  // Preload images
  dynamicParts.forEach((part) => {
    const img = new Image();
    img.src = baseUrl + part;
  });
  // Function to update both image and content
  const updateSlide = () => {
    // Start fading out both image and content
    dynamicImage.classList.add("hidden");
    contentBlocks[currentIndex].classList.add("hidden");
    // Wait for the fade-out transition
    setTimeout(() => {
      // Update the index for the next slide
      currentIndex = (currentIndex + 1) % dynamicParts.length;
      // Update image source and content visibility
      dynamicImage.src = baseUrl + dynamicParts[currentIndex];
      contentBlocks.forEach((block, index) => {
        block.classList.toggle("d-none", index !== currentIndex);
      });
      // Fade in the updated content and image
      dynamicImage.classList.remove("hidden");
      contentBlocks[currentIndex].classList.remove("hidden");
    }, 500); // Half of the total interval duration
  };
  // Initialize the first slide
  contentBlocks[currentIndex].classList.remove("d-none");
  // Set interval for automatic transitions
  setInterval(updateSlide, 8000);
});