(function ($) {
    var defaults = {
            width: 'auto',
            height: 400,
            transitionDuration: 500,
            autoPlayDuration: 5000
        },
        settings, container, viewport, slidesContainer, slides, slideW, slideH, totalSlides,
        currentSlide = 1;

    var prepareStage = function () {
            viewport.css({
                'width': slideW,
                'height': slideH
            });

            slidesContainer.css({
                'width': slideW * totalSlides
            });

            slides.css({
                'width': slideW
            });
        },
        cloneSlides = function () {
            slides.first().clone().addClass('first-slide').appendTo(slidesContainer);
            slides.last().clone().addClass('last-slide').prependTo(slidesContainer);
        },
        normalizeWindowW = function () {
            var windowW = $(window).width();
            return windowW;
            if (window.navigator.userAgent.indexOf('Macintosh') != -1) {
                windowW += 15;
            }
        },
        setupControls = function () {
            var slideNav = $('<div class="xs-slider-nav"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>');
            viewport.append(slideNav);

            slideNav.find('a').on('click', function () {
                if ($(this).hasClass('prev')) {
                    currentSlide -= 1;

                } else {
                    currentSlide += 1;
                }
                moveStage();
            });
        },
        moveStage = function () {
            var distance = -(currentSlide * slideW);
            slidesContainer.transit({
                x: distance
            }, settings.transitionDuration, function () {
                if (currentSlide == totalSlides - 1) {
                    jumpToSlide(1);
                }
                if (currentSlide == 0) {
                    jumpToSlide(totalSlides - 2);
                }
            });
        },
        jumpToSlide = function (pos) {
            currentSlide = pos || currentSlide;
            var distance = -(currentSlide * slideW);

            slidesContainer.transit({
                x: distance
            }, 0);
        },
        initTouchEvents = function () {
            var longTouch = false,
                touchStartX, touchMoveX, moveX;

            slidesContainer.on('touchstart', function (event) {
                window.setTimeout(function () {
                    longTouch = true;
                }, 250);
                touchStartX = event.originalEvent.touches[0].pageX;
            });

            slidesContainer.on('touchmove', function (event) {
                touchMoveX = event.originalEvent.touches[0].pageX;
                moveX = currentSlide * slideW + (touchStartX - touchMoveX);
                var panX = 100 - moveX / 6;

                slidesContainer.css('transform', 'translate(-' + moveX + 'px,0,0)');
            });
            slidesContainer.on('touchend', function (event) {
                var absMove = Math.abs(currentSlide * slideW - moveX);
                if (absMove > slideW / 6 || longTouch === false) {
                    if ((moveX > currentSlide * slideW)) {
                        currentSlide++;
                    } else if ((moveX < currentSlide * slideW)) {
                        currentSlide--;
                    }
                }
                moveStage();
            });
        },
        init = function (element) {
            container = element;
            viewport = element.find('.viewport');
            slidesContainer = element.find('.slides-container');

            slides = element.find('.slide');
            cloneSlides();
            slides = element.find('.slide');
            slideW = (settings.width == 'auto') ? normalizeWindowW() : settings.width;
            slideH = settings.height;
            totalSlides = slides.length;

            prepareStage();
            setupControls();
            jumpToSlide();
            initTouchEvents();

            $(window).on('resize', function () {
                window.setTimeout(function () {
                    slideW = (settings.width == 'auto') ? normalizeWindowW() : settings.width;
                    prepareStage();
                    jumpToSlide();
                }, 200);
            }).trigger('resize');
        }

    $.fn.xsSlider = function (options) {
        settings = $.extend(true, defaults, options);

        init(this);
    }
}(jQuery));

$('.xs-slider').xsSlider();