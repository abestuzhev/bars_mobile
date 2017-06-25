<a href="#modal" class="fancy_ban_new"></a>

<div id="modal" class="modal item-single-buy-credit" style="display: none;margin-top: 0">
    <a href='/news/feerichnoe-otkrytie-moto-i-servisnogo-tsentra/#' class="img-link">
		<img src="<?= SITE_TEMPLATE_PATH ?>/img/new_banner/usov_open.jpg"></a>
    <!--    <a href='/actions/rybnyy-chetverg-v-severodvinske/' class='button'><img src="<?= SITE_TEMPLATE_PATH ?>/img/new_banner/kiber_mon.jpg"></a>-->


    <a href='#' class='new_close' onclick="$.fancybox.close();"><img src="<?= SITE_TEMPLATE_PATH ?>/img/new_banner/close.png"></a>
</div>
<style>

    #modal a.img-link {
        text-decoration: none;
    }
    #modal a.img-link img {
        border-radius: 24px;
    }
    .fancybox-opened .fancybox-skin {
        background: none !important;
        box-shadow: none !important;
    }
    .new_close {
        width: 54px;
        height: 56px;
        top:0px;
        text-decoration: none !important;
        position: absolute;
        border-bottom: none !important;
        right: 0;
    }
    .modal .button{
        position: absolute;
        bottom: 0;
        background: none !important;
        bottom: 60px !important;
        right: 155px !important;
        text-shadow: none;
    }
    .fancybox-skin.border .fancybox-close {
        display: none;
    }
    .fancybox-skin.border {
        border-radius: 94px;
    }
</style>
<script>
    $(document).ready(function () {
        $('.fancy_ban_new').trigger('click');
    })
    $('.fancy_ban_new').fancybox({
        centerOnScroll: true,
        type: 'inline',
        padding: 0,
        afterShow: function (e) {
            setTimeout(function () {
                $('.fancybox-skin').addClass('border');
                $('.fancybox-item.fancybox-close').addClass('new_close');
            }, 100)
        }
    });
</script>