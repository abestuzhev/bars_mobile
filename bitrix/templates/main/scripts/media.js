$(document).ready(function() {
    $('.header-top_mobile-menu').on('click', function(e){
        $('.sidebar-left').toggle();
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

});