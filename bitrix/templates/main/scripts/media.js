$(document).ready(function() {
    // $('.header-top_mobile-menu').on('click', function(e){
    //     $('.sidebar-left').toggle();
    //     e.preventDefault();
    // });
    //new
    $('.mobile_navigation').on('click', function(e){
        $('.sidebar-navigation').toggle();
        $(this).toggleClass('mobile_navigation--active');
        e.preventDefault();
    });

    $('.items_mobile-filter').on('click', function(e){
        $('.side-filter').addClass('filter-active');
        $('.mobile_filter-bg').addClass('filter-active');
        $('body').addClass('mobile-canvas');
        e.preventDefault();
    });

    $('.mobile_filter-bg').on('click', function(e){
        $('.side-filter').removeClass('filter-active');
        $(this).removeClass('filter-active');
        $('body').removeClass('mobile-canvas');
        e.preventDefault();
    });

    var windowWidth = $(window).width();


    var renameAuthorisation = function (text){
        $('.header-authorisation-button span').text(text);
    };

    if(windowWidth < 480) {
        renameAuthorisation('ЛК');
    }else {
        renameAuthorisation('Вход/Регистрация');
    }

    $(window).resize(function(){
        console.log('windowWidth: ' + $(window).width());
        if($(window).width() < 480) {
            renameAuthorisation('ЛК');
        }else {
            renameAuthorisation('Вход/Регистрация');
        }
    });



});