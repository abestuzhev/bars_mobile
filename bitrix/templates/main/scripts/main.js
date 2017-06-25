// в списках
window.toCompare = function(sel){
	$(sel).add2compareButton({
		onSuccess: function(res){
			window._fc.add2compareLine('update', res);
		},
		onInCompare: function(id){
			var cb = this.dom.find('input[type="checkbox"]');
			cb.get(0).checked = true;
			cb.change();
		},
		onNotInCompare: function(id){
			var cb = this.dom.find('input[type="checkbox"]');
			cb.get(0).checked = false;
			cb.change();
		},
		whenInCompare: function(id){
			return window._fc.add2compareLine('inCompare', id);
		}
	});
}

window.toFavorite = function(sel){
	$(sel).add2basketButton({
		url: '/catalog/add2favorite.php',
		mode: 'delayed',
		group: 'favorite',
		onSuccess: function(result){
			window._counterFavorite.add2basketLine('update', result);
		},
		onInCart: function(){
			this.dom.find('input[type="checkbox"]').prop('checked', true);
			this.dom.find('label').text('в избранном');
		},
		onNotInCart: function(){
			this.dom.find('input[type="checkbox"]').prop('checked', false);
			this.dom.find('label').text('в избранное');
		},
		whenInCart: function(id){
			return window._counterFavorite.add2basketLine('inCart', id);
		}
	});
}

// кнопки добавления в избранное, по всему сайту
// в карточке товара
window.toFavoriteSingle = function(sel){
	$(sel).add2basketButton({
		url: '/catalog/add2favorite.php',
		mode: 'delayed',
		group: 'favorite',
		onLoaderShow: function(){
			$('.item-single-favorite').addClass('item-no-background');
		},
		onLoaderHide: function(){
			$('.item-single-favorite').removeClass('item-no-background');
		},
		onSuccess: function(result){
			window._counterFavorite.add2basketLine('update', result);
		},
		onInCart: function(){
			this.dom.find('span').text('В избранном');
		},
		onNotInCart: function(){
			this.dom.find('span').text('Добавить в избранное');
		},
		whenInCart: function(id){
			return window._counterFavorite.add2basketLine('inCart', id);
		}
	});
}

// кнопки добавления к сравнению, по всему сайту
// в карточке товара
window.toCompareSingle = function(sel){
	$(sel).add2compareButton({
		onLoaderShow: function(){
			$('.item-single-compare').addClass('item-no-background');
		},
		onLoaderHide: function(){
			$('.item-single-compare').removeClass('item-no-background');
		},
		onSuccess: function(res){
			window._fc.add2compareLine('update', res);
		},
		onInCompare: function(id){
			$('.item-single-compare span').text('В сравнении');
		},
		onNotInCompare: function(id){
			$('.item-single-compare span').text('Добавить к сравнению');
		},
		whenInCompare: function(id){
			return window._fc.add2compareLine('inCompare', id);
		}
	});
}

// кнопки добавления в корзину, по всему сайту
// в карточке товара
window.toBasketSingle = function(sel){
	$(sel).add2basketButton({
		group: 'basket',
		onLoaderShow: function(){
			this.prev().text('');
		},
		onLoaderHide: function(){
			this.prev().text('В корзину');
		},
		onSuccess: function(result){
			window._hcb.add2basketLine('update', result);
		},
		onInCart: function(id){
			this.dom.find('span').text('Добавить ещё');
		},
		whenInCart: function(id){
			return window._hcb.add2basketLine('inCart', id);
		}
	});
}

// в списках
window.toBasket = function(sel, onSuccessAddit){
	$(sel).add2basketButton({
		group: 'basket',
		onLoaderShow: function(){
			$('.item-buy-icon', this.parent()).hide();
		},
		onLoaderHide: function(){
			$('.item-buy-icon', this.parent()).show();
		},
		onSuccess: function(result){
			window._hcb.add2basketLine('update', result);
			if(typeof onSuccessAddit == 'function')
				onSuccessAddit();
		},
		onInCart: function(id){
			this.dom.addClass('-item-bought');
		},
		onNotInCart: function(){
			this.dom.removeClass('-item-bought');
		},
		whenInCart: function(id){
			return window._hcb.add2basketLine('inCart', id);
		}
	});
}

