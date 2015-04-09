var ceGallery = function (element) {
    'use strict';
    var container = 1,
        viewport,
        slidesContainer,
        slides,
        totalSlides,
        slideW,
        slideH = 227, /* use 'auto' for auto height*/
        currentSlide = 0,
        nav;

    function has3d() {
        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            };

        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }

    function prepareStage() {
        if (slideH =='auto'){
            slideH = slideW * 3 / 4
        }

        slides.width(slideW);
        slidesContainer.width(slideW * totalSlides).height(slideH);
        viewport.width(slideW).height(slideH).css({
            'overflow': 'hidden',
            '-ms-touch-action': 'none'
        });
    }

    function moveStage() {
        var distance = currentSlide * slideW,
            next = slidesContainer.find('.slide-' + (Math.abs(currentSlide) + 1)),
            next3 = null,
            img = null;

        for (var i = 3; i < Math.abs(currentSlide) + 3; i++) {
            next3 = slidesContainer.find('.slide-' + i + ' img');
            if (next3.length > 0 && next3.data('src')) {
                img = new Image();
                img.src = next3.data('src');
                img.onload = function () {
                    next3.prop('src', next3.data('src'));
                    next3.removeAttr('data-src');
                };
            }
        }

        if (next.length > 0 && next.hasClass('unloaded')) {
            next.removeClass('unloaded');
        }
        if (has3d()) {
            slidesContainer.css({
                webkitTransform: 'translate3d(' + distance + 'px,0,0)',
                mozTransform: 'translate3d(' + distance + 'px,0,0)',
                msTransform: 'translate3d(' + distance + 'px,0,0)',
                transform: 'translate3d(' + distance + 'px,0,0)'
            });
        } else {
            slidesContainer.animate({
                'margin-left': distance + 'px'
            }, 300);
        }

        if (Math.abs(currentSlide) === 0) {
            nav.find('.prev').addClass('hidden');
        } else {
            nav.find('.prev').removeClass('hidden');
        }
        if (Math.abs(currentSlide) === (totalSlides - 1)) {
            nav.find('.next').addClass('hidden');
        } else {
            nav.find('.next').removeClass('hidden');
        }
    }

    function bindTouchEvents() {
        var startX,
            currentX,
            moveDistance = currentSlide * slideW,
            element = slidesContainer.get(0);

        if (window.navigator.msPointerEnabled) {
            element.addEventListener("MSPointerDown", touchStart, false);
            element.addEventListener("MSPointerMove", touchMove, false);
            element.addEventListener("MSPointerUp", touchEnd, false);
        }
        element.addEventListener("touchstart", touchStart, false);
        element.addEventListener("touchmove", touchMove, false);
        element.addEventListener("touchend", touchEnd, false);

        function touchStart(e) {
            moveDistance = currentSlide * slideW;
            if (window.navigator.msPointerEnabled) {
                startX = e.pageX;
            } else {
                startX = e.changedTouches[0].pageX;
            }
            slidesContainer.addClass('touch-moving');
        }

        function touchMove(e) {
            if (window.navigator.msPointerEnabled) {
                currentX = e.pageX;
            } else {
                currentX = e.changedTouches[0].pageX;
            }
            if (Math.abs(currentX - startX) > 20) {
                e.preventDefault();
                if (currentX < startX) { // swipe left
                    moveDistance -= 5;
                } else {
                    moveDistance += 5;
                }
                slidesContainer.css({
                    webkitTransform: 'translate3d(' + moveDistance + 'px,0,0)',
                    mozTransform: 'translate3d(' + moveDistance + 'px,0,0)',
                    msTransform: 'translate3d(' + moveDistance + 'px,0,0)',
                    transform: 'translate3d(' + moveDistance + 'px,0,0)'
                });
            }

        }

        function touchEnd(e) {
            if (window.navigator.msPointerEnabled) {
                currentX = e.pageX;
            } else {
                currentX = e.changedTouches[0].pageX;
            }
            slidesContainer.removeClass('touch-moving');
            if (Math.abs(currentX - startX) > 20) {
                if (currentX < startX) { // swipe left
                    if (Math.abs(currentSlide) != (totalSlides - 1)) {
                        currentSlide -= 1;
                    }
                } else {
                    if (currentSlide != 0) {
                        currentSlide += 1;
                    }
                }
                moveStage();
            } else {
                moveStage();
            }
        }
    }

    function bindEvents() {
        nav.on('click', 'a', function (e) {
            e.preventDefault();
            if ($(this).hasClass('next')) {
                if (Math.abs(currentSlide) === (totalSlides - 1)) {
                    nav.find('.next').addClass('hidden');
                    return;
                } else {
                    nav.find('.next').removeClass('hidden');
                    currentSlide -= 1;      
                }
            } else {
                if (Math.abs(currentSlide) === 0) {
                    nav.find('.prev').addClass('hidden');
                    return;
                } else {
                    currentSlide += 1;
                    nav.find('.prev').removeClass('hidden');
                }
            }
            moveStage();
        });

        bindTouchEvents();

        $(window).on('resize', function () {
            window.setTimeout(function () {
                slideW = container.width();
                prepareStage();
                moveStage();
            }, 100);
        });
    }

    function init(element) {
        container = $(element);
        viewport = container.find('.viewport');
        slidesContainer = container.find('.slides-container');
        slides = slidesContainer.find('.slide');
        totalSlides = slides.length;
        slideW = 623;
        nav = container.find('.gallery-nav');

        prepareStage();
        bindEvents();

        if (totalSlides == 1)
            nav.hide();
    }
    init(element);
};

// slider init
jQuery(document).ready(function($) {
    var galleryContainer = $('<div class="ce-gallery" data-id="ce-gallery"></div>'),
        viewport = $('<div class="viewport"></div>'),
        slidesContainer = $('<div class="slides-container"></div>'),
        navigation = $('<div class="gallery-nav"><a href="#" title="Previous" class="prev hidden">Previous</a><a href="#" title="Next" class="next">Next</a></div>'),
        items = $('#page-26 .csc-textpic-imagewrap').find('img');
    if (items.length < 2) {
        return;
    }
    $.each(items, function (i) {
        var item = items[i],
            url = $(item).attr('src');
        if (i == 0)
            img = '<div class="slide slide-' + (i + 1) + '"><img src="' + url + '" alt=""/><p class="image-caption"></p></div>';
        else if (i < 3)
            img = '<div class="unloaded slide slide-' + (i + 1) + '"><img src="' + url + '" alt=""/><p class="image-caption"></p></div>';
        else
            img = '<div class="unloaded slide slide-' + (i + 1) + '"><img src="/fileadmin/templates/shopcenter/images/blank.png" data-src="' + url + '" alt=""/><p class="image-caption"></p></div>';
        slidesContainer.append(img);
    });
    viewport.append(slidesContainer);
    viewport.append(navigation);
    galleryContainer.append(viewport);
    $('#page-26 .csc-textpic-imagewrap').hide().after(galleryContainer);
    ceGallery(galleryContainer);
});