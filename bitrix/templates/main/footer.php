</div>
</div>

</div>

<? if ($GLOBALS['ROUTER']->Show('RIGHT_SIDE_BAR')): ?>
    <div class="sidebar-right">

        <? if ($GLOBALS['ROUTER']->Show('SIDE_ORDER_LIST') && $GLOBALS['USER']->IsAuthorized()): ?>

            <?
            $APPLICATION->IncludeComponent("bitrix:sale.personal.order.list", "side", array(
                "PATH_TO_DETAIL" => "/personal/orderdetail/?ID=#ID#",
                "PATH_TO_COPY" => "",
                "PATH_TO_CANCEL" => "/personal/ordercancel/?ID=#ID#",
                "PATH_TO_BASKET" => "",
                "ORDERS_PER_PAGE" => "2",
                "SET_TITLE" => "N",
                "SAVE_IN_SESSION" => "Y",
                "NAV_TEMPLATE" => "",
                "ID" => $ID
                    ), false
            );
            ?>

        <? endif ?>

        <? if ($GLOBALS['ROUTER']->Show('SIDE_PERSONAL_INFO') && $GLOBALS['USER']->IsAuthorized()): ?>

            <?
            $APPLICATION->IncludeComponent("bitrix:main.profile", "side_info", array(
                "AJAX_MODE" => "N",
                "AJAX_OPTION_JUMP" => "N",
                "AJAX_OPTION_STYLE" => "Y",
                "AJAX_OPTION_HISTORY" => "N",
                "SET_TITLE" => "N",
                "USER_PROPERTY" => array(
                ),
                "SEND_INFO" => "N",
                "CHECK_RIGHTS" => "N",
                "AJAX_OPTION_ADDITIONAL" => ""
                    ), false
            );
            ?>

        <? endif ?>

	    <? if (CSite::InDir('/index.php')) { ?>
            <div class="lotos-wrapper">
                <a href="/actions/rozygrysh-50-000-po-lodkam-altair-pro/">
                    <img src="<?=SITE_TEMPLATE_PATH?>/img/altair.jpg">
                </a>
            </div>
	    <? } ?>

        <? if ($GLOBALS['ROUTER']->Show('ACTIONS')): ?>

            <? // Действующие акции ?>
            <?
            $APPLICATION->IncludeComponent("bitrix:news.list", "action_list", array(
                "IBLOCK_TYPE" => "info",
                "IBLOCK_ID" => "3",
                "NEWS_COUNT" => "3",
                "SORT_BY1" => "ACTIVE_FROM",
                "SORT_ORDER1" => "DESC",
                "SORT_BY2" => "SORT",
                "SORT_ORDER2" => "ASC",
                "FILTER_NAME" => "",
                "FIELD_CODE" => array(
                    0 => "",
                    1 => "",
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
                "INCLUDE_SUBSECTIONS" => "Y",
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

        <? if ($GLOBALS['ROUTER']->Show('ARTICLES')): ?>

            <? // Статьи, советы ?>
            <?
            $APPLICATION->IncludeComponent("bitrix:news.list", "article_list", array(
                "IBLOCK_TYPE" => "info",
                "IBLOCK_ID" => "4",
                "NEWS_COUNT" => "5",
                "SORT_BY1" => "ACTIVE_FROM",
                "SORT_ORDER1" => "DESC",
                "SORT_BY2" => "SORT",
                "SORT_ORDER2" => "ASC",
                "FILTER_NAME" => "",
                "FIELD_CODE" => array(
                    0 => "",
                    1 => "",
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
                "INCLUDE_SUBSECTIONS" => "Y",
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

        <? if ($GLOBALS['ROUTER']->Show('TAG_CLOUD')): ?>

            <? // Теги ?>
            <?
            $APPLICATION->IncludeComponent("bitrix:search.tags.cloud", "right", array(
                "SORT" => "NAME",
                "PAGE_ELEMENTS" => "150",
                "PERIOD" => "",
                "URL_SEARCH" => "/search/",
                "TAGS_INHERIT" => "Y",
                "CHECK_DATES" => "N",
                "FILTER_NAME" => "",
                "arrFILTER" => array(
                    0 => "iblock_1c_catalog",
                    1 => "iblock_catalog",
                    2 => "iblock_snowtubing",
                    3 => "iblock_units",
                    4 => "iblock_thirdparty_catalog",
                ),
                "CACHE_TYPE" => "A",
                "CACHE_TIME" => "3600",
                "FONT_MAX" => "50",
                "FONT_MIN" => "10",
                "COLOR_NEW" => "3E74E6",
                "COLOR_OLD" => "C0C0C0",
                "PERIOD_NEW_TAGS" => "",
                "SHOW_CHAIN" => "Y",
                "COLOR_TYPE" => "Y",
                "WIDTH" => "100%",
                "COMPONENT_TEMPLATE" => "right",
                "arrFILTER_iblock_1c_catalog" => array(
                    0 => "41",
                    1 => "42",
                ),
                "arrFILTER_iblock_catalog" => array(
                    0 => "all",
                ),
                "arrFILTER_iblock_snowtubing" => array(
                    0 => "all",
                ),
                "arrFILTER_iblock_thirdparty_catalog" => array(
                    0 => "all",
                ),
                "arrFILTER_iblock_units" => array(
                    0 => "all",
                )
                    ), false, array(
                "ACTIVE_COMPONENT" => "Y"
                    )
            );
            ?>

        <? endif ?>

        <? if ($GLOBALS['ROUTER']->Show('SIDE_NEWS')): ?>
            <? // наши новости ?>
            <?
            $APPLICATION->IncludeComponent("bitrix:news.list", "news_list", array(
                "IBLOCK_TYPE" => "info",
                "IBLOCK_ID" => "5",
                "NEWS_COUNT" => "2",
                "SORT_BY1" => "ACTIVE_FROM",
                "SORT_ORDER1" => "DESC",
                "SORT_BY2" => "SORT",
                "SORT_ORDER2" => "ASC",
                "FILTER_NAME" => "",
                "FIELD_CODE" => array(
                    0 => "",
                    1 => "",
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
                "INCLUDE_SUBSECTIONS" => "Y",
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
                "AJAX_OPTION_ADDITIONAL" => "",
                "SET_BROWSER_TITLE" => "N",
                "SET_META_KEYWORDS" => "N",
                "SET_META_DESCRIPTION" => "N"
                    ), false
            );
            ?>
        <? endif ?>

        <? if ($GLOBALS['ROUTER']->Show('SIDE_CATALOG_NEWS')): ?>
            <? //$GLOBALS['filterNews'] = array('PROPERTY_SHOW_IN_NEWS' => \Primepix\CSiteUtils::CATALOG_PROPERTY_SHOW_IN_NEWS_YES);?>
            <? //$GLOBALS['filterNews'] = array('!PROPERTY_SHOW_IN_NEWS' => FALSE);?>
            <?
            $APPLICATION->IncludeComponent('objectcat:cacheable.area', 'catalog_side', array(
                "IBLOCK_FILTER" => array(
                    "TYPE" => "1c_catalog",
                    "ACTIVE" => "Y",
                    "CATALOG" => "Y"
                ),
                "CACHE_TYPE" => "A",
                "CACHE_TIME" => "36000000",
                "PREVIEW_PICTURE_WIDTH" => "84",
                "PREVIEW_PICTURE_HEIGHT" => "84",
                "PRICE_PREC" => 0,
                "PAGE_BLOCKS" => array(
                    0 => array(
                        "TITLE" => "Новинки каталога",
                        "PRICE_CODE" => array(
                            0 => "ИНТЕРНЕТ МАГАЗИН",
                        ),
                        "FILTER" => array(
                            "!PROPERTY_SHOW_IN_NEWS" => FALSE
                        ),
                        "ELEMENTS_COUNT" => 3
                    ),
                ),
                    ), FALSE);
            ?>
            <? /* $APPLICATION->IncludeComponent("bitrix:catalog.section", "catalog_news", array(
              "IBLOCK_TYPE" => "1c_catalog",
              "IBLOCK_ID" => "25",
              "SECTION_ID" => "",
              "SECTION_CODE" => "",
              "SECTION_USER_FIELDS" => array(
              0 => "",
              1 => "",
              ),
              "ELEMENT_SORT_FIELD" => "active_from",
              "ELEMENT_SORT_ORDER" => "desc",
              "ELEMENT_SORT_FIELD2" => "sort",
              "ELEMENT_SORT_ORDER2" => "asc",
              "FILTER_NAME" => "filterNews",
              "INCLUDE_SUBSECTIONS" => "Y",
              "SHOW_ALL_WO_SECTION" => "Y",
              "HIDE_NOT_AVAILABLE" => "Y",
              "PAGE_ELEMENT_COUNT" => "3",
              "LINE_ELEMENT_COUNT" => "3",
              "PROPERTY_CODE" => array(
              0 => "",
              1 => "",
              ),
              "OFFERS_LIMIT" => "5",
              "SECTION_URL" => "",
              "DETAIL_URL" => "",
              "BASKET_URL" => "/personal/basket.php",
              "ACTION_VARIABLE" => "action",
              "PRODUCT_ID_VARIABLE" => "id",
              "PRODUCT_QUANTITY_VARIABLE" => "quantity",
              "PRODUCT_PROPS_VARIABLE" => "prop",
              "SECTION_ID_VARIABLE" => "SECTION_ID",
              "AJAX_MODE" => "N",
              "AJAX_OPTION_JUMP" => "N",
              "AJAX_OPTION_STYLE" => "Y",
              "AJAX_OPTION_HISTORY" => "N",
              "CACHE_TYPE" => "A",
              "CACHE_TIME" => "36000000",
              "CACHE_GROUPS" => "Y",
              "META_KEYWORDS" => "-",
              "META_DESCRIPTION" => "-",
              "BROWSER_TITLE" => "-",
              "ADD_SECTIONS_CHAIN" => "N",
              "DISPLAY_COMPARE" => "N",
              "SET_TITLE" => "Y",
              "SET_STATUS_404" => "N",
              "CACHE_FILTER" => "N",
              "PRICE_CODE" => array(
              0 => "ИНТЕРНЕТ МАГАЗИН",
              ),
              "USE_PRICE_COUNT" => "N",
              "SHOW_PRICE_COUNT" => "1",
              "PRICE_VAT_INCLUDE" => "Y",
              "PRODUCT_PROPERTIES" => array(
              ),
              "USE_PRODUCT_QUANTITY" => "N",
              "CONVERT_CURRENCY" => "N",
              "DISPLAY_TOP_PAGER" => "N",
              "DISPLAY_BOTTOM_PAGER" => "N",
              "PAGER_TITLE" => "Товары",
              "PAGER_SHOW_ALWAYS" => "N",
              "PAGER_TEMPLATE" => "",
              "PAGER_DESC_NUMBERING" => "N",
              "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
              "PAGER_SHOW_ALL" => "N",
              "PREVIEW_PICTURE_WIDTH" => "84",
              "PREVIEW_PICTURE_HEIGHT" => "84",
              "SHOW_OLD_PRICE" => "N",
              "AJAX_OPTION_ADDITIONAL" => ""
              ),
              false
              ); */ ?>

        <? endif ?>

        <? if ($GLOBALS['ROUTER']->Show('SIDE_CATALOG_SPECOFFERS')): ?>

            <? //$GLOBALS['filterSpec'] = array('PROPERTY_SHOW_IN_SPEC' => \Primepix\CSiteUtils::CATALOG_PROPERTY_SHOW_IN_SPEC_YES);?>
            <? //$GLOBALS['filterSpec'] = array('!PROPERTY_SHOW_IN_SPEC' => FALSE);?>
            <?
            $APPLICATION->IncludeComponent('objectcat:cacheable.area', 'catalog_side', array(
                "IBLOCK_FILTER" => array(
                    "TYPE" => "1c_catalog",
                    "ACTIVE" => "Y",
                    "CATALOG" => "Y"
                ),
                "CACHE_TYPE" => "A",
                "CACHE_TIME" => "36000000",
                "PREVIEW_PICTURE_WIDTH" => "84",
                "PREVIEW_PICTURE_HEIGHT" => "84",
                "PRICE_PREC" => 0,
                "PAGE_BLOCKS" => array(
                    0 => array(
                        "TITLE" => "Специальные предложения",
                        "PRICE_CODE" => array(
                            0 => "ИНТЕРНЕТ МАГАЗИН",
                        ),
                        "FILTER" => array(
                            "!PROPERTY_SHOW_IN_SPEC" => FALSE
                        ),
                        "ELEMENTS_COUNT" => 3
                    ),
                ),
                    ), FALSE);
            ?>


            <? /* $APPLICATION->IncludeComponent("bitrix:catalog.section", "catalog_spec", array(
              "IBLOCK_TYPE" => "1c_catalog",
              "IBLOCK_ID" => "25",
              "SECTION_ID" => "",
              "SECTION_CODE" => "",
              "SECTION_USER_FIELDS" => array(
              0 => "",
              1 => "",
              ),
              "ELEMENT_SORT_FIELD" => "active_from",
              "ELEMENT_SORT_ORDER" => "desc",
              "ELEMENT_SORT_FIELD2" => "sort",
              "ELEMENT_SORT_ORDER2" => "asc",
              "FILTER_NAME" => "filterSpec",
              "INCLUDE_SUBSECTIONS" => "Y",
              "SHOW_ALL_WO_SECTION" => "Y",
              "HIDE_NOT_AVAILABLE" => "Y",
              "PAGE_ELEMENT_COUNT" => "3",
              "LINE_ELEMENT_COUNT" => "3",
              "PROPERTY_CODE" => array(
              0 => "",
              1 => "",
              ),
              "OFFERS_LIMIT" => "5",
              "SECTION_URL" => "",
              "DETAIL_URL" => "",
              "BASKET_URL" => "/personal/basket.php",
              "ACTION_VARIABLE" => "action",
              "PRODUCT_ID_VARIABLE" => "id",
              "PRODUCT_QUANTITY_VARIABLE" => "quantity",
              "PRODUCT_PROPS_VARIABLE" => "prop",
              "SECTION_ID_VARIABLE" => "SECTION_ID",
              "AJAX_MODE" => "N",
              "AJAX_OPTION_JUMP" => "N",
              "AJAX_OPTION_STYLE" => "Y",
              "AJAX_OPTION_HISTORY" => "N",
              "CACHE_TYPE" => "A",
              "CACHE_TIME" => "36000000",
              "CACHE_GROUPS" => "Y",
              "META_KEYWORDS" => "-",
              "META_DESCRIPTION" => "-",
              "BROWSER_TITLE" => "-",
              "ADD_SECTIONS_CHAIN" => "N",
              "DISPLAY_COMPARE" => "N",
              "SET_TITLE" => "Y",
              "SET_STATUS_404" => "N",
              "CACHE_FILTER" => "N",
              "PRICE_CODE" => array(
              0 => "ИНТЕРНЕТ МАГАЗИН",
              ),
              "USE_PRICE_COUNT" => "N",
              "SHOW_PRICE_COUNT" => "1",
              "PRICE_VAT_INCLUDE" => "Y",
              "PRODUCT_PROPERTIES" => array(
              ),
              "USE_PRODUCT_QUANTITY" => "N",
              "CONVERT_CURRENCY" => "N",
              "DISPLAY_TOP_PAGER" => "N",
              "DISPLAY_BOTTOM_PAGER" => "N",
              "PAGER_TITLE" => "Товары",
              "PAGER_SHOW_ALWAYS" => "N",
              "PAGER_TEMPLATE" => "",
              "PAGER_DESC_NUMBERING" => "N",
              "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
              "PAGER_SHOW_ALL" => "N",
              "PREVIEW_PICTURE_WIDTH" => "84",
              "PREVIEW_PICTURE_HEIGHT" => "84",
              "SHOW_OLD_PRICE" => "Y",
              "AJAX_OPTION_ADDITIONAL" => ""
              ),
              false
              ); */ ?>

        <? endif ?>
        <? if ($GLOBALS['ROUTER']->Show('SIDE_CATALOG_TRADEIN')): ?>
            <div class="sidebar-block">
                <div class="sidebar-info">
                    <div class="sidebar-info-box">
                        <ul class="sidebar-info-list">
                            <li class="trade-in-link"><a href="/info/trade-in/">Услуга "трейд-ин"</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        <? endif ?>
        <? if ($GLOBALS['ROUTER']->Show('NEWS_SUBSCRIBE')): ?>

            <?
            $APPLICATION->IncludeComponent("bitrix:subscribe.form", "news", array(
                "USE_PERSONALIZATION" => "Y",
                "SHOW_HIDDEN" => "N",
                "PAGE" => "/personal/subscribe/",
                "CACHE_TYPE" => "A",
                "CACHE_TIME" => "3600"
                    ), false
            );
            ?>

        <? endif ?>
        <!-- VK Widget -->
        <div id="vk_groups"></div>

        <script type="text/javascript">
            VK.Widgets.Group("vk_groups", {mode: 2, width: "227", height: "400", color1: 'FFFFFF', color2: '000000', color3: '000000'}, '47138643');
        </script>
        <!-- /VK Widget -->
    </div>
<? endif ?>

</div>

</div>

</div>

<? if ($GLOBALS['ROUTER']->Show('FOOTER_DESC')): ?>
    <div class="container">
        <div class="container-box box">

            <div class="page-text">

                <?
                $APPLICATION->IncludeComponent(
                        "bitrix:main.include", "", Array(
                    "AREA_FILE_SHOW" => "file",
                    "PATH" => SITE_TEMPLATE_PATH . "/includes/about_company.html",
                    "EDIT_TEMPLATE" => ""
                        )
                );
                ?>

            </div>


            <?
            $APPLICATION->IncludeComponent("bitrix:menu", "brands", Array(
                "ROOT_MENU_TYPE" => "brands",
                "MENU_CACHE_TYPE" => "A",
                "MENU_CACHE_TIME" => "3600",
                "MENU_CACHE_USE_GROUPS" => "Y",
                "MENU_CACHE_GET_VARS" => "",
                "MAX_LEVEL" => "1",
                "CHILD_MENU_TYPE" => "left",
                "USE_EXT" => "Y",
                "DELAY" => "N",
                "ALLOW_MULTI_SELECT" => "N",
                    ), false
            );
            ?>

            <? /* $APPLICATION->IncludeComponent("bitrix:news.list", "partners_footer", array(
              "IBLOCK_TYPE" => "banners",
              "IBLOCK_ID" => "9",
              "NEWS_COUNT" => "9999",
              "SORT_BY1" => "SORT",
              "SORT_ORDER1" => "ASC",
              "SORT_BY2" => "SORT",
              "SORT_ORDER2" => "ASC",
              "FILTER_NAME" => "",
              "FIELD_CODE" => array(
              0 => "PREVIEW_TEXT",
              1 => "PREVIEW_PICTURE",
              2 => "",
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
              ),
              false
              ); */ ?>

        </div>
    </div>
<? endif ?>

<div class="footer">
    <div class="container clearfix">
        <div class="container-box">
            <div class="footer-left">
                <div class="footer-information clearfix">

                    <?
                    $APPLICATION->IncludeComponent(
                            "bitrix:main.include", "", Array(
                        "AREA_FILE_SHOW" => "file",
                        "PATH" => SITE_TEMPLATE_PATH . "/includes/copyright.php",
                        "EDIT_TEMPLATE" => ""
                            )
                    );
                    ?>

                </div>
            </div>
            <div class="footer-right">
                <?
                $APPLICATION->IncludeComponent("bitrix:menu", "bottom", Array(
                    "ROOT_MENU_TYPE" => "bottom", // Тип меню для первого уровня
                    "MENU_CACHE_TYPE" => "A", // Тип кеширования
                    "MENU_CACHE_TIME" => "3600", // Время кеширования (сек.)
                    "MENU_CACHE_USE_GROUPS" => "Y", // Учитывать права доступа
                    "MENU_CACHE_GET_VARS" => "", // Значимые переменные запроса
                    "MAX_LEVEL" => "1", // Уровень вложенности меню
                    "CHILD_MENU_TYPE" => "left", // Тип меню для остальных уровней
                    "USE_EXT" => "N", // Подключать файлы с именами вида .тип_меню.menu_ext.php
                    "DELAY" => "N", // Откладывать выполнение шаблона меню
                    "ALLOW_MULTI_SELECT" => "N", // Разрешить несколько активных пунктов одновременно
                        ), false
                );
                ?>
                <div class="footer-offer">
                    <span>Размещенная информация не является публичной офертой.</span>
                    
                </div>
            </div>
        </div>
    </div>
</div>

<div class="footer-panel-spec">
    <div class="bottom-navigation bn-hidden">
        <div class="container">
            <ul class="bottom-navigation-list">
                <li class="recently-viewed -pupup-open">
                    <a href="javascript:void(0)" class="-po-handler"><span>Недавно просмотренные товары</span></a>
                    <div class="bottom-navigation-popup">

                        <? \Primepix\CSiteUtils::AddCarouFredSel() ?>

                        <div class="container rw-container -af-container">

                            <div class="rw-loader -af-loader"></div>
                            <div class="rw-error">
                                К сожалению, призошла ошибка. Возможно, нет связи с Интернетом. Попробуйте позже.
                            </div>

                        </div>
                    </div>
                </li>
                <li class="compare">

                    <?
                    $APPLICATION->IncludeComponent("bitrix:catalog.compare.list", "bottom_counter", Array(
                        "IBLOCK_TYPE" => "1c_catalog", // Тип инфоблока
                        "IBLOCK_ID" => "41", // Инфоблок
                        "AJAX_MODE" => "N", // Включить режим AJAX
                        "AJAX_OPTION_JUMP" => "N", // Включить прокрутку к началу компонента
                        "AJAX_OPTION_STYLE" => "Y", // Включить подгрузку стилей
                        "AJAX_OPTION_HISTORY" => "N", // Включить эмуляцию навигации браузера
                        "DETAIL_URL" => "", // URL, ведущий на страницу с содержимым элемента раздела
                        "COMPARE_URL" => "/catalog/compare/", // URL страницы с таблицей сравнения
                        "NAME" => \Primepix\CSiteUtils::CATALOG_COMPARE_LIST, // Уникальное имя для списка сравнения
                        "AJAX_OPTION_ADDITIONAL" => "", // Дополнительный идентификатор
                            ), false
                    );
                    ?>

                </li>
                <span id="favorite-footer-composite">
                    <? $frame = new \Bitrix\Main\Page\FrameHelper("favorite-footer-composite"); ?>
                    <? $frame->begin(); ?>
                    <li class="favorite">
                    </li>
                    <script>$('.-favorite-line').appendTo('.bottom-navigation-list .favorite');</script>
                    <? $frame->beginStub(); ?>
                    <li class="favorite">
                    </li>
                    <? $frame->end(); ?>
                </span>
            </ul>
        </div>
    </div>
</div>

</div>
<nofollow>
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
        (function (d, w, c) {
            (w[c] = w[c] || []).push(function () {
                try {
                    w.yaCounter33433978 = new Ya.Metrika({
                        id: 33433978,
                        clickmap: true,
                        trackLinks: true,
                        accurateTrackBounce: true,
                        trackHash: true
                    });
                } catch (e) {
                }
            });

            var n = d.getElementsByTagName("script")[0],
                    s = d.createElement("script"),
                    f = function () {
                        n.parentNode.insertBefore(s, n);
                    };
            s.type = "text/javascript";
            s.async = true;
            s.src = "https://mc.yandex.ru/metrika/watch.js";

            if (w.opera == "[object Opera]") {
                d.addEventListener("DOMContentLoaded", f, false);
            } else {
                f();
            }
        })(document, window, "yandex_metrika_callbacks");
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/33433978" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
</nofollow>
<script>
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-4639009-1', 'auto');
    ga('send', 'pageview');

</script>

<!-- BEGIN JIVOSITE CODE {literal} -->
<script type='text/javascript'>
    (function () {
        var widget_id = 'k3sFnxjDfO';
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//code.jivosite.com/script/widget/' + widget_id;
        var ss = document.getElementsByTagName('script')[0];
        ss.parentNode.insertBefore(s, ss);
    })();</script>
<!-- {/literal} END JIVOSITE CODE -->

<link rel="stylesheet" href="//cdn.callbackhunter.com/widget/tracker.css"> 
<!-- <script type="text/javascript" src="//cdn.callbackhunter.com/widget/tracker.js" charset="UTF-8"></script> -->
<script type="text/javascript">var hunter_code = "321db0b09b951e71f118d323e0be5e1f";</script>

<!-- <script type="text/javascript" src="//2calls.ru/files/widgets/2337-eb19d1e15229ba25edf3-580eb19d1e15229ba-9d1e15229ba.js" charset="UTF-8"></script>  -->

<!-- BEGIN REENTER CODE  -->
<script type="text/javascript" src="/google_tag_files/sha256.js"></script>
<script type="text/javascript" src="http://www.googleadservices.com/pagead/conversion_async.js" charset="utf-8"></script>
<script type="text/javascript">
    function getGoogleTagsPath() {
        var normal_url = feedUrlNormalize(window.location.href);
        var hash = new jsSHA(normal_url, "TEXT").getHash("SHA-256", "HEX");
        var partition_dir = hash.substring(0, 2);
        return "\/google_tag_files\/" + partition_dir + "\/" + hash + ".js";
    }
    function feedUrlNormalize(url) {
        return url
                .replace(/utm_\w+=.*?(?:&|$)/g, '')
                .replace(/(\?.*?)\?.*/g, '$1')
                .replace(/amp;/g, '')
                .replace(/$/g, '?r1=yandext&r2=')
                .replace(/[?\/&]+$/g, '');

    }
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = script.onerror = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    loadScript(getGoogleTagsPath(), function () {
//      window.google_trackConversion({
//        google_conversion_id: 952448500,
//        google_custom_params: window.google_tag_params,
//        google_remarketing_only: true
//      });
    });
</script>
<noscript>
<div style="display:inline;">
    <img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/952448500/?value=0&guid=ON&script=0"/>
</div>
</noscript>
<!--  END REENTER CODE -->

</body>
</html>