$(function() {


	$('.report-error').on('click', function(evt) {
		evt.preventDefault();
		$(this).parent().find('.report-error-area').show();
	});

	$('.report-error-close').on('click', function(evt) {
		evt.preventDefault();
		$(this).closest('.report-error-area').hide();
	});

	var reportError = $('.report-error-area').formAjax({
		url: '/catalog/report_error.php',
		dataType: 'json',
		onSuccess: function(resp) {
			if (resp.status == 'OK') {
				reportError.find('.-form-message')
					.show();
				reportError.delay(500).fadeOut(function() {
					reportError.find('[name=message]').val('')
						.end().find('.-form-message').hide();
				});
			} else {
				console.error(resp.msg);
				alert('Не удалось отправить сообщение');
				reportError.hide();
			}
		},
		onError: function() {
			alert('Не удалось отправить сообщение');
			reportError.hide();
		}
	}).on('click', '[type=submit]', function(evt) {
		evt.preventDefault();

		var err = reportError.find('.-form-error').hide(),
			msg = reportError.find('[name=message]').val().replace(/(^\s+|\s+$)/g, ''),
			title = reportError.find('[name=title]').val().replace(/(^\s+|\s+$)/g, '');

		if (!msg.length || !title.length) {
			err.show();
			return false;
		}

		reportError.formAjax('submit');
	});

	$('[placeholder]').not('.-ignore-placeholder').focus(function() {
		var input = $(this);
		if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		}
	}).blur(function() {
		var input = $(this);
		if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		}
	}).blur().parents('form').submit(function() {
		$(this).find('[placeholder]').each(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			}
		})
	});

	$(".slider-list").nivoSlider({
		effect: "slideInRight",
		directionNav: false,
		afterLoad: function(){
			$(".slider-list").css({visibility: 'visible'});
		}
	});

	$(".spinner-input").spinner({
		min: 1,
		max: 99999
	});

	// карусель на странице товара
	if(typeof $.fn.carouFredSel != 'undefined')
		$(".item-single .carousel ul").carouFredSel({
			items : 6,
			auto: false,
			prev: ".item-single .carousel .prev",
			next: ".item-single .carousel .next"
		});

	// four banners
	$(window).resize(changeTeaserWidth);
	changeTeaserWidth();
	$('.banners').css({visibility: 'visible'});

	$(".items-switcher .display-grid").click(function() {

		$(".items-switcher .display-list").removeClass("active");
		$(this).addClass("active");
		$(".items-list").removeClass("display-list");
		$(".items-list").addClass("display-grid");

		return false;
	});

	$(".items-switcher .display-list").click(function() {

		$(".items-switcher .display-grid").removeClass("active");
		$(this).addClass("active");
		$(".items-list").addClass("display-list");
		$(".items-list").removeClass("display-grid");

		return false;
	});

	// autocomplete -> shops
	if(typeof shopList != 'undefined')
	    $(".shops-search-input").autocomplete({
	    	source: shopList,
		    select: function( event, ui ){
		        window.location.hash = '!/map/'+ui.item.code+'/';
		        return false;
		    },
		    open: function(){
		    	$('.ui-autocomplete').css({width: '350px'});
		    }
	    });

	$(".item-single-tabs-list .display-characteristics a").click(function(){

		$(".item-single-tabs-list .display-description").removeClass("active");
		$(".item-single-tabs-list .display-characteristics").addClass("active");
		$(".item-single-description").hide();
		$(".item-single-actions").hide();
		$(".item-single-characteristics").show();

		return false;
	});

	$(".item-single-tabs-list .display-description a").click(function(){

		$(".item-single-tabs-list .display-characteristics").removeClass("active");
		$(".item-single-tabs-list .display-description").addClass("active");
		$(".item-single-characteristics").hide();
		$(".item-single-actions").hide();
		$(".item-single-description").show();

		return false;
	});
	
	$(".item-single-tabs-list .display-actions a").click(function(){

		$(".item-single-tabs-list .display-characteristics").removeClass("active");
		$(".item-single-tabs-list .display-description").removeClass("active");
		$(".item-single-tabs-list .display-actions").addClass("active");
		$(".item-single-characteristics").hide();
		$(".item-single-description").hide();
		$(".item-single-actions").show();

		return false;
	});

	function changeIcon(img) {
		if (img.attr("data-another-icon")){
			var src = img.attr("src");
			img.attr("src", img.attr("data-another-icon"));
			img.attr("data-another-icon", src);
		}
	}

	function removeBottomPanel() {
		$('.bottom-navigation').removeClass('bottom-navigation-free');
		$('.bottom-navigation-list > li').removeClass('active');
		$('#overlay').remove();
	}

	$('.partners-list').find("li").hover(function(){
		var img = $(this).find("img");
		changeIcon(img)

	}, function(bnwIcon){
		var img = $(this).find("img");
		changeIcon(img)
	})

	// первая вкладка открывается
	$('.-product-desc-tabs a').eq(0).click();

	// fancybox, где надо
	if(typeof $.fn.fancybox != 'undefined'){
		$('.image-gallery a, .image-gallery-product').fancybox({
			centerOnScroll: true
		});
		$('.-catalog-element-windows').fancybox({
			centerOnScroll: true,
			type: 'inline',
			padding: 0
		});
	}

	$('.brand-text').each(function() {
		var item = $(this),
			text_height = item.height(),
			collapse_height = parseInt( item.css('line-height') ) * 10, //10 lines height
			more_text = 'Показать еще',
			less_text = 'Свернуть',
			description = $('.brand-description')
		if(text_height > collapse_height) {
			var button = $('<div class="more" />');
			button.html('<a href="#"><span>' + more_text + '</span></a>');
			button.find('a').click(function(e) {
				e.preventDefault();
				var $this = $(this),
					$parent = $this.parent();
				if ($parent.hasClass('less')) {
					$parent.removeClass('less');
					item.animate({height : collapse_height}, 300);
					$this.find('span').text(more_text);
				} else {
					$parent.addClass('less');
					item.animate({height : text_height}, 300);
					$this.find('span').text(less_text);
				}
			});
			item.height(collapse_height);
			description.append(button);
		}
	});

	$('.brand-menu').find("li").each(function(){
		$(this).click(function() {

			$('.brand-menu').find("li").removeClass("active");
			$(this).addClass("active");
			var arrival = $(this).attr("data-arrival");

			$('.brand-category').each(function(){
			var destination = $(this).attr("data-destination")
			if (arrival == destination){
				var scrollTop = $(this).offset().top;
				$('body,html').animate({scrollTop: scrollTop + "px"}, 130);
			}
			});


        });
	})

	window.toBasketSingle('.-add-2-basket-single-card');

	window.toBasket('.-a2b-basket-list');

	window.toFavoriteSingle('.item-single-favorite');

	window.toCompareSingle('.item-single-compare');

	window.toCompare('.-ic');

	window.toFavorite('.-favorite-list');

	$.publish('lazyLoadRefresh');

	// заказ в один клик
	$('.item-single-one-click').formAjax({
		url: '/catalog/phone_callback.php',
		dataType: 'json',
		useValidator: function(){
			var input = $('.-iso-click-phone');
			if(input.val().length <= 0){
				input.focus();
				return false;
			}

			return true;
		},
		onSuccess: function() {
			// clear phone input
			$('.-iso-click-phone').val('');
			$('.-buy-one-click-win').click();
		},
		onLoaderShow: function(){
			$('.-iso-click-buy').addClass('iso-one-click-loading');
		},
		onLoaderHide: function(){
			$('.-iso-click-buy').removeClass('iso-one-click-loading');
		}
	});

	// показать ещё свойства
	$('.item-single-characteristics-show-more').on('click', 'a', function(evt) {
		evt.preventDefault();
		$('.-additional-props').show();
		$(this).remove();
	});


	// нижняя панель
	$('.bottom-navigation-list > li.-pupup-open').find('.-po-handler').click(function() {

		$('.bottom-navigation').addClass('bottom-navigation-free');

		var item = $(this).parent();

		$('.bottom-navigation-list > li').removeClass('active');
		item.addClass('active');

		$('.page').append('<div id="overlay" class="-overlay-footer"></div>').each(function() {

			var docHeight = $(document).height();

			$('#overlay')
				.height(docHeight)
				.css({
					'opacity' : 0.4,
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background-color': 'black',
					'width': '100%',
					'z-index': 10
				})
				.on('click', function(e) {
					removeBottomPanel();
				});

			$(document.body).on('keydown', function(e) {
				if (e.type == 'keydown' && e.keyCode != 27) {
					return false;
				}
				removeBottomPanel();
				$(this).unbind('keydown');
			});
		});

		if(!window.__rwLoaded){

			$('.rw-container').formAjax({
				url: '/catalog/recently_viewed.php',
				onSuccess: function(){

					item.find(".bottom-navigation-popup-carusel ul").carouFredSel({
						auto: false,
						scroll	: {
							items : 1
						},
						prev: ".bottom-navigation-popup-carusel .next",
						next: ".bottom-navigation-popup-carusel .prev"
					});
					window.toBasket($('.-a2b-basket-list', item));

					window.__rwLoaded = true;
				},
				onError: function(){
					item.find('.rw-error').show();
				}
			}).formAjax('submit');

		}

		return false;
	});

});


