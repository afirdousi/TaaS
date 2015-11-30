/**
 * Created by Carlos on 11/11/15.
 */
jQuery(function($) {'use strict';

    //Responsive Nav
    $('li.dropdown').find('.fa-angle-down').each(function(){
        $(this).on('click', function(){
            if( $(window).width() < 768 ) {
                $(this).parent().next().slideToggle();
            }
            return false;
        });
    });

    //Fit Vids
    if( $('#video-container').length ) {
        $("#video-container").fitVids();
    }

    //Initiat WOW JS
    new WOW().init();

    // portfolio filter
    $(window).load(function(){

        $('.main-slider').addClass('animate-in');
        $('.preloader').remove();
        //End Preloader

        if( $('.masonery_area').length ) {
            $('.masonery_area').masonry();//Masonry
        }

        var $portfolio_selectors = $('.portfolio-filter >li>a');

        if($portfolio_selectors.length) {

            var $portfolio = $('.portfolio-items');
            $portfolio.isotope({
                itemSelector : '.portfolio-item',
                layoutMode : 'fitRows'
            });

            $portfolio_selectors.on('click', function(){
                $portfolio_selectors.removeClass('active');
                $(this).addClass('active');
                var selector = $(this).attr('data-filter');
                $portfolio.isotope({ filter: selector });
                return false;
            });
        }

    });


    $('.timer').each(count);
    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }

    // Search
    $('.fa-search').on('click', function() {
        $('.field-toggle').fadeToggle(200);
    });

    // Contact form
    var form = $('#main-contact-form');
    form.submit(function(event){
        event.preventDefault();
        var form_status = $('<div class="form_status"></div>');
        $.ajax({
            url: $(this).attr('action'),
            beforeSend: function(){
                form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn() );
            }
        }).done(function(data){
            form_status.html('<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>').delay(3000).fadeOut();
        });
    });

    // Progress Bar
    $.each($('div.progress-bar'),function(){
        $(this).css('width', $(this).attr('data-transition')+'%');
    });

    if( $('#gmap').length ) {
        var map;

        map = new GMaps({
            el: '#gmap',
            lat: 43.04446,
            lng: -76.130791,
            scrollwheel:false,
            zoom: 16,
            zoomControl : false,
            panControl : false,
            streetViewControl : false,
            mapTypeControl: false,
            overviewMapControl: false,
            clickable: false
        });

        map.addMarker({
            lat: 43.04446,
            lng: -76.130791,
            animation: google.maps.Animation.DROP,
            verticalAlign: 'bottom',
            horizontalAlign: 'center',
            backgroundColor: '#3e8bff'
        });
    }
});

/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){

    // Intercept clicks to links in the main page
    $('a').click(function (event) {
        event.preventDefault();

        var url = $(this).attr('href');

        // Verify what kind of address was received: if '#' = Scroll, if '/' = route
        if(!url.match(/^#/)) {
            $.get(url, function (data) {
                if (data) {
                    $('#contentData').empty();      //Empty div 'contentData' from any previous code
                    $('#contentData').html(data);   //Render new data on contentData section
                    $('#slider').hide( "slow", function() {
                        scrollToId('#contentData'); //Scroll to start of contentData section in case we are off.
                    });
                }
            });
        } else {
            scrollToId(url);  // if not a route or post - scroll to section id
        }
    });

});

/* Functions
 ------------------------------------------------------------ */
function scrollToId (id) {
    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 2000);
}
