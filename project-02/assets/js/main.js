$(document).ready(function () {
    $("button.mbMenu").click(function(){
        $(".menu").toggleClass("active");
      });
      $(".btnClose").click(function(){
        $(".menu").toggleClass("active");
      });


      $('.featuredSlider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: true,
        draggable: false,
        dots: false,
        focusOnSelect: true
    });

    $('.testimonialSlider').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1
            }
        }, {
            breakpoint: 520,
            settings: {
                slidesToShow: 1
            }
        }]
    });

    $('.tabcontentWrapper').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: false,
        draggable: false,
        accessibility: false,
        swipe:false,
        touchMove:false,
        asNavFor: '.tabs'
    });
    $('.tabs').slick({
        slidesToShow: 2,
        arrows: false,
        asNavFor: '.tabcontentWrapper',
        draggable: false,
        accessibility: false,
        swipe:false,
        touchMove:false,
        focusOnSelect: true
    });
    
    $(".ddIcon").click(function(event){
        $(this).next(".subMenu").toggleClass("open");
      });

      $(window).resize(function() {
        if ($(window).width() > 1199) {
          $(".submenu").hide();
        }
      });

});

$(window).scroll(function(){
    if ($(window).scrollTop() >= 200) {
        $('header').addClass('fixed-header');
    }
    else {
        $('header').removeClass('fixed-header');
    }
});
