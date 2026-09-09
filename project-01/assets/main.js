$(document).ready(function () {
    $("button.mbMenu").click(function(){
        $(".menu").toggleClass("active");
      });
      $(".btnClose").click(function(){
        $(".menu").toggleClass("active");
      });

    $('.tsSliderContainer').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
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

    $('.logoSlider').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 520,
            settings: {
                slidesToShow: 3
            }
        }]
    });

    $('.tabcontentWrapper').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: false,
        draggable: false,
        asNavFor: '.tabsList'
    });
    $('.tabsList').slick({
        slidesToShow: 6,
        arrows: false,
        asNavFor: '.tabcontentWrapper',
        draggable: false,
        focusOnSelect: true
    });


    $('.portfolioSlider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: false,
        draggable: false,
        dots: true,
        focusOnSelect: true
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
