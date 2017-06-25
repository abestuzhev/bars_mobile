<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" class="no-js" lang="ru">
    <head>
        <? include_once "seo.php" ?>
            <!-- <title><? //=$APPLICATION->ShowTitle()  ?> &nbsp;&#124;&nbsp;Интернет-магазин &laquo;Барс&raquo;</title> -->

        <?= $APPLICATION->ShowHead() ?>
        <? if (CSite::InDir('/catalog/odezhda_sportivnaya/index.php')) { ?>
            <link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.bars.su/catalog/odezhda_sportivnaya/"/>
        <? } ?>
        <? if (CSite::InDir('/articles/yamaha-vk540-iv-ili-tundra-wt-550-v-arkhangelske-vybiraem/index.php')) { ?>
            <link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.bars.su/articles/yamaha-vk540-iv-ili-tundra-wt-550-v-arkhangelske-vybiraem/"/>
        <? } ?>
        <? if (CSite::InDir('/articles/instrumenty-dlya-lesa-i-doma-v-arkhangelske/index.php')) { ?>
            <link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.bars.su/articles/instrumenty-dlya-lesa-i-doma-v-arkhangelske/"/>
        <? } ?>
        <? //$APPLICATION->ShowMeta('keywords');?>
        <? //$APPLICATION->ShowMeta('description');?>
        <?
        if ($_COOKIE["SHOW_VIDEO"] != 'Y') {
			setcookie("SHOW_VIDEO", 'Y', time() + 60*10, "/"); // КАЖДЫЕ 10 МИНУТ!!!
			$showVideo = true;
        } else {
            $showVideo = false;
        }
        if ($showVideo) {
            include 'com.php';
        }
        ?>

        <? $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . '/scripts/nivo-slider/nivo-slider.css') ?>
        <? $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . '/scripts/ui/ui-1.9.2.custom.css'); ?>

        <link rel="shortcut icon" href="/favicon.ico">

            <? $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/jquery-1.9.1.min.js') ?>
            <? $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/suppress/suppress-2.0.0.js') ?>
            <? $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/nivo-slider/jquery.nivo.slider.pack.js') ?>
            <? $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/masonry/masonry.pkgd.min.js') ?>
            <? $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/ui/ui-1.10.3.custom.min.js') ?>

            <?
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/scripts/fancybox2/source/jquery.fancybox.pack.js");
            $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . "/scripts/fancybox2/source/jquery.fancybox.css");

            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/jquery.cookie.js');
            $APPLICATION->AddHeadScript("//vk.com/js/api/openapi.js?101");

            $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . '/scripts/jclever/jClever.css');
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/plugins/jscrollpane/jquery.mousewheel.js');
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/jclever/jClever.min.js');

            $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . '/scripts/jquery.formstyler/jquery.formstyler.css');
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/jquery.formstyler/jquery.formstyler.min.js');

            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/pickadate/compressed/picker.js');
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/pickadate/compressed/picker.date.js');
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/pickadate/compressed/translations/ru_RU.js');
            $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . "/scripts/pickadate/compressed/themes/classic.css");
            $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . "/scripts/pickadate/compressed/themes/classic.date.css");
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/plugins/jscrollpane/jquery.jscrollpane.min.js');
            $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . '/scripts/plugins/jscrollpane/jquery.jscrollpane.css');
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/plugins/listsearch/jquery.listSearch.min.js');
            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/lazyload/jquery.lazyload.min.js');

            $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/scripts/main.js');
            ?>


    </head>

    <body<?= ($GLOBALS['ROUTER']->Is404() ? '  class="not-found"' : '') ?>>

        <?= $APPLICATION->ShowPanel() ?>

        <?
        $arReq = Primepix\CSiteUtils::GetMinimalOrderPrices();
        $minOrderPrice = $arReq['MIN_ORDER_PRICE'];
        $minCreditSumm = $arReq['MIN_CREDIT_SUMM'];
        $maxCreditSumm = $arReq['MAX_CREDIT_SUMM'];
        ?>
        <script type="text/javascript">
            (function (w) {
                w.bapp = (w.bapp || {});
                w.bapp.min_order_price = <?= $minOrderPrice ?>;
                w.bapp.min_credit_summ = <?= $minCreditSumm ?>;
                w.bapp.max_credit_summ = <?= $maxCreditSumm ?>;
            })(window);
        </script>

        <div class="page">

            <div class="header">
                <div class="header-box">
                    <div class="container">
                        <div class="container-box">
                            <div class="header-top clearfix">
                                <div class="header-top-left">

                                    <? include($_SERVER['DOCUMENT_ROOT'] . SITE_TEMPLATE_PATH . '/ajax/random_action.php'); ?>

                                </div>
                                <div class="header-top-right">

                                    <?
                                    $APPLICATION->IncludeComponent("primepix:system.auth.gadget", "header", Array(
                                        "REGISTER_URL" => "/personal/register/", // Страница регистрации
                                        "FORGOT_PASSWORD_URL" => "/personal/forgotpass/", // Страница забытого пароля
                                        "PROFILE_URL" => "/personal/", // Страница профиля
                                        "SHOW_ERRORS" => "Y", // Показывать ошибки
                                        "AUTH_AJAX_TAG" => "agadg-auth-ajax",
                                        "REG_AJAX_TAG" => "agadg-reg-ajax"
                                            ), false
                                    );
                                    ?>

                                </div>
                            </div>
                            <div class="header-bottom clearfix">
                                <div class="header-bottom-left">
                                    <div class="header-logo">
                                        <a href="/">Барс. Живите полной жизнью!</a>
                                    </div>
                                </div>
                                <div class="header-bottom-right-wrapper">
                                    <div class="header-bottom-center">
                                        <div class="header-navigation">

                                            <?
                                            $APPLICATION->IncludeComponent("bitrix:menu", "main", array(
                                                "ROOT_MENU_TYPE" => "top",
                                                "MENU_CACHE_TYPE" => "N",
                                                "MENU_CACHE_TIME" => "3600",
                                                "MENU_CACHE_USE_GROUPS" => "Y",
                                                "MENU_CACHE_GET_VARS" => array(
                                                ),
                                                "MAX_LEVEL" => "3",
                                                "CHILD_MENU_TYPE" => "inner",
                                                "USE_EXT" => "Y",
                                                "DELAY" => "N",
                                                "ALLOW_MULTI_SELECT" => "N"
                                                    ), false
                                            );
                                            ?>

                                        </div>
                                        <div class="header-search clearfix">

                                            <?
                                            $APPLICATION->IncludeComponent(
	"bitrix:search.title", 
	"header", 
	array(
		"NUM_CATEGORIES" => "1",
		"TOP_COUNT" => "5",
		"ORDER" => "date",
		"USE_LANGUAGE_GUESS" => "N",
		"CHECK_DATES" => "N",
		"SHOW_OTHERS" => "N",
		"PAGE" => "#SITE_DIR#search/",
		"CATEGORY_0_TITLE" => "Каталог товаров",
		"CATEGORY_0" => array(
			0 => "iblock_1c_catalog",
		),
		"SHOW_INPUT" => "Y",
		"INPUT_ID" => "title-search-input",
		"CONTAINER_ID" => "title-search",
		"PRICE_CODE" => array(
			0 => "ИНТЕРНЕТ МАГАЗИН",
		),
		"PRICE_VAT_INCLUDE" => "Y",
		"PREVIEW_TRUNCATE_LEN" => "",
		"SHOW_PREVIEW" => "Y",
		"CONVERT_CURRENCY" => "N",
		"CATEGORY_0_iblock_1c_catalog" => array(
			0 => "41",
			1 => "56",
			2 => "58",
			3 => "64",
			4 => "66",
			5 => "68",
			6 => "72",
			7 => "74",
			8 => "76",
			9 => "78",
			10 => "80",
			11 => "82",
			12 => "84",
			13 => "86",
			14 => "88",
			15 => "90",
			16 => "92",
			17 => "94",
			18 => "99",
			19 => "101",
			20 => "103",
			21 => "109",
			22 => "111",
			23 => "113",
			24 => "115",
			25 => "117",
			26 => "119",
			27 => "121",
			28 => "123",
			29 => "125",
			30 => "127",
		),
		"PREVIEW_WIDTH" => "75",
		"PREVIEW_HEIGHT" => "75",
		"COMPONENT_TEMPLATE" => "header"
	),
	false
);
                                            ?>
                                        </div>
                                    </div>
                                    <div class="header-bottom-right">
                                        <div class="header-information">
                                            <div class="header-information-body">
                                                <div class="header-information-online active">
                                                    <div class="header-information-phone">

