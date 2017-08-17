$(document).ready(function () {
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

    $('.items_mobile-filter').on('click', function (e) {
        $('.side-filter').addClass('filter-active');
        $('.mobile_filter-bg').addClass('filter-active');
        $('body').addClass('mobile-canvas');
        e.preventDefault();
    });

    $('.mobile_filter-bg').on('click', function (e) {
        $('.side-filter').removeClass('filter-active');
        $(this).removeClass('filter-active');
        $('body').removeClass('mobile-canvas');
        e.preventDefault();
    });

    $('.header-cart-box').click(function () {
        window.location.assign('/personal/basket/');
    });

    /*3й уровень меню*/
    $('.menu-2-level').on('click', function(e){
        $(this).toggleClass('sub-panel--active');
        e.preventDefault();
        $(this).siblings('.menu-2-level').removeClass('sub-panel--active');
    });
});
/* End */