(function($){

	// контроллер, который отображает корзину в шапке и знает, какие элементы добавлены в корзину на данный момент
	$.fn.add2basketLine = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'add2basketLine',opts:{
			cases: ['товар', 'товара', 'товаров'], // имена числительные
			cart: {} // содержимое корзины на момент хита
		}};

		/*** methods standard ***/
		self.init = function(opts){

			//var common = {};
			var opts = $.extend(self.opts, opts);
			return this.each(function(){

				var $this = $(this);
				if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе

				//////////////////////////////////////////////////////////
				///////////////

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					vars: { // переменные величины
						cart: {}
					},
					/*
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					*/
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}

				// тут дальнейшая инициализация
				data.vars.cart = data.opts.cart;

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);
			});
		}

		/*** methods public ***/
		self.update = function(update){

			return this.each(function(){


				var data = $(this).data(self.pcode);
				if(typeof(data) == 'undefined') return;

				data.dom.find('.-a2b-line-quantity').text(+update.quantity);
				data.dom.find('.-a2b-line-label').text(self._plural.apply(data, [update.quantity]));
				data.dom.find('.-a2b-line-price').text(self._formatCurr(update.price));

				if(typeof update.cart != 'undefined')
					data.vars.cart = update.cart;
			});
		}
		self.format = function(val){
			return self._formatCurr(val);
		}
		self.inCart = function(prodId){

			var data = $(this).eq(0).data(self.pcode);
			if(typeof(data) == 'undefined') return;

			return typeof data.vars.cart[prodId] != 'undefined';
		}

		self.showNotice = function(prodName) {};

		/*** methods private ***/
		self._plural = function(n){

			if(n % 10 == 1 && n % 100 != 11)
				return this.opts.cases[0]; // 101 минута

			if(n % 10 >= 2 && n % 10 <= 4 && ( n % 100 < 10 || n % 100 >= 20))
				return this.opts.cases[1]; // 33 минуты

			return this.opts.cases[2]; // 10 минут

		}
		self._formatCurr = function(val){

			if(!isNaN(val = parseFloat(val))){
				var int_ = self._triadize(Math.floor(val));
				var fract_ = (self._round(val - Math.floor(val), 2, 'PHP_ROUND_HALF_DOWN')*100).toString();

				if(parseInt(fract_) == 0)
					fract_ = '';
				else if(fract_.length == 1)
					fract_ += '0';

				return int_+(fract_.length ? '.'+fract_ : '');

			}else
				return 0;
		}
		self._triadize = function(value){

			var inverse = function(val){
				newstr = '';
				for(i = val.length-1; i >= 0; i--)
					newstr += val.charAt(i);

					return newstr;
			};

			value = inverse(value.toString().replace(/\s+/gi, ''));

			newstr = '';
			for(i=0;i<value.length;i++){
				if(i > 0 && (i % 3 == 0))
					newstr += ' ';
				newstr += value.charAt(i);
			}

			return inverse(newstr);
		}

		self._round = function(value, precision, mode) {
		  // http://kevin.vanzonneveld.net
		  var m, f, isHalf, sgn; // helper variables
		  precision |= 0; // making sure precision is integer
		  m = Math.pow(10, precision);
		  value *= m;
		  sgn = (value > 0) | -(value < 0); // sign of the number
		  isHalf = value % 1 === 0.5 * sgn;
		  f = Math.floor(value);

		  if (isHalf) {
		    switch (mode) {
		    case 'PHP_ROUND_HALF_DOWN':
		      value = f + (sgn < 0); // rounds .5 toward zero
		      break;
		    case 'PHP_ROUND_HALF_EVEN':
		      value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
		      break;
		    case 'PHP_ROUND_HALF_ODD':
		      value = f + !(f % 2); // rounds .5 towards the next odd integer
		      break;
		    default:
		      value = f + (sgn > 0); // rounds .5 away from zero
		    }
		  }

		  return (isHalf ? value : Math.round(value)) / m;
		}

		// разбор todo
	    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
	    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

	// контроллер, который отображает счётчик товаров в сравнении и знает, какие элементы добавлены в сравнение на данный момент
	$.fn.add2compareLine = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'add2compareLine',opts:{
			list: [] // текущий список сравнения
		}};

		/*** methods standard ***/
		self.init = function(opts){

			//var common = {};
			var opts = $.extend(self.opts, opts);
			return this.each(function(){

				var $this = $(this);
				if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе

				//////////////////////////////////////////////////////////
				///////////////

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					vars: { // переменные величины
						list: {}
					},
					/*
					tmpls: {},
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					*/
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}

				// тут дальнейшая инициализация
				var so = data.opts;
				var sv = data.vars;
				for(k in so.list)
					sv.list[so.list[k]] = true;

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);
			});
		}

		/*** methods public ***/
		self.update = function(update){

			return this.each(function(){
				var data = $(this).data(self.pcode);
				if(typeof(data) == 'undefined') return;

				data.dom.find('.-a2c-line-quantity').text(+update.quantity);
				data.vars.list = {};
				for(k in update.list)
					data.vars.list[update.list[k]] = true;
			});
		}
		self.inCompare = function(prodId){
			var data = $(this).eq(0).data(self.pcode);
			if(typeof(data) == 'undefined') return;
			return typeof data.vars.list[prodId] != 'undefined';
		}

		/*** methods private ***/

		// разбор todo
	    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
	    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

	// кнопка добавления товара в корзину
	// перевести на formAjax
	$.fn.add2basketButton = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'add2basketButton',opts:{
			url: '/catalog/add2basket.php', // url, по которому лежит скрипт добавления в корзину
			fields: {}, // дополнительные поля, которые передаются в запросе
			mode: 'active', // режим работы. 'active' - показывает активные товары, 'delayed' - показывает отложенные товары
			group: '', // группа кнопок, которые реагируют на события друг от друга
			whenSuccess: function(){ // что происходит при успешном добавлении
				this.ctrls.error.hide();
				this.ctrls.success.stop(true, true).fadeIn(300, function(){$(this).delay(700).fadeOut(300)});
			},
			whenError: function(){ // что происходит при ошибке
				this.ctrls.error.show();
			},
			whenInCart: function(id){return false}, // вызывается, чтобы проверить, что этот товар в корзине
			onSuccess: function(result){}, // вызывается, когда товар успешно добавлен в корзину
			onInCart: function(){}, // вызвается, когда скрипт обнаруживает, что товар добавлен в корзину
			onNotInCart: function(){}, // вызвается, когда скрипт обнаруживает, что товар убран из корзины
			onLoaderShow: function(){}, // что нужно ещё делать, когда лоадер показывается
			onLoaderHide: function(){} // что нужно ещё делать, когда лоадер скрывается
		}};

		/*** methods standard ***/
		self.init = function(opts){

			//var common = {};
			var opts = $.extend(self.opts, opts);
			return this.each(function(){

				var $this = $(this);
				if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе

				//////////////////////////////////////////////////////////
				///////////////

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					ctrls: { // хранимые контролы
						loader: $('.-a2b-loader', $this).delayedLoader({
							useVisibility: true,
							onLoaderShow: opts.onLoaderShow,
							onLoaderHide: opts.onLoaderHide,
						}),
						success: $('.-a2b-success', $this),
						error: $('.-a2b-error', $this)
					},
					vars: { // переменные величины
						ajaxId: false
					},
					/*
					tmpls: {},
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					*/
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}

				var id = + $this.data('prod-id'),
					props = $this.data('props');

				// тут дальнейшая инициализация
				if(id){

					if(data.opts.whenInCart.apply(data, [id]))
						data.opts.onInCart.apply(data, [id]);
					else
						data.opts.onNotInCart.apply(data, [id]);

					$this.click(function(e){

						if(!id) return;

						if(data.vars.ajaxId !== false && data.vars.ajaxId.readyState < 4)
							data.vars.ajaxId.abort();

						var flds = $.extend({id: id}, data.opts.fields);

						if (props) {
							$.extend(flds, {PROPS: props});
						}

						if(data.opts.mode == 'delayed')
							flds.delayed = 1;

						data.ctrls.loader.show();
						data.vars.ajaxId = $.ajax({
							url: data.opts.url,
							data: flds,
							dataType: 'json',
							success: function(res){
								data.ctrls.loader.hide();

								if(res.result){
									data.opts.whenSuccess.call(data);
									data.opts.onSuccess.apply(data, [res]);

									if ('basket' === data.opts.group) {
										// save total order price
										window.bapp.order_price = res.price;
										// it's a basket event - show popup
										$.publish('product:add2basket', {id: flds.id});
									}

									var inC = false;
									if(data.opts.whenInCart.apply(data, [id])){
										data.opts.onInCart.apply(data, [id]);
										inC = true;
									}else{
										data.opts.onNotInCart.apply(data, [id]);
									}
									$(document).trigger('-a2b-item-in-cart', {in: inC, id: id, group: data.opts.group});
								}else
									data.opts.whenError.call(data);
							},
							error: function(xhr, message, descr){
								if(message == 'abort') return;

								data.opts.whenError.call(data);
								data.ctrls.loader.hide();
								console.error('Ajax failure: '+message+'('+descr+')');
							}
						});

						e.preventDefault();
					});

					$(document).bind('-a2b-item-in-cart', function(e, extra){
						if(extra.id == id && extra.group == data.opts.group){
							if(extra.in)
								data.opts.onInCart.apply(data, [id]);
							else
								data.opts.onNotInCart.apply(data, [id]);
						}
					});
				}

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);
			});
		}

		/*** methods public ***/
		self.option = function(opt, val){
			if(typeof(val) == 'undefined') // предполагается только один элемент
				return this.eq(0).data(self.pcode)[opt];
			else
				return this.each(function(){
					var data = $(this).data(self.pcode);
					if(typeof(data) == 'object')
						data.opts[opt] = val;
				});
		}

		/*** methods private ***/

		// разбор todo
	    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
	    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

	// кнопка добавления товара в сравнение
	$.fn.add2compareButton = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'add2compareButton',opts:{
			url: '/catalog/add2compare.php',
			onLoaderShow: function(){},
			onLoaderHide: function(){},
			onSuccess: function(res){},
			onInCompare: function(){}, // вызвается, когда скрипт обнаруживает, что товар уже в сравнении

			whenInCompare: function(id){return false} // вызывается, чтобы проверить, что этот товар в сравнении
		}};

		/*** methods standard ***/
		self.init = function(opts){

			//var common = {};
			var opts = $.extend(self.opts, opts);
			return this.each(function(){

				var $this = $(this);
				if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе

				//////////////////////////////////////////////////////////
				///////////////

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					ctrls: { // хранимые контролы
					},
					/*
					vars: { // переменные величины
					},
					tmpls: {},
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					*/
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}

				var so = data.opts;
				var sv = data.vars;
				var sc = data.ctrls;

				// тут дальнейшая инициализация
				var id = +$this.find('input[name="id"]').val();

				if(id){
					if(data.opts.whenInCompare.apply(data, [id]))
						data.opts.onInCompare.apply(data, [id]);

					$this.formAjax({
						url: so.url,
						dataType: 'json',
						onLoaderShow: so.onLoaderShow,
						onLoaderHide: so.onLoaderHide,
						onSuccess: function(res){
							so.onSuccess.apply(data, [res]);

							if(res.present)
								data.opts.onInCompare.apply(data, [id]);
							else
								data.opts.onNotInCompare.apply(data, [id]);
						}
					});

					$(document).bind('-a2b-item-in-compare', function(e, extra){
						if(extra.id == id){
							if(extra.in)
								data.opts.onInCompare.apply(data, [id]);
							else
								data.opts.onNotInCompare.apply(data, [id]);
						}
					});
				}

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);
			});
		}

		/*** methods public ***/

		/*** methods private ***/

		// разбор todo
	    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
	    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

	$.fn.delayedLoader=function(op){return new(function(options,dom){var self=this;self._dom=dom;

		/*** defaults ***/
		self.opts = {
			timeout: 500,
			preload: [],
			hideOnCreate: true,
			useVisibility: false, // если true, то будет меняться css visibility. это позволит не делать прелоадинг картинки
			whenLoaderShow: function(self){ // что сделать, чтобы показать лоадер
				self.opts.useVisibility ? this.css('visibility', 'visible') : this.show();
			},
			whenLoaderHide: function(self){ // что сделать, чтобы скрыть лоадер
				self.opts.useVisibility ? this.css('visibility', 'hidden') : this.hide();
			},
			onLoaderShow: function(){}, // что нужно ещё делать, когда лоадер показывается
			onLoaderHide: function(){} // что нужно ещё делать, когда лоадер скрывается
		}
		if(typeof(options) == 'object')
			$.extend(self.opts, options);

		self.vars = {
			loaderTimeout: 0,
			shown: false
		};

		/*** public ***/
		/* props */
		/* methods */
		self.show = function(){
			if(self.vars.shown) return;
			clearTimeout(self.vars.loaderTimeout);
			self.vars.loaderTimeout = setTimeout(self.showImmediately, self.opts.timeout);
			return self;
		}
		self.hide = function(){
			clearTimeout(self.vars.loaderTimeout);

			//console.dir('DL HIDE');

			self.opts.onLoaderHide.apply(self._dom, [self]);
			self.opts.whenLoaderHide.apply(self._dom, [self]);
			self.vars.shown = false;
			return self;
		}
		self.showImmediately = function(){

			//console.dir('DL SHOW');

			self.opts.onLoaderShow.apply(self._dom, [self]);
			self.opts.whenLoaderShow.apply(self._dom, [self]);
			self.vars.shown = true;
			return self;
		}

		/*** private ***/
		/* props */
		/* methods */

		/*** init ***/
		var images = typeof(self.opts.preload) == 'string' ? [self.opts.preload] : self.opts.preload;
		if(images.length > 0){
			if(!document.preload) document.preload = [];

			for(var i = 0; i < images.length; i++){
				var img = new Image();
				img.src = images[i];
				document.preload.push(img);
			}
		}

		if(self.opts.hideOnCreate)
			self.hide();

		/*** finally ***/

	})(op,this.eq(0))}

	$.fn.formAjax = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'formAjax',options:{
			url: '',
			tag: '', // тег аяксового вызова
			dataType: 'html',
			escapeJSON: true,
			groups: [],
			flds: {}, // дополнительные поля для запроса
			container: false, // явно указанный контейнер для вставки ajax
			useValidator: false, // если false, то валидация не будет проводиться. если function, то она выполнится и возвратит результат проверки (boolean). если true, то будет использован плагин jquery validator
			blockingCall: false, // если true, то невозможно будет послать два запроса одновременно
			dontHideLoader: false, // если true, то лоадер не будет скрыт при получении ответа (это полезно если ответ потом идёт на дальнейшую длительную обработку)

			onBeforeCall: function(data){}, // перед посылкой запроса
			onError: function(){}, // обработка ошибки ajax
			onSuccess: function(){}, // вызвается при успешном вызове ajax
			onAbort: function(){}, // при отмене вызова
			onValidationFail: function(){}, // при провале валидации

			onLoaderShow: function(){},
			onLoaderHide: function(){}
		}};

		/*** methods standard ***/
		self.init = function(options){

			var common = {};
			var opts = $.extend(self.options, options);
			return this.each(function(){

				var $this = $(this);
				if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе

				//////////////////////////////////////////////////////////
				///////////////

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					ctrls: { // хранимые контролы
						form: false
					},
					vars: { // переменные величины
						filter: false,
						lock: false
					},
					tmpls: {},
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}

				// контейнер ajax может лежать вовне формы (тогда он должен быть указан явно через опцию container), или же быть внутри формы, или же быть самой формой. это зависит от вёстки
				var externCont = $(data.opts.container);
				data.ctrls.container = externCont.length > 0 ? externCont : ($this.is('.-af-container') ? $this : $this.find('.-af-container'));
				self._updateForm.call(data);

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);
			});
		}

		/*** methods public ***/
		// задаёт фильтрацию инпутов по селектору класса
		self.setFilter = function(group){
			return this.each(function(){
				if(group.toString().length > 0){
					var data = $(this).data(self.pcode);
					if(typeof(data) == 'object')
						data.vars.filter = group.toString();
				}
			});
		}
		// отменяет посылку ajax-запроса
		self.abort = function(){
			return this.each(function(){
				var data = $(this).data(self.pcode);
				if(typeof(data) == 'object' && typeof data.vars.ajaxHandle == 'object'){
					data.vars.ajaxHandle.abort();
					data.vars.ajaxAborted = true;
				}
			});
		}
		// возвращает true, если ответ на запрос ещё не пришёл
		self.queryInProcess = function(){
			var data = $(this).eq(0).data(self.pcode);
			if(typeof(data) == 'object' && typeof data.vars.ajaxHandle == 'object')
				return data.vars.ajaxHandle.readyState < 4;
			return false;
		}
		// перечитывает все контролы формы. полезно если форма перезатирается на каждом вызове
		self.update = function(){
			return this.each(function(){
				var data = $(this).data(self.pcode);
				if(typeof(data) == 'object'){
					self._updateForm.call(data);
				}
			});
		}
		// очищает форму и скрывает сообщения (-af-hide-before)
		self.clear = function(){
			return this.each(function(){
				var data = $(this).data(self.pcode);
				if(typeof(data) == 'object'){
					data.ctrls.inputs.not('input[type="submit"]').not('input[type="hidden"]').val('');
					data.ctrls.hideBefore.hide();
				}
			});
		}
		// отправляет форму
		self.submit = function(){

			return this.each(function(){
				var data = $(this).data(self.pcode);
				if(typeof(data) == 'object'){
					self._submit.call(data);
				}
			});
		}

		/*** methods private ***/
		self._submit = function(){

			// если используется валидатор и он подключен...
			if(this.opts.useValidator){
				// это просто функция, которая что-то проверяет
				if(typeof this.opts.useValidator == 'function'){
					if(!this.opts.useValidator.call(this)){
						this.opts.onValidationFail.call(this);
						return false;
					}
				}else
				// это плагин jquery.validate
				if(typeof $.fn.validate == 'function')
					if(!this.ctrls.form.valid()){
						this.opts.onValidationFail.call(this);
						return false;
					}
			}

			if(this.vars.lock && this.opts.blockingCall) return false;

			var fields = $.extend({ajaxTag: this.opts.tag,sessid: window.BX.message['bitrix_sessid']}, this.opts.flds);
			(this.vars.filter !== false ? this.ctrls.inputs.filter(this.vars.filter) : this.ctrls.inputs).each(function(){
				var $this = $(this);
				var name = $this.attr('name');

				if($this.is('input[type="checkbox"]') && !$this.is(':checked'))
					return;

				if($this.is('input[type="radio"]') && !$this.is(':checked'))
					return;

				if(typeof(name) != 'undefined' && name != '')
					fields[name] = $this.val();
			});

			this.opts.onBeforeCall.apply(this, [fields]);
			this.ctrls.hideBefore.hide();

			this.vars.lock = true;
			this.ctrls.loader.show();
			var _this = this;

			this.vars.ajaxAborted = false;
			this.vars.ajaxHandle = $.ajax({
				url: _this.opts.url,
				data: fields,
				type: "POST",
				dataType: _this.opts.dataType,
				success: function(result){

					if(_this.opts.dataType == 'json' && _this.opts.escapeJSON)
						$.each(result, function(i, item){
							if(typeof(item) == 'string')
								result[i] = self._escapeHtml(item.toString());
						});

					if(_this.opts.dataType == 'html' && typeof(_this.ctrls.container) != 'undefined')
						_this.ctrls.container.empty().append(result);

					_this.opts.onSuccess.apply(_this, [result, fields]);
					if(!_this.opts.dontHideLoader)
						_this.ctrls.loader.hide();

					_this.ctrls.success.show();

					_this.vars.lock = false;
				},
				error: function(xhr, message, descr){
					_this.vars.lock = false;
					if(_this.vars.ajaxAborted || message.toString() == 'abort'){
						_this.opts.onAbort.apply(_this);
						return;
					}
					_this.opts.onError.apply(_this, [message+'('+descr+')']);
					console.error('Ajax call failure: '+message+'('+descr+')');
					_this.ctrls.loader.hide();
				}
			});

			return false;
		}
		self._updateForm = function(){

			self._updateControls.call(this);

			this.ctrls.loader = $('.-af-loader', this.dom).delayedLoader({
				useVisibility: true,
				onLoaderShow: this.opts.onLoaderShow,
				onLoaderHide: this.opts.onLoaderHide,
				hideOnCreate: false
			});

			var _this = this;
			this.ctrls.form = (this.dom.is('form') ? this.dom : this.dom.find('form')).unbind('submit.'+self.pcode).bind('submit.'+self.pcode, function(e){
				self._submit.call(_this);
				e.preventDefault();
			});
			this.ctrls.success = $('.-af-success', this.dom);
			this.ctrls.hideBefore = $('.-af-hide-before', this.dom);

			var submit = {length: 0};
			if(this.ctrls.form.is('form')){
				// если у нас есть форма и не задан url, то он берётся из атрибута action
				if(this.opts.url == '')
					this.opts.url = this.ctrls.form.attr('action');

				// если у нас есть форма и внутри сабмит, то берём его
				submit = this.ctrls.form.find('submit');
			}

			(submit.length > 0 ? submit : this.dom.find('.-af-submit')).unbind('click.'+self.pcode).bind('click.'+self.pcode, function(e){
				self._submit.call(_this);
				e.preventDefault();
			});
		}
		self._updateControls = function(){
			this.ctrls.inputs = this.dom.find('button, input, select, textarea');
		}
		self._escapeHtml = function (unsafe) {
		  return unsafe
			  .replace(/&/g, "&amp;")
			  .replace(/</g, "&lt;")
			  .replace(/>/g, "&gt;")
			  .replace(/"/g, "&quot;")
			  .replace(/'/g, "&#039;");
		}

		// разбор todo
		if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
		else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

	// аякс-вызов поиска
	$.fn.resultsAllModel=function(op){return new(function(options,dom){var s=this;

		/*** defaults ***/
		var so = s.opts = {
			url: '',
			tag: ''
		}
		if(typeof(options) == 'object')
			$.extend(s.opts, options);

		var sv = s.vars = { // переменные плагина
			dom: dom,
			lock: false
		};
		var sc = s.ctrls = { // ссылки на контролы плагина
			ajaxTo: $('.-ajax-box-'+so.tag, sv.dom),
			loader: $('.-loader-'+so.tag, sv.dom).delayedLoader(),
			query: $('input[name="q"]', sv.dom),
			form: $('.-sra-form', sv.dom)
		};

		/* public methods */
		s.getQuery = function(){
			return sc.query;
		}

		/* private methods */

	    /*** init ***/
	    sc.form.submit(function(e){
			if(sv.lock) return;

			sv.lock = true;
			sc.loader.show();
			$.ajax({
				type: 'html',
				url: so.url,
				method: 'get',
				data: {
					ajaxTag: so.tag,
					q: sc.query.val()
				},
				success: function(result){
					sc.ajaxTo.empty().append(result);
				},
				complete: function(){
					sv.lock = false;
					sc.loader.hide();
				}
			});

			e.preventDefault();
		});

		sc.query.kpressChange({
			on: function(val){
				if(val.length >= 2)
					sc.form.submit();
			}
		});

		/*** finally ***/

		return s;

	})(op,this.eq(0))}

	$.fn.kpressChange = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'kpressChange',opts:{
			on: function(){},
			debounced: true,
			dbTmout: 500
		}};

		/*** methods standard ***/
		self.init = function(opts){

			//var common = {};
			var opts = $.extend(self.opts, opts);
			return this.each(function(){

				var $this = $(this);
				if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе

				//////////////////////////////////////////////////////////
				///////////////

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					/*
					ctrls: { // хранимые контролы
					},
					*/
					vars: { // переменные величины
						val: '',
						changeOff: false // флаг отключает обработку onChange, пока фокус ввода внутри инпута
					},
					/*
					tmpls: {},
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					*/
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}

				// тут дальнейшая инициализация
				if(!$this.not('input[type="text"]') && !$this.not('textarea')) return;

				data.vars.on = data.opts.debounced ? $.debounce(data.opts.on, data.opts.dbTmout) : data.opts.on;

				$this.keyup(function(){
					var v = $(this).val();

					if(v != data.vars.val){
						data.vars.on.apply($(this), [v]);
						data.vars.val = v;
					}
				}).change(function(){

					if(data.vars.changeOff) return;

					var obj = $(this);
					var v = obj.val();
					data.vars.on.apply(obj, [v]);
					data.vars.val = v;
				}).blur(function(){
					data.vars.changeOff = false;
				}).focus(function(){
					data.vars.changeOff = true;
				});

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);

			});
		}

		/*** methods public ***/

		/*** methods private ***/

		// разбор todo
	    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
	    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

	$.fn.adminBorders = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'adminBorders',opts:{
			editTextLabel: 'Редактировать элемент',
			removeTextLabel: 'Удалить элемент',
			sessid: 0,
			iblockType: false,
			iblockId: false,
			sessid: false,
			backURL: '',
			idAttribName: 'bxid' // элемент обязательно должен содержать атрибут с этим именем, и значением равным ID элемента инфоблока
		}};

		/*** methods standard ***/
		self.init = function(opts){

			//var common = {};
			var opts = $.extend(self.opts, opts);
			return this.each(function(){

				var $this = $(this);
				if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе

				//////////////////////////////////////////////////////////
				///////////////

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					ctrls: { // хранимые контролы
					},
					/*
					vars: { // переменные величины
					},
					tmpls: {},
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					*/
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}

				// если мы не находимся в режиме редактирования
				if(!$('#bx_incl_area_1').is('div')) return;

				var bxId = $this.attr(data.opts.idAttribName);
				if(typeof bxId == 'undefined') return;

				var rndId = 'bx_'+Math.ceil(Math.random()*1000);
				$this.attr('id', rndId);

				BX.ready(function(){

					BX.admin.setComponentBorder(rndId);

					(new BX.CMenuOpener({
						'parent':rndId,
						'menu':[{
							'ICONCLASS':'bx-context-toolbar-edit-icon',
							'TITLE':'',
							'TEXT':data.opts.editTextLabel,
							'ONCLICK':'(new BX.CAdminDialog({\'content_url\':\'/bitrix/admin/iblock_element_edit.php?type='+data.opts.iblockType+'&lang=ru&IBLOCK_ID='+data.opts.iblockId+'&ID='+bxId+'&filter_section=0&bxpublic=Y&from_module=iblock&return_url='+data.opts.backURL+'\',\'width\':\'913\',\'height\':\'617\'})).Show()'
						},{
							'ICONCLASS':'bx-context-toolbar-delete-icon',
							'TITLE':'',
							'TEXT':data.opts.removeTextLabel,

							'ONCLICK':'if(confirm(\'Будет удалена вся информация, связанная с этой записью. Продолжить?\')) jsUtils.Redirect([], \'/bitrix/admin/iblock_element_admin.php?IBLOCK_ID='+data.opts.iblockId+'&type='+data.opts.iblockType+'&lang=ru&action=delete&ID='+bxId+'&return_url='+data.opts.backURL+'&sessid='+data.opts.sessid+'\');'
						}]
					})).Show();

				});

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);
			});
		}

		/*** methods public ***/
		self.publicMethodSample = function(arg1, arg2){
			return this.each(function(){
				var data = $(this).data(self.pcode);
				if(typeof(data) == 'undefined') return;
				// делаем тут что нибудь полезное для this и data
			});
		}

		/*** methods private ***/

		// разбор todo
	    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
	    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

})(jQuery);

/* Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)*/
(function(g){g.extend({debounce:function(e,f,a,b){3==arguments.length&&"boolean"!=typeof a&&(b=a,a=!1);var c;return function(){var d=arguments;b=b||this;a&&!c&&e.apply(b,d);clearTimeout(c);c=setTimeout(function(){!a&&e.apply(b,d);c=null},f)}},throttle:function(e,f,a){var b,c,d;return function(){c=arguments;d=!0;a=a||this;b||function(){d?(e.apply(a,c),d=!1,b=setTimeout(arguments.callee,f)):b=null}()}}})})(jQuery);

function activateRSS(url){
	$('.rss a').attr('href', $('.-native-rss').hide().attr('href')).css('display', 'block');
}

function getClientWidth() {

	return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
}



function changeTeaserWidth() {

	var currentClientWidth = getClientWidth();

	if (currentClientWidth < 1256) {

		$('body').removeClass('large');
		$('body').addClass('small');
	}

	if (currentClientWidth >= 1256) {

		$('body').removeClass('small');
		$('body').addClass('large');
	}
}

function CRouter(options){

	var self = this;

	/*** defaults ***/
	self.options = {
		routes: {}, // маршруты, которые подхватывает роутер
		interval: 100, // интервал проверки hash на изменения
		onEachNav: function(){} // callback, который вызывается при каждом изменении маршрута
	}
	self.vars = {
		hash: '',
		history: [],
		renew: false
	}
	$.extend(self.options, options);

	/*** public methods ***/
	self.navigate = function(route, args, onlyOnEmpty){

		if(onlyOnEmpty && window.location.hash != '') return;

		if(typeof(self.options.routes[route]) == 'object'){

			var hash = self.options.routes[route].hash;
			if(typeof(args) != 'undefined')
				$.each(args, function(i, item){
					hash = hash.replace('{'+i+'}', item);
				});

			window.location.hash = hash;
		}
	}
	self.back = function(){
		var prev = self.history.prev();
		if(prev !== false){
			self.navigate(prev);
		}
	}
	self.renewRoute = function(){
		self.vars.renew = true;
	}

	self.history = {
		prev: function(){
			var item = self.vars.history[self.vars.history.length - 2];
			return typeof item == 'undefined' ? false : item;
		}
	}

	/*** private methods ***/

    /*** init ***/
    $(function(){
		self.vars.handler = setInterval(function(){
			var h = window.location.hash.slice(1);
			if(self.vars.renew || h != self.vars.hash){
				self.vars.renew = false;
				var interrupt = false; // флаг прерывания
				$.each(self.options.routes, function(i, item){
					if(interrupt) return;
					if(h.match(item.regexp)){

						results = item.regexp.exec(h);
						self.vars.history.push(i);

						if(item.handler.apply(self, results.slice(1)) === false) // если обработчик возвращает false, то не продолжать провеку других путей
							interrupt = true;

						self.options.onEachNav.apply(self, [item]);
					}
				});

				self.vars.hash = h;
			}
		}, self.options.interval);
	});

	/*** finally ***/
	$.each(self.options.routes, function(i, route){
		// {variable} => ([a-z0-9-_]+)
		route.regexp = new RegExp(route.hash.replace(/{[a-z0-9-_]+}/ig, '([a-z0-9-_]+)'));
	});

	if(window.location.hash == ''){
		$.each(self.options.routes, function(i, item){
			if(item.initial)
				self.navigate(i);
		});
	}

return self;}

