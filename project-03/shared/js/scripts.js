$(function () {
  // Load shared header and footer
  $("#header").load("shared/header.html");
  $("#footer").load("shared/footer.html");

  // Toggle navigation menu
  $(document).on("click", ".menu-toggle, .menuCloseBtn", function () {
    $(".navigation").toggleClass("active");
  });

  // Handle popup open and close
  $(document).on("click", ".popupLink, .popup-overlay, .popupCloseBtn", function (event) {
    if ($(event.target).is(".popupLink")) {
      $(".popup-overlay").fadeIn(200);
    } else if ($(event.target).is(".popup-overlay, .popupCloseBtn")) {
      $(".popup-overlay").fadeOut(200);
    }
  });

  // Initialize slick slider
  $(".featuredSlider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    dots: true,
    focusOnChange: true,
  });
});
