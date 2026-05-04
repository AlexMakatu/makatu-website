document.addEventListener("DOMContentLoaded", function () {
    // Get all slides
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0; // Start at the first slide

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });

        console.log(`Showing slide ${index + 1}/${slides.length}`); // Debugging

        // Check if it's Slide 6 (index 5) to initialize/reset the carousel
        if (index === 5) {
            console.log('Entering Slide 6: Initializing Carousel');
            currentCarouselItem = 0; // Reset carousel to the first item
            showCarouselItem(currentCarouselItem);
        }
    }

    // ✅ Attach nextSlide and previousSlide to window so buttons work
    window.nextSlide = function () {
        console.log("nextSlide() called!");
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    window.previousSlide = function () {
        console.log("previousSlide() called!");
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    // Attach navigation buttons
    document.querySelector("#next-button")?.addEventListener("click", nextSlide);
    document.querySelector("#previous-button")?.addEventListener("click", previousSlide);

    // Specific for Carousel in #slide6
    const carouselItems = document.querySelectorAll('#slide6-carousel .carousel-item');
    let currentCarouselItem = 0;

    function showCarouselItem(index) {
        carouselItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
            item.style.display = i === index ? 'block' : 'none';
        });

        console.log(`Carousel Item ${index + 1} is now active`);
    }

    window.nextCarouselItem = function () {
        console.log("nextCarouselItem() called!");
        currentCarouselItem = (currentCarouselItem + 1) % carouselItems.length;
        showCarouselItem(currentCarouselItem);
    };

    window.previousCarouselItem = function () {
        console.log("previousCarouselItem() called!");
        currentCarouselItem = (currentCarouselItem - 1 + carouselItems.length) % carouselItems.length;
        showCarouselItem(currentCarouselItem);
    };

    // Attach carousel navigation buttons
    document.querySelector("#carousel-prev")?.addEventListener("click", previousCarouselItem);
    document.querySelector("#carousel-next")?.addEventListener("click", nextCarouselItem);

    // Debugging helper: Log all carousel items to check DOM structure
    console.log('Carousel Items:', carouselItems);
    carouselItems.forEach((item, index) => {
        console.log(`Carousel Item ${index + 1}:`, item);
    });

    // Show the first slide on page load
    showSlide(currentSlide);
});