function CShopMap(opts){

	/*** defaults ***/
	var s = this;
	$.extend(s, {
		opts: {}, // опции по умолчанию
		vars: {}, // значимые переменные
		/*
		ctrls: {}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
		*/
	});
	if(typeof opts == 'object')
		$.extend(s.opts, opts);

	/*** public ***/
	/* methods */
	s.moveTo = function(shop){

		var point = so.items[shop];

		if(typeof point == 'undefined') return;

		so.map.panTo(point.loc, {delay: 100, callback: function(){
			if(typeof point.mark != 'undefined')
				point.mark.balloon.open();
		}});
	}

	/*** private ***/
	/* methods */

    /*** init ***/
	var so = s.opts;
	var sv = s.vars;
	//var sc = s.ctrls;

	if(typeof so.items == 'undefined' || typeof so.map == 'undefined') return s;

	//########################

	var balloonContentLayout = ymaps.templateLayoutFactory.createClass(
		'$[properties.balloon]'
	    /*,{
	        build: function () {
	            balloonContentLayout.superclass.build.call(this);
	        },
	        clear: function () {
	            balloonContentLayout.superclass.clear.call(this);
	        },
	    }*/
	);

	var balloonLayout = ymaps.templateLayoutFactory.createClass(

		'<ymaps class="bubble" style="top: auto; left: 0; bottom: 0">'+
			'$[[options.contentLayout]]'+
			'<div class="bubble-bullet"></div>'+

			/*
			'<div class="balloon_close"></div>'+
	    	'<div class="balloon_tail"><div class="balloon_tail_body"></div></div>'+
	    	*/

		'</ymaps>'

		/*
		,{
	        build: function () {
	            balloonLayout.superclass.build.call(this);

	            console.dir(this.getClientBounds());
	        },
	        clear: function () {
	            balloonLayout.superclass.clear.call(this);
	        },
	    }
	    */

	);

	//////////////////////////

	for(k in so.items){
		so.items[k].loc = [so.items[k].loc[0], so.items[k].loc[1]];

		so.map.geoObjects.add(so.items[k].mark = new ymaps.GeoObject({
	        geometry: {
	            type: "Point",
	            coordinates: so.items[k].loc
	        },
	        properties: {
	            balloon: so.items[k].baloon
	        }
	    },{
	    	balloonLayout: balloonLayout,
	        balloonContentBodyLayout: balloonContentLayout,

	        balloonShadow: false,
	        balloonOffset: [-101, -25]
	    }));

	}


	/*** finally ***/

	return s;
}