<?
$APPLICATION->IncludeComponent(
        "bitrix:main.include", "", Array(
    "AREA_FILE_SHOW" => "file",
    "PATH" => SITE_TEMPLATE_PATH . "/includes/phone-online.php",
    "EDIT_TEMPLATE" => ""
        )
);
?>

                                                    </div>
                                                    <div class="header-information-timetable">

<?
$APPLICATION->IncludeComponent(
        "bitrix:main.include", "", Array(
    "AREA_FILE_SHOW" => "file",
    "PATH" => SITE_TEMPLATE_PATH . "/includes/workdays-online.php",
    "EDIT_TEMPLATE" => ""
        )
);
?>

                                                    </div>
                                                </div>
                                                <div class="header-information-office">
                                                    <div class="header-information-phone">

<?
$APPLICATION->IncludeComponent(
        "bitrix:main.include", "", Array(
    "AREA_FILE_SHOW" => "file",
    "PATH" => SITE_TEMPLATE_PATH . "/includes/phone-office.php",
    "EDIT_TEMPLATE" => ""
        )
);
?>

                                                    </div>
                                                    <div class="header-information-timetable">

<?
$APPLICATION->IncludeComponent(
        "bitrix:main.include", "", Array(
    "AREA_FILE_SHOW" => "file",
    "PATH" => SITE_TEMPLATE_PATH . "/includes/workdays-office.php",
    "EDIT_TEMPLATE" => ""
        )
);
?>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="header-information-switch" class="clearfix">
                                                <ul class="clearfix">
                                                    <li class="active" data-tab="header-information-online"><a href="#">онлайн-заказы</a></li>
                                                    <li data-tab="header-information-office"><a href="#">офис ТС Барс</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="header-cart">


