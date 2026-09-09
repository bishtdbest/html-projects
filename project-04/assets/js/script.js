// script.js
$(document).ready(function() {
    // Cache frequently used selectors
    const $window = $(window);
    const $document = $(document);
    const $body = $('body');
    const $header = $('.header');
    
    // Use passive event listeners for scroll events
    let ticking = false;
    
    function updateHeader() {
        if ($window.scrollTop() > 85) {
            $header.addClass('header--scrolled');
        } else {
            $header.removeClass('header--scrolled');
        }
        ticking = false;
    }
    
    $window.on('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Use modern event delegation and reduce DOM queries
    $(".menu-btn").on("click", function () {
        $(this).toggleClass("active");
        $(".header__nav").toggleClass("open");
        
        $(".menu_copilot").slideUp();
        $(".dropdown-toggle").removeClass("active");
        $("body").toggleClass("menu-open"); // prevent background scroll (optional)
    });

    $(".dropdown-toggle").on("click", function () {
        $(this).toggleClass("active");
        $(this).next(".menu_copilot").slideToggle();
    });

    $(".select-trigger").click(function(e){
        e.stopPropagation();
        $(".options").slideToggle(150);
        $(this).toggleClass("active");
    });

    $(".options li").click(function(){
        var selectedText = $(this).text();
        var selectedValue = $(this).data("lang");

        $(".select-trigger").text(selectedText);
        $("#language").val(selectedValue);

        $(".options").slideUp(150);
    });

    // Lazy load slick slider when needed
    function initSlider() {
        if (typeof $.fn.slick !== 'undefined') {
            $(".brand-logoSlider").slick({
                slidesToShow: 9,
                slidesToScroll: 1,
                variableWidth: true,
                autoplay: true,
                arrows: false,
                lazyLoad: 'ondemand',
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: { slidesToShow: 7 }
                    },
                    {
                        breakpoint: 992,
                        settings: { slidesToShow: 5 }
                    },
                    {
                        breakpoint: 768,
                        settings: { slidesToShow: 4 }
                    },
                    {
                        breakpoint: 576,
                        settings: { slidesToShow: 3 }
                    }
                ]
            });
        }
    }
    
    // Initialize slider when it's in viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initSlider();
                sliderObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const sliderElement = document.querySelector('.brand-logoSlider');
    if (sliderElement) {
        sliderObserver.observe(sliderElement);
    }

    // Close dropdown if clicked outside
    $(document).click(function(){
        $(".options").slideUp(150);
        $(".select-trigger").removeClass("active");
    });

    $('.tab-links a').on('click', function (e) {
        e.preventDefault();
        var target = $(this).attr('href');

        // Remove active classes
        $('.tab-links li, .tab-content .tab').removeClass('active');

        // Add active class to clicked tab
        $(this).parent().addClass('active');
        $(target).addClass('active');
    });
    
    // FAQ accordion functionality
    $('.faq__question').on('click keypress', function(e) {
        if (e.type === 'click' || (e.type === 'keypress' && e.key === 'Enter')) {
            const $this = $(this);
            const isExpanded = $this.attr('aria-expanded') === 'true';
            $this.attr('aria-expanded', !isExpanded);
            $this.next('.faq__answer').slideToggle(300);
        }
    });

    // Initialize slick slider
    $(".testimonial").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        prevArrow:'<button type="button" class="slick-prev" aria-label="Previous"><img src="assets/images/icon-arrow-right.svg" alt="Previous"></button>',
        nextArrow:'<button type="button" class="slick-next" aria-label="Next"><img src="assets/images/icon-arrow-right.svg" alt="Next"></button>'
    });

    $('.testimonial').find('.slick-prev, .slick-next').wrapAll('<div class="slick-arrows-wrapper"></div>');

    $('.show-hubspot-meetings').on('click', function() {
        $('.meetings-iframe-wrapper').addClass('show');
    });

    $('.hide-hubspot-meetings').on('click', function() {
        $('.meetings-iframe-wrapper').removeClass('show');
    });


    // Pilot Pack Modal functionality
    $('.download-pilot-pack').on('click', function(e) {
        e.preventDefault();
        $('#pilotPackModal').addClass('show');
        $('body').addClass('modal-open');
    });

    // Close modal functionality
    $('.pilot-pack-close, .pilot-pack-modal').on('click', function(e) {
        if (e.target === this) {
            closePilotPackModal();
        }
    });

    // Prevent modal from closing when clicking inside the content
    $('.pilot-pack-modal-content').on('click', function(e) {
        e.stopPropagation();
    });

    // Close modal with ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#pilotPackModal').hasClass('show')) {
            closePilotPackModal();
        }
    });

    function closePilotPackModal() {
        $('#pilotPackModal').removeClass('show');
        $('body').removeClass('modal-open');
        // Reset form after closing
        setTimeout(function() {
            resetPilotPackForm();
        }, 300);
    }

    function resetPilotPackForm() {
        $('#pilotPackForm')[0].reset();
        $('.error-msg').removeClass('show');
        $('.form-group input').removeClass('error');
        $('#successMessage').hide();
        $('#pilotPackForm').show();
    }

    // Initialize Country Selector
    const countrySelector = new CountrySelector('#countrySelector', {
        defaultCountry: 'DE',
        hiddenInputName: 'countryCode',
        onSelect: function(country) {
            // Optional callback when country is selected
            console.log('Selected country:', country);
        }
    });

    // Real-time validation on input
    $('#fullName').on('input blur', function() {
        validateFullName();
    });

    $('#phone').on('input blur', function() {
        validatePhone();
    });

    $('#email').on('input blur', function() {
        validateEmail();
    });

    // Individual field validation functions
    function validateFullName() {
        const value = $('#fullName').val().trim();
        clearFieldError('fullName');
        
        if (!value) {
            showFieldError('fullName', 'Please enter your full name.');
            return false;
        }
        return true;
    }

    function validatePhone() {
        const value = $('#phone').val().trim();
        const phoneContainer = $('.phone-input-container');
        
        // Clear previous error state
        phoneContainer.removeClass('error');
        clearFieldError('phone');
        
        if (!value) {
            phoneContainer.addClass('error');
            showFieldError('phone', 'Please enter your phone number.');
            return false;
        } else if (!isValidPhone(value)) {
            phoneContainer.addClass('error');
            showFieldError('phone', 'Please enter a valid phone number.');
            return false;
        }
        return true;
    }

    function validateEmail() {
        const value = $('#email').val().trim();
        clearFieldError('email');
        
        if (!value) {
            showFieldError('email', 'Please enter your email address.');
            return false;
        } else if (!isValidEmail(value)) {
            showFieldError('email', 'Please enter a valid email address.');
            return false;
        }
        return true;
    }

    // Form validation and submission
    $('#pilotPackForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear all previous errors
        $('.error-msg').removeClass('show');
        $('.form-group input').removeClass('error');

        // Validate all fields
        const isFullNameValid = validateFullName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();

        const isValid = isFullNameValid && isPhoneValid && isEmailValid;

        if (isValid) {
            const countryCode = $('input[name="countryCode"]').val();
            const formData = {
                fullName: $('#fullName').val().trim(),
                phone: $('#phone').val().trim(),
                countryCode: countryCode,
                email: $('#email').val().trim(),
                companyName: $('#companyName').val().trim(),
                Term: ['']
            };

            // Disable submit button
            $('.pilot-pack-submit-btn').prop('disabled', true).text('Submitting...');
            
            // Send form data to backend
            submitPilotPackForm(formData);
        }
    });

    function showFieldError(fieldName, message) {
        $('#' + fieldName).addClass('error');
        $('#' + fieldName + 'Error').text(message).addClass('show');
    }

    function clearFieldError(fieldName) {
        $('#' + fieldName).removeClass('error');
        $('#' + fieldName + 'Error').removeClass('show');
    }

    function isValidPhone(phone) {
        // Remove all non-digit characters and check if it's a valid phone length (7-15 digits for international numbers)
        const phoneDigits = phone.replace(/\D/g, '');
        return phoneDigits.length >= 7 && phoneDigits.length <= 15;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function submitPilotPackForm(formData) {
        $.ajax({
            url: "https://aunjlali04.execute-api.eu-central-1.amazonaws.com/dev/sendmail",
            type: "POST",
            data: JSON.stringify({
                "toEmail": ["ashish@buildtwin.com", "bishtdbest.frnds.2009@gmail.com"],
                "from": "noreply@buildtwin.com",
                "subject": "Pilot Pack Request",
                'ignoreField': ['Term'],
                "formField": {
                    "fullName": formData.fullName,
                    "phone": formData.countryCode + formData.phone,
                    "email": formData.email,
                    "companyName": formData.companyName
                },
                "files": []
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            beforeSend: function() {
                $("body").prepend('<div class="loading"></div>');
            },
            success: function (result) {
                $(".loading").remove();
                // Show success message instead of redirect for modal context
                showSuccessMessage();
                // Re-enable submit button
                $('.pilot-pack-submit-btn').prop('disabled', false).text('Submit');
            },
            error: function(xhr, status, error) {
                $(".loading").remove();
                console.error('Error:', error);
                // Show error message or fallback to success for demo
                showSuccessMessage();
                // Re-enable submit button
                $('.pilot-pack-submit-btn').prop('disabled', false).text('Submit');
            }
        });
    }

    function showSuccessMessage() {
        // $('#pilotPackForm').hide();
        // $('#successMessage').show();
        const win = window.open('https://www.google.com', '_blank', 'noopener,noreferrer');
        // if (!win) window.location.href = 'https://www.google.com';
        // Auto close modal after 3 seconds
        setTimeout(function() {
            closePilotPackModal();
        }, 1000);
    }

    $(document).on('click', '.scroll-link', function(e) {
        e.preventDefault();

        var target = $(this).attr('href');
        var headerHeight = $('.header').outerHeight() || 0;

        if ($(target).length) {
            $('html, body').animate({
                scrollTop: $(target).offset().top - headerHeight
            }, 800);
        }
    });

    $(document).on('click', '.arcade-video-trigger', function(e) {
        e.preventDefault();
        $('.arcade-demo').toggleClass('visible');
    });

});