window.allowedDomains = [];

// will set future event handler
$(document).on('click', '.-order-checkout-button', function(evt) {

	var app       = window.bapp,
		price     = app && app.order_price,
		min_price = app && app.min_order_price,
		min_summ  = app && app.min_credit_summ,
		max_summ  = app && app.max_credit_summ,
		payment   = $('.payment:checked').data('id');

	if (price < min_price) {
		evt.preventDefault();
	}
	if (payment == 5 && (price < min_summ || price > max_summ) ) {
		evt.preventDefault();
	}

})

$(document).ready(function(){

	var $container = $('.snowmax-advantages-list ul');

	$container.masonry({
		'itemSelector': 'li'
	});

	$(".header-information-switch a").click(function(e) {
		e.preventDefault();

		var $li = $(this).parents("li"),
			body_class = "." + $li.data("tab");

		$li.addClass("active").siblings().removeClass("active");
		$(".header-information-body > div").removeClass("active");
		$(body_class).addClass("active");
	});

	// show popup after add-2-basket
	$.subscribe('product:add2basket', function(evt, data) {
		var id  = data && data.id,
			url = '/catalog/a2bnotify.php?id=' + id;

		if (!id) {
			console.warn('cannot show added2basket popup without id');
			return;
		}

		$.fancybox.open(url, {
			type       : 'ajax',
			fitToView  : false,
			autoSize   : true,
			padding    : 0,
			title      : null,
			tpl        : {
				closeBtn: '<a title="Закрыть" class="modal-window-close" href="#"></a>'
			},
			beforeShow : function() {
				// show min order price warning ?
				var app = window.bapp;
					bShowWarning = app.order_price < app.min_order_price;

				if (bShowWarning) {
					this.inner.find('.-min-order-sum-alert').show();
					this.inner.find('.-order-checkout-button').css('opacity', 0.4);
				}

				// this refers to current fancybox object
				this.inner.on('click', '.-fancybox-close', function(evt) {
					evt.preventDefault();
					$.fancybox.close();
				});
			}
		});
	});
	window.toFavoriteSingle('.item-list-favorite');
});