<?
$APPLICATION->IncludeComponent("bitrix:sale.basket.basket.small", "header", array(
    "PATH_TO_BASKET" => "/personal/basket/",
    "PATH_TO_ORDER" => "/personal/order/"
        ), false
);
?>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

<? if ($GLOBALS['ROUTER']->Show('BANNER_WIDE')): ?>

                <?
                $APPLICATION->IncludeComponent("bitrix:news.list", "banner_wide", array(
                    "IBLOCK_TYPE" => "banners",
                    "IBLOCK_ID" => "6",
                    "NEWS_COUNT" => "99999",
                    "SORT_BY1" => "SORT",
                    "SORT_ORDER1" => "ASC",
                    "SORT_BY2" => "SORT",
                    "SORT_ORDER2" => "ASC",
                    "FILTER_NAME" => "",
                    "FIELD_CODE" => array(
                        0 => "",
                        1 => "DETAIL_TEXT",
                        2 => "DETAIL_PICTURE",
                        3 => "",
                    ),
                    "PROPERTY_CODE" => array(
                        0 => "",
                        1 => "",
                    ),
                    "CHECK_DATES" => "Y",
                    "DETAIL_URL" => "",
                    "AJAX_MODE" => "N",
                    "AJAX_OPTION_JUMP" => "N",
                    "AJAX_OPTION_STYLE" => "Y",
                    "AJAX_OPTION_HISTORY" => "N",
                    "CACHE_TYPE" => "A",
                    "CACHE_TIME" => "36000000",
                    "CACHE_FILTER" => "N",
                    "CACHE_GROUPS" => "Y",
                    "PREVIEW_TRUNCATE_LEN" => "",
                    "ACTIVE_DATE_FORMAT" => "d.m.Y",
                    "SET_TITLE" => "N",
                    "SET_STATUS_404" => "N",
                    "INCLUDE_IBLOCK_INTO_CHAIN" => "N",
                    "ADD_SECTIONS_CHAIN" => "N",
                    "HIDE_LINK_WHEN_NO_DETAIL" => "N",
                    "PARENT_SECTION" => "",
                    "PARENT_SECTION_CODE" => "",
                    "INCLUDE_SUBSECTIONS" => "N",
                    "DISPLAY_TOP_PAGER" => "N",
                    "DISPLAY_BOTTOM_PAGER" => "N",
                    "PAGER_TITLE" => "Новости",
                    "PAGER_SHOW_ALWAYS" => "N",
                    "PAGER_TEMPLATE" => "",
                    "PAGER_DESC_NUMBERING" => "N",
                    "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
                    "PAGER_SHOW_ALL" => "N",
                    "DISPLAY_DATE" => "Y",
                    "DISPLAY_NAME" => "Y",
                    "DISPLAY_PICTURE" => "Y",
                    "DISPLAY_PREVIEW_TEXT" => "Y",
                    "AJAX_OPTION_ADDITIONAL" => ""
                        ), false
                );
                ?>

            <? endif ?>

            <div class="middle container">

                <div class="container-box clearfix">