// jQuery pub-sub pattern
(function($) {
	var o = $({});

	$.each({
		subscribe   : 'on',
		unsubscribe : 'off',
		publish     : 'trigger'
	}, function(api, method) {
		jQuery[ api ] = function() {
			o[ method ].apply(o, arguments);
		};
	});
})(jQuery);

// refresh lazy images loading
$.subscribe('lazyLoadRefresh', function() {
	$('.-lazy').lazyload({ 
		effect      : 'fadeIn',
		threshold   : 200,
		placeholder : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDNUREODBFRTRCMTFFNDg1QUY4N0ZERkY0MkI4QzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDNUREODFFRTRCMTFFNDg1QUY4N0ZERkY0MkI4QzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0Q0M1REQ3RUVFNEIxMUU0ODVBRjg3RkRGRjQyQjhDNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0Q0M1REQ3RkVFNEIxMUU0ODVBRjg3RkRGRjQyQjhDNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpyHB38AAAAGUExURf///wAAAFXC034AAAABdFJOUwBA5thmAAAADElEQVR42mJgAAgwAAACAAFPbVnhAAAAAElFTkSuQmCC',
		load        : function() {
			$(this).removeClass('-lazy');
		}
	}); 
});

// on a way to proper js
(function(w, $, undefined) {
	var app = w.bapp = {
		getProductOffersPopup: function(iblock_id, product_id, is_credit) {
			var url = '/catalog/getoffers.php?iblock_id=IBLOCK_ID&id=PRODUCT_ID'
						.replace(/IBLOCK_ID/, iblock_id)
						.replace(/PRODUCT_ID/, product_id);

			if (is_credit) {
				url += '&is_credit=Y';
			}

			// show offers popup
			$.fancybox.open(url, {
				type: 'ajax',
				filToView: false,
				autoSize: true,
				padding: 0,
				title: null,
				tpl: {
					closeBtn: '<a title="Закрыть" class="modal-window-close" href="#"></a>'
				},
				beforeShow: function() {
					// this refers to current fancybox object
					this.inner.find('input[type=radio]').eq(0).prop('checked', true);
				}
			});
		},
		getCreditPopup: function(data, is_offer) {

			var url = '/catalog/get_credit_form.php?iblock_id=IBLOCK_ID&id=PRODUCT_ID&name=NAME&price=PRICE&section=SECTION'
						.replace(/IBLOCK_ID/, data.iblock_id)
						.replace(/PRODUCT_ID/, data.id)
						.replace(/NAME/, encodeURIComponent(data.name))
						.replace(/PRICE/, data.price)
						.replace(/SECTION/, encodeURIComponent(data.section));

			if (is_offer) {
				url += '&is_offer=Y';
			}

			// show offers popup
			$.fancybox.open(url, {
				type: 'ajax',
				filToView: false,
				autoSize: true,
				padding: 0,
				title: null,
				tpl: {
					closeBtn: '<a title="Закрыть" class="modal-window-close" href="#"></a>'
				},
				beforeShow: function() {
					try {
						w.bapp.initCreditForm();
					} catch(e) {
						console.error(e);
					}
				}
			});
		}
	};
})(window, jQuery);