<? if ($GLOBALS['ROUTER']->Show('BANNERS')): ?>

                        <?
                        $APPLICATION->IncludeComponent("bitrix:news.list", "banners_small", array(
                            "IBLOCK_TYPE" => "banners",
                            "IBLOCK_ID" => "7",
                            "NEWS_COUNT" => "4",
                            "SORT_BY1" => "SORT",
                            "SORT_ORDER1" => "ASC",
                            "SORT_BY2" => "SORT",
                            "SORT_ORDER2" => "ASC",
                            "FILTER_NAME" => "",
                            "FIELD_CODE" => array(
                                0 => "NAME",
                                1 => "PREVIEW_TEXT",
                                2 => "PREVIEW_PICTURE",
                                3 => "DETAIL_TEXT",
                                4 => "DETAIL_PICTURE",
                                5 => "",
                            ),
                            "PROPERTY_CODE" => array(
                                0 => "ACTION",
                                1 => "",
                            ),
                            "CHECK_DATES" => "Y",
                            "DETAIL_URL" => "",
                            "AJAX_MODE" => "N",
                            "AJAX_OPTION_JUMP" => "N",
                            "AJAX_OPTION_STYLE" => "Y",
                            "AJAX_OPTION_HISTORY" => "N",
                            "CACHE_TYPE" => "A",
                            "CACHE_TIME" => "36000000",
                            "CACHE_FILTER" => "N",
                            "CACHE_GROUPS" => "Y",
                            "PREVIEW_TRUNCATE_LEN" => "",
                            "ACTIVE_DATE_FORMAT" => "d.m.Y",
                            "SET_TITLE" => "N",
                            "SET_STATUS_404" => "N",
                            "INCLUDE_IBLOCK_INTO_CHAIN" => "N",
                            "ADD_SECTIONS_CHAIN" => "N",
                            "HIDE_LINK_WHEN_NO_DETAIL" => "N",
                            "PARENT_SECTION" => "",
                            "PARENT_SECTION_CODE" => "",
                            "INCLUDE_SUBSECTIONS" => "N",
                            "DISPLAY_TOP_PAGER" => "N",
                            "DISPLAY_BOTTOM_PAGER" => "N",
                            "PAGER_TITLE" => "Новости",
                            "PAGER_SHOW_ALWAYS" => "N",
                            "PAGER_TEMPLATE" => "",
                            "PAGER_DESC_NUMBERING" => "N",
                            "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
                            "PAGER_SHOW_ALL" => "N",
                            "DISPLAY_DATE" => "Y",
                            "DISPLAY_NAME" => "Y",
                            "DISPLAY_PICTURE" => "Y",
                            "DISPLAY_PREVIEW_TEXT" => "Y",
                            "AT_MAIN_CACHE_KEY" => $atMain,
                            "AJAX_OPTION_ADDITIONAL" => ""
                                ), false
                        );
                        ?>

                    <? endif ?>

                    <div class="middle-columns clearfix">