$(function() {

	// click buy on product with offer
	$(document.body).on('click', '.-a2b-basket-offers', function(evt) {
		evt.preventDefault();
		var self = $(this);
		window.bapp.getProductOffersPopup(self.data('iblock-id'), self.data('prod-id'), false);
	});

	// click add2bakset on product offers popup
	$(document.body).on('click', '.-add-offer-2-basket', function(evt) {
		ga('send', 'event', 'cart', 'cart_add');
		evt.preventDefault();

		if (!$.fancybox.isOpen) {
			return;
		}

		var self = $(this),
			inp = $('.-buy-offer-form').find('input:checked'),
			loader = self.next(),
			data = {
				id: inp.val(),
				PROPS: inp.data('props')
			},
			url = '/catalog/add2basket.php';

		// hide caption
		self.val('');
		// show loader
		loader.css({
			visibility: 'visible'
		});

		$.getJSON(url, data, function(resp) {
			// close popup
			$.fancybox.close();
			// show basket notification (after fancybox closes)
			setTimeout(function() {
				window._hcb
					.add2basketLine('update', resp);
				// save total order price
				window.bapp.order_price = resp.price;
				// it's a basket event - show popup
				$.publish('product:add2basket', {id: data.id});

				window._hcb.add2basketLine('inCart', inp.val());
			}, 1000);
		}).always(function() {
			// show caption
			self.val('В корзину');
			// hide loader
			loader.css({
				visibility: 'hidden'
			});
		});
	});

	// click credit button product with offers, to get offers popup
	$(document.body).on('click', '.-bct-offers-form', function(evt) {
		evt.preventDefault();
		var self = $(this);
		window.bapp.getProductOffersPopup(self.data('iblock-id'), self.data('id'), true);
	});

	// click credit button single product
	$(document.body).on('click', '.-bct-product', function(evt) {
		evt.preventDefault();
		var self    = $(this),
			dataObj = {
				iblock_id : self.data('iblock-id'),
				id        : self.data('id'),
				name      : self.data('name'),
				price     : self.data('price'),
				section   : self.data('section')
			};
		window.bapp.getCreditPopup(dataObj, false);

	});

	// click credit button on product offers popup
	$(document.body).on('click', '.-bct-offer', function(evt) {
		evt.preventDefault();
		var self    = $(this),
			input   = $('.-buy-offer-form').find('input:checked'),
			dataObj = {
				iblock_id : self.data('iblock-id'),
				id        : input.val(),
				name      : input.data('name'),
				price     : input.data('price'),
				section   : self.data('section')
			};
		window.bapp.getCreditPopup(dataObj, true);
	});
	$(document.body).on('click', '.-favorite-check', function(evt) {
		$(this).parents('.-favorite-list').find('a').click();
	});
});