<? if ($GLOBALS['ROUTER']->Show('LEFT_SIDE_BAR')): ?>

                            <div class="sidebar-left">

    <? if ($GLOBALS['ROUTER']->Show('SIDE_BASKET')): ?>
        <?
        $APPLICATION->IncludeComponent("bitrix:sale.basket.basket.small", "side", array(
            "PATH_TO_BASKET" => "/personal/basket/",
            "PATH_TO_ORDER" => "/personal/order/"
                ), false
        );
        ?>

                                <? endif ?>

                                <? if ($GLOBALS['ROUTER']->Show('CHECKOUT_MENU')): ?>

                                    <?
                                    $APPLICATION->IncludeComponent("bitrix:menu", "order", Array(
                                        "ROOT_MENU_TYPE" => "order", // Тип меню для первого уровня
                                        "MENU_CACHE_TYPE" => "A", // Тип кеширования
                                        "MENU_CACHE_TIME" => "3600", // Время кеширования (сек.)
                                        "MENU_CACHE_USE_GROUPS" => "Y", // Учитывать права доступа
                                        "MENU_CACHE_GET_VARS" => "", // Значимые переменные запроса
                                        "MAX_LEVEL" => "1", // Уровень вложенности меню
                                        "CHILD_MENU_TYPE" => "inner", // Тип меню для остальных уровней
                                        "USE_EXT" => "Y", // Подключать файлы с именами вида .тип_меню.menu_ext.php
                                        "DELAY" => "N", // Откладывать выполнение шаблона меню
                                        "ALLOW_MULTI_SELECT" => "N", // Разрешить несколько активных пунктов одновременно
                                            ), false
                                    );
                                    ?>

                                <? endif ?>

                                <? if ($GLOBALS['ROUTER']->Show('SIDE_CATALOG_MENU')): ?>

                                    <?
                                    $APPLICATION->IncludeComponent("bitrix:menu", "catalog", array(
                                        "ROOT_MENU_TYPE" => "catalog",
                                        "MENU_CACHE_TYPE" => "A",
                                        "MENU_CACHE_TIME" => "3600",
                                        "MENU_CACHE_USE_GROUPS" => "N",
                                        "MENU_CACHE_GET_VARS" => array(
                                        ),
                                        "MAX_LEVEL" => "2",
                                        "CHILD_MENU_TYPE" => "catalog",
                                        "USE_EXT" => "Y",
                                        "DELAY" => "N",
                                        "ALLOW_MULTI_SELECT" => "N"
                                            ), false
                                    );
                                    ?>

                                <? endif ?>

                                <? if ($GLOBALS['ROUTER']->Show('SERVICES')): ?>

                                    <?
                                    $APPLICATION->IncludeComponent("bitrix:menu", "services", array(
                                        "ROOT_MENU_TYPE" => "side_services",
                                        "MENU_CACHE_TYPE" => "A",
                                        "MENU_CACHE_TIME" => "3600",
                                        "MENU_CACHE_USE_GROUPS" => "N",
                                        "MENU_CACHE_GET_VARS" => array(
                                        ),
                                        "MAX_LEVEL" => "1",
                                        "CHILD_MENU_TYPE" => "left",
                                        "USE_EXT" => "N",
                                        "DELAY" => "N",
                                        "ALLOW_MULTI_SELECT" => "N"
                                            ), false
                                    );
                                    ?>

                                <? endif ?>

                                <? if ($GLOBALS['ROUTER']->Show('OUR_COMPANY')): ?>

                                    <?
                                    $APPLICATION->IncludeComponent("bitrix:menu", "about_us", array(
                                        "ROOT_MENU_TYPE" => "side_about",
                                        "MENU_CACHE_TYPE" => "A",
                                        "MENU_CACHE_TIME" => "3600",
                                        "MENU_CACHE_USE_GROUPS" => "N",
                                        "MENU_CACHE_GET_VARS" => array(
                                        ),
                                        "MAX_LEVEL" => "1",
                                        "CHILD_MENU_TYPE" => "left",
                                        "USE_EXT" => "N",
                                        "DELAY" => "N",
                                        "ALLOW_MULTI_SELECT" => "N"
                                            ), false
                                    );
                                    ?>

                                <? endif ?>

                            </div>
                            <? endif ?>

                        <?
                        if (!$GLOBALS['ROUTER']->Show('RIGHT_SIDE_BAR')) {
                            $noRight = true;
                            $barClasses = array('no-right-sidebar');
                        }

                        if (!$GLOBALS['ROUTER']->Show('LEFT_SIDE_BAR')) {
                            $noLeft = true;
                            $barClasses = array('no-left-sidebar');
                        }

                        if ($noLeft && $noRight)
                            $barClasses = array('no-sidebars');
                        ?>

                        <? $classList = (is_array($barClasses) ? join(' ', $barClasses) : '') ?>
                        <div class="content clearfix <?= $classList ?>">

                        <? if ($GLOBALS['ROUTER']->Show('BREADCRUMBSNH1')): ?>

                                <div class="breadcrumbs">
                                    <ul class="breadcrumbs-list">

    <?
    $APPLICATION->IncludeComponent("bitrix:breadcrumb", "inner", Array(
        "START_FROM" => "", // Номер пункта, начиная с которого будет построена навигационная цепочка
        "PATH" => "", // Путь, для которого будет построена навигационная цепочка (по умолчанию, текущий путь)
        "SITE_ID" => "s1", // Cайт (устанавливается в случае многосайтовой версии, когда DOCUMENT_ROOT у сайтов разный)
            ), false, array(
        'HIDE_ICONS' => 'Y'
            )
    );
    ?>

                                        <? /*
                                          <li class="active">
                                          <h1 class="breadcrumb-h1"><?=$APPLICATION->ShowTitle(false)?></h1>
                                          </li>
                                         */ ?>

                                        <? // это будет включено скриптом, только в новостях: ?>
                                        <li class="rss"><a href="#"><span>RSS</span></a></li>

                                    </ul>
                                </div>

<? endif ?>

                            <div class="info">
                                <div class="page-text">

