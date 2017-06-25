/*
 Классы dom:
	.-list-items блок dom, в который будут положены list items
	.-list-loader лоадер, который будет показан во время обновления 
 */
function CList(opts){

	/*** defaults ***/
	var self = {
		pcode: 'CList', // имя класса
		opts: {
			props: [], // массив свойств
			area: '.-list-container', // блок dom, в котором производится работа
			loader: '.-list-loader', // это или селектор jquery, или объект, типа delayedLoader
			grdeg: '.-list-noscript-version', // селектор блока, который показывается при gracefull degradation, когда либо js отключен, либо список, либо doInitialUpdate == true
			responser: null,
			
			doInitialUpdate: true, // если true, то апдейт произойдёт при первой же загрузке
			matchDomain: false, // проверяет соответствие домена указанному. если домены не совпадают, дальнейшая работа скрипта прекращается
			scrollTopOnResort: true, // если true, список будет прокручиваться к верху при каждом обновлении сортировки
			scrollTopOnUpd: true, // если true, список будет прокручиваться к верху при каждом обновлении свойств
			ignoreDuplCalls: false, // если true и свойства пощёлкали и не изменили - перезагрузки не будет
			
			lazyOutput: false, // отображение новых элементов при прокрутке страницы вниз (альтернатива постраничной навигации)
			loAsk: 2, // количество подгрузок, после которых автоподгрузка осуществляется только по нажатию кнопки "more..."
			
			addItemsByOne: true, // добавлять в список элементы по одному, или сразу пачкой. ставь true, если привязываешь к элементам ещё какую-то функцониональность. ставь false, если элементы тяжёлые
			wrapPages: false, // 

			// кнопка вверх-вниз
			upDistFromBottom: 300, // расстояние от низа экрана до кнопок "наверх" и "обратно"
			upDistFromCenter: 520, // расстояние от центра сайта до кнопок "наверх" и "обратно"
			upMinShowScrollTop: 500, // сколько должно проскроллится вниз, чтобы кнопка "наверх" появилась
			downHideScrollTop: 100, // сколько должно проскроллится вниз, чтобы кнопка "обратно" скрылась

			navOpts: {}, // опции постраничного навигатора

			whenListContainerClear: function(){ // когда производится очистка от старых элементов при обновлении списка
				this.ctrls.list.css('height', this.ctrls.list.height()).empty();
			},
			whenHtmlWrap: function(html){return html}, // вызывается перед вставкой блока в список. может применяться для модификации html		
			whenListContainerFilled: function(){ // когда добавлена первая пачка элементов
				this.ctrls.list.css('height','auto');
			},
			
			onReset: function(){}, // вызывается, когда происходит сброс значений списка
			onSortSwitch: function(){}, // вызывается при смене направления сортировки
			onBeforeRefresh: function(){}, // вызывается перед началом изменения списка
			onAfterRefresh: function(){}, // вызывается после изменения списка
			onLazyGoesOff: function(){}, // вызывается, когда происходит переключение с lazy-режима в ручной режим
			onPage: function(p){}, // вызывается, когда загружается страница p
			onPagerPage: function(p){}, // вызывается, когда щёлкнули по странице в навигаторе
			
			debTimeout: 200, // таймаут дебонса реакции на изменения свойств
		},
		vars: {
			entId: Math.ceil(Math.random()*1000),
			sort: {
				by: typeof(opts.sortBy) == 'string' ? opts.sortBy : false,
				order: typeof(opts.sortOrder) == 'string' ? opts.sortOrder : false
			},
			
			// lazy load
			lazyManual: false, // включен ручной метод подгрузки контента (с кнопки "загрузить ещё")
			lazyAllowed: false, // флаг, который не дает сработать следующему событию lazyload, пока не отработало предыдущее
			
			// other
			prevFields: {}, // кеш значений свойств. позволяет не производить никаких действий, если значение свойств не поменялось
			jumpPos: -1, // координата для кнопки "наверх" и "обратно"
			lazyTimes: 0 // количество подгрузок, которые уже были с момента последней очистки списка
		},
		ctrls: {}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
	};
	if(typeof opts == 'object')
		$.extend(self.opts, opts);

	/*** public ***/
	/* methods */
	// добавляет новые свойства в список существуюших
	self.addProps = function(props){
		$.each(props, function(i, item){
			item.vars.parent = self;
			sv.props[item.opts.code] = item;
		});
	}
	// сброс списка
	self.reset = function(){
		so.onReset.call(self);
		
		sv.nav.page(1);
		sc.lazyLoadMore.hide();

		$.each(sv.props, function(i, prop){
			prop.reset();
		});
		self.update();
	}
	// немедленное обновление списка
	self.updateImmediate = function(){
	
		var props = {};
		var value = '';
		$.each(sv.props, function(i, prop){	
			if((value = prop.value()).toString().length > 0)
				props[i] = value;
		});
		
		sv.nav.page(1);
		sc.lazyLoadMore.hide();

		var fields = $.extend({}, {props:props,nav:sv.nav.getFlds()});

		if(typeof(sv.sort.by) !== false)
			fields['sort'] = sv.sort;

		if(so.ignoreDuplCalls && $.equalObj(sv.prevFields, fields)) return;
		sv.prevFields = $.extend({}, fields);
			
		so.onBeforeRefresh.call(self);
		sc.loader.show();

		sv.lazyManual = sv.lazyAllowed = false;

		so.responser.perform(fields);
	}
	// обновление списка
	self.update = $.debounce(self.updateImmediate, self.opts.debTimeout);
	self.firstUpdate = function(){
		// здесь решается судьба seo-контента: показывать или нет
		//self._showSC();
		self.update();
		sv.lazyAllowed = true;
	}
	// производит скролл окна к координате y со скоростью speed
	self.scrollOnTop = function(y, speed){
		$("html, body").animate({scrollTop:y}, typeof speed == 'undefined' ? 1 : speed);
	}
	self.nothingFound = function(){
		so.whenListContainerClear.call(self);
		so.whenListContainerFilled.call(self);
	}
	// инициализация вывода страниц
	self.beginPaging = function(){

		// очистка списка
		self.clear();
		
		if(so.scrollTopOnUpd) self.scrollOnTop();

		self.page(sv.nav.page(), function(){
			so.whenListContainerFilled.call(self);
			sv.nav.reInit({
				pages: so.responser.pageCount()
			});			
			self.mooreBrains(); // начинаем бесконечный вывод
		});

	}

	// этот метод добавляет в список элементы из массива html
	self.appendHTML = function(html, items){

		if(so.addItemsByOne){

			var addTo = so.wrapPages ? $('<div>').appendTo(sc.list) : sc.list;
			var aItems = new JQSet();
			for(k in html){

				// так мы избежим возможной ошибки unrecognized expression
				var item = $('<div>').html(so.whenHtmlWrap.apply(this, [html[k].dom])).children().data('list-item', html[k].item);

				addTo.append(item);
				aItems.__addItem(item);
			}

		}else{

			// пока не реализовал, да и вряд ли понадобится
			//block.get(0).innerHTML = so.whenHtmlWrap.apply(this, [html]);

		}

		sc.loader.hide();
		so.onAfterRefresh.apply(self, [aItems]);

		return aItems;
	}

	// эта функция не успокоится, пока не произойдёт одна из двух вещей: 1) закончатся страницы для вывода, 2) исчерпается лимит на показы lazy
	self.mooreBrains = function(){

		if(so.lazyOutput){
			if(self._needLoadMore())
				self.page(false, self.mooreBrains);
		}
	}

	// загрузить страницу с номером p и выполнить произвольный колбэк cb. если номер не передан, то загрузка следующей по счёту страницы
	self.page = function(p, cb){
		sc.loader.show();
		sc.lazyLoadMore.hide();
		sv.lazyAllowed = false;
		sv.lazyTimes++;

		so.onPage.apply(self, [p]);

		if(typeof p == 'undefined' || p === false) sv.nav.forward(); // увеличиваем страницу на 1

		so.responser.page(sv.nav.page()/*текущая страница*/, function(){
			sc.loader.hide();
			sv.lazyAllowed = true;
			
			if(typeof cb == 'function') cb();
		});
	}

	self.clear = function(){
		sv.lazyTimes = 0; // сбрасываем счётчик показов
		sv.lazyManual = false; // отключаем ручную подгрузку, если она была включена
		so.whenListContainerClear.call(self); // очищаем список
	}
	
	/*** private ***/
	/* methods */
	self._showSC = function(){
		if(so.grdeg) sc.grdegLock.remove();
	}
	self._needLoadMore = function(){

		if(sv.lazyAllowed && so.responser.morePages() && !sv.lazyManual){ // опция lazyLoad включена, можно ещё что-то подгрузить, ручной режим не включен
		
			if(so.loAsk > 0 && sv.lazyTimes > so.loAsk){ /*so.responser.pagesShown()*/

				if(!sv.lazyManual) so.onLazyGoesOff.call(self);

				sv.lazyManual = true;
				sc.lazyLoadMore.show();
				return false;
			}
		
			// ВНЕЗАПНО слетел метод $(window).height(), хз чё такое
			var wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

			return wHeight + $(document).scrollTop() >= sc.list.offset().top + +sc.list.height();
		}
		return false;
	}
	
    /*** init ***/
	var so = self.opts;
	var sv = self.vars;
	var sc = self.ctrls;
	var d = $(document);
	
	// if(so.matchDomain){
	// 	var found = false;
	// 	for(k in so.matchDomain)
	// 		if(so.matchDomain[k] == window.location.host){
	// 			found = true;
	// 			break;
	// 		}

	// 	if(!found){
	// 		console.error('Domain name doesnt match. Should be one of '+so.matchDomain);
	// 		return;
	// 	}
	// }
	
	// базовые контролы
	if((sc.area = $(so.area)).length != 1) return;
	sc.list = $('.-list-items', sc.area);
	sc.loader = typeof so.loader == 'object' ? so.loader : $(so.loader, sc.area);

	// временно скрываем seo-контент. потом его можно будет снова показать, если что-то пойдёт не так...
	if(so.grdeg.length > 0){
		document.write('<style id="grdeg_'+sv.entId+'">'+so.grdeg+'{display: none}</style>');
		sc.grdegLock = $('#grdeg_'+sv.entId);
	}		
	
	// регистрируем свойства
	sv.props = {};
	self.addProps(so.props);

	// регистрируем ответчик
	so.responser.init(self);
	
	// сортировка
	sc.sortBtns = sc.area.find('.-list-sort').bind('click.'+self.pcode, function(){
		var $this = $(this);
		var sortOrder = $this.attr('data-list-sort-order'); // направление сортировки может быть жёстко задано для этой кнопки, а может переключаться
		
		sv.sort.by = $this.attr('-list-sort-by');
		sv.sort.order = typeof(sortOrder) == 'undefined' ? (sv.sort.order == 'asc' ? 'desc' : 'asc' ) : sortOrder;
		
		so.onSortSwitch.apply(self, [sv.sort.order, $this]);
		//if(so.scrollTopOnResort) self.scrollOnTop();
		
		self.update();
	}).each(function(){ // сортировка по умолчанию
		var $this = $(this);
		if($this.attr('data-list-sort-by') == self.options.defaultSortBy)
			self.options.onSortSwitch.apply(self, [self._sort.order, $this]);
	});
	// сброс
	$(so.resetButton).bind('click.'+self.pcode, self.reset);
	sc.lazyLoadMore = $('.-list-lazy-load-more', sc.area).hide().click(function(){
		if(sv.lazyAllowed){

			self.page(false, function(){
				if(so.responser.morePages())
					sc.lazyLoadMore.show();
			});

		}
	});
	
	// навигация
	sv.nav = new CListNav($.extend({
		area: sc.area,
		showAll: false,
		page: so.page,
		num: so.navNum,
		lop: so.lop,
		parent: self
	}, so.navOpts));

	// lazy load
	if(so.lazyOutput){
		
		var onLazy = function(){
			if(self._needLoadMore())
				self.page();
		}
		
		d.scroll($.throttle(onLazy, 500));
		$(window).resize($.throttle(onLazy, 300));
	}	

	// кнопки "вверх" и "обратно"
	if((sc.back = $('.-list-ud-up', sc.area).click(function(){
		sv.jumpPos = d.scrollTop();
		self.scrollOnTop(0, 1);
		sc.back.hide();
	}).hide()).length){

		sc.down = $('.-list-ud-down', sc.area).click(function(){
			if(sv.jumpPos > 0){
				self.scrollOnTop(sv.jumpPos, 1);
				sv.jumpPos = -1;
				$(this).hide();
			}
		}).hide();
		sc.btnUD = $('.-list-up-down', sc.area);
	
		var adjustBtn = function(){
			
			var w = $(window);
			var btnH = sc.back.height();

			sc.btnUD.css({
				'top': w.height() - so.upDistFromBottom - btnH, 
				'left': Math.ceil(w.width() / 2) - so.upDistFromCenter
			});

			sc.back['fade'+(d.scrollTop() >= so.upMinShowScrollTop ? 'In' : 'Out')](200);

			if(d.scrollTop() >= so.downHideScrollTop){
				sv.jumpPos = -1;
				sc.down.fadeOut();
			}else if(sv.jumpPos > 0)
				sc.down.show();

		};
		d.scroll($.throttle(adjustBtn, 500));
		$(window).resize($.throttle(adjustBtn, 300));
		adjustBtn();
	}
	
	/*** finally ***/
	$(function(){
		if(so.doInitialUpdate) 
			self.firstUpdate();
		else
			sv.lazyAllowed = true;
	});

return self;}

function CListNav(opts){

	/*** defaults ***/
	var s = this;
	$.extend(s, {
		//pcode: 'CListNav', // имя класса
		opts: {
			area: false,
			whenSelect: function(){
				if('addClass' in this) this.addClass('active');
			},
			whenDeSelect: function(){
				if('removeClass' in this) this.removeClass('active');
			},
			whenGlow: function(){

				if('addClass' in this) this.addClass('glowing');
			},
			whenFade: function(){
				if('removeClass' in this) this.removeClass('glowing');
			},
			whenAfterInit: function(){
				this.ctrls.area.show();
			}
		}, // опции по умолчанию
		vars: {
			page: +opts.page > 1 ? +opts.page : 1, // последняя загруженная страница
			num: +opts.num > 0 ? +opts.num : 1, // номер навигатора (для ajax)
			lop: opts.lop || 10, // количество элементов на странице
			showAll: false, // показывать все или постранично (true пока не реализовано)
			pageCount: 0, // текущее число страниц
			requester: opts.parent, // ссылка на объект CList
			glowing: false, // светящийся (отображённый) диапазон
			selected: false, // текущая нажатая кнопка
			prevSelected: false
		}, // значимые переменные
		ctrls: {
			items: new JQSet() // все текущие кнопочки
		}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
	});
	if(typeof opts == 'object')
		$.extend(s.opts, opts);

	/*** public ***/
	/* methods */
	// перерисовывает навигатор
	s.reInit = function(params){
		sv.pageCount = +params.pages;

		// страниц вряд ли будет много, поэтому тут можем позволить себе вставку в dom в цикле
		sc.area.empty().hide();
		sc.items = new JQSet();

		// кнопка назад
		$('<div>').html(st.pageBwd).children().appendTo(sc.area).click(function(){

			if(sv.selected == 1) return false;

			sv.page = sv.selected - 1;

			// гасим все подсвеченные
			s._fadeGlowing();

			// делаем кнопку нажатой
			s._selectUp(sv.page);

			s._page(sv.page);

		});

		for(var i = 1; i <= sv.pageCount; i++)
			(function(i){

				var item = $('<div>').html(st.pageItem.replace('#PAGE#', i)).children().appendTo(sc.area).click(function(){
					if(sv.selected == i) return;

					var obj = $(this);

					sv.selected = i; // записываем номер последней нажатой страницы
					sv.page = i; // текущая страница

					// гасим все подсвеченные
					s._fadeGlowing();

					// делаем кнопку нажатой
					s._selectUp(i);

					s._page(i);
				});

				sc.items.__addItem(item);
			})(i);

		// кнопка вперёд
		$('<div>').html(st.pageFwd).children().appendTo(sc.area).click(function(){

			if(sv.selected == sv.pageCount) return false;

			sv.page = sv.selected + 1;

			// гасим все подсвеченные
			s._fadeGlowing();

			// делаем кнопку нажатой
			s._selectUp(sv.page);

			s._page(sv.page);

		});

		// текущую кнопку надо подсветить и сделать активной
		sv.glowing = [];
		s._selectUp(sv.page);
		s._glowUp(sv.page);

		so.whenAfterInit.call(s);
	}
	// получает поля навигатора для запроса
	s.getFlds = function(){
		return {
			showAll: sv.showAll,
			page: sv.page,
			navNum: sv.num,
			lop: sv.lop
		};
	}
	// просто сохраняет номер текущей страницы (или выдаёт его)
	s.page = function(p){

		if(typeof p == 'undefined') return sv.page;

		p = parseInt(p);
		if(p < 1) p =1;
		if(sv.pageCount > 0 && p > sv.pageCount) p = sv.pageCount;

		sv.page = p;

		// подсвечиваем текущий элемент
		s._glowUp(p);		
	}
	// показывает следующую страницу
	s.forward = function(){
		if(sv.page == sv.pageCount) return false;

		sv.page++;
		s.page(sv.page);

		return true;
	}
	// показывает предыдущую страницу
	s.backward = function(){
		if(sv.page == 1) return false;

		sv.page--;
		s.page(sv.page);

		return true;
	}
	s.parent = function(obj){
		sv.requester = obj;
	}
	/*** private ***/
	/* methods */

	s._fadeGlowing = function(){
		for(var k = 0; k < sv.glowing.length; k++)
			so.whenFade.call(sc.items.eq(sv.glowing[k] - 1));

		sv.glowing = [];
	}
	s._glowUp = function(page){

		if(sv.glowing !== false){
			sv.glowing.push(page);
			so.whenGlow.call(sc.items.eq(page - 1));
		}
	}
	s._selectUp = function(page){

		if(sv.prevSelected !== false)
			so.whenDeSelect.call(sc.items.eq(sv.prevSelected - 1));

		sv.prevSelected = page;
		sv.selected = page;

		so.whenSelect.call(sc.items.eq(page - 1));
	}
	s._page = function(i){
		if(sv.requester){

			if(typeof i == 'undefined') i = sv.page;

			sv.requester.opts.onPagerPage.apply(sv.requester, [i]);
			sv.requester.clear();
			sv.requester.page(i, function(){

				sv.requester.opts.whenListContainerFilled.call(sv.requester);
				sv.requester.mooreBrains(); // до победы

			});
		}

		// подсвечиваем текущий элемент
		s._glowUp(i);		
	}

    /*** init ***/
	var so = s.opts;
	var sv = s.vars;
	var sc = s.ctrls;
	var st = s.tmpls;

	sc.area = $('.-list-pagenav', $(so.area));
	st.pageItem = $('script[type="text/html"].-list-pn-item-template', sc.area).html();
	st.pageFwd = $('script[type="text/html"].-list-pn-forward', sc.area).html();
	st.pageBwd = $('script[type="text/html"].-list-pn-backward', sc.area).html();

	sv.lastPressedPage = sv.page;

	/*** finally ***/
	
	return s;
}

function CListAjax(opts){

	/*** defaults ***/
	var self = {
		pcode: 'CListAjax', // имя класса
		opts: {
			items: [],
			URL: '', // url, по которому идёт запрос
			dataType: 'json', // может быть ещё html (но пока не реализован)
			tag: false, // дополнительный флажок, который отправляется в ajax запросе. по нему можно отследить, что именно от этого компонента отправлен данный запрос. полезно при наличии нескольких ajax-компонентов на странице

			whenItemProcess: function(item){return '<div></div>'}, // когда элемент перегоняется из json в html. должна возвращать строку или объект jquery
			
			onInitialize: function(){}, // когда происходит инициализация скрипта
			onAfterRefresh: function(){}, // вызвается после изменения списка
			onBeforeRefresh: function(){} // вызывается перед изменением списка
		},
		vars: {
			fldCache: {},
			itemsCount: 0,
			ajaxId: false // id текущего ajax-вызова
		},
		ctrls: {}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
	};
	if(typeof opts == 'object')
		$.extend(self.opts, opts);
	
	/*** public ***/
	/* methods */
	// инициализирует ответчик (системный метод)
	self.init = function(req){
		sv.requester = req;

		sc.nothingFound = req.ctrls.area.find('.-list-nothing-found');
		sc.tryAgain = req.ctrls.area.find('.-list-try-again');
	}
	// выполнить обновление списка
	self.perform = function(fields){

		sc.nothingFound.hide();
		sc.tryAgain.hide();
		
		sv.fldCache = fields;
		so.onBeforeRefresh.call(self);
		sv.requester.beginPaging();
	}
	// сколько страниц уже было показано
	self.pagesShown = function(){
		return sv.fldCache.nav.page;
	}
	// выводит страницу с номером page
	self.page = function(page, cb){

		if(sv.fldCache.nav.showAll){
			// при таком раскладе больше одной страницы не удастся вывести
				// НЕ РЕАЛИЗОВАНО:
				// если в постраничной навигации включено "show all", то мы получаем как бы одну большую страницу...
				// тогда окно должно быть от 0 до sv.itemsCount
				// и тогда вывод надо делать через eachAsync()
				console.error('Вывод сразу всей портянки не реализован');
			
		}else{
			if(sv.suppressLO) return;
			sv.fldCache.nav.page = page;

			var aItems = [];
			var buf = [];
			var ids = [];
			self._perform(sv.fldCache, function(res){

				self._procAdditInfo(res['ADDIT_INFO']);
				delete(res['ADDIT_INFO']);

				for(k in res){
					res[k].HTML.__ID = k;

					buf.push({
						id: k,
						item: res[k],
						dom: so.whenItemProcess.apply(self, [res[k], k])
					});
				}

				if(buf.length == 0){
					sc.nothingFound.show();
				}
				var aItems = sv.requester.appendHTML(buf);

				if(typeof cb == 'function') cb();
				so.onAfterRefresh.apply(self, [aItems]);
			});
		}
	}
	// возвращает количество страниц (возможно использовать только после хотя бы одного вызова .perform())
	self.pageCount = function(){
		if(typeof sv.fldCache.nav == 'undefined') return -1;
		return sv.fldCache.nav.showAll ? 1 : Math.ceil(sv.itemsCount / sv.fldCache.nav.lop);
	}
	// возвращает true, если ещё не все страницы показаны
	self.morePages = function(){
		return sv.fldCache.nav.page < self.pageCount();
	}
	
	/*** private ***/
	/* methods */
	self._procAdditInfo = function(ai){
		if(typeof ai == 'undefined') return;
		sv.itemsCount = +ai['ITEMS_COUNT'];
	}
	// перегоняем поля запроса из общего вида в специфический, для аякса
	self._refineReq = function(reqest){
		var req = $.extend({}, reqest);

		if(req.nav.showAll)
			req['SHOWALL_'+req.nav.navNum] = 'Y';
		else
			req['PAGEN_'+req.nav.navNum] = req.nav.page;

		delete(req.nav);

		if(req.sort.by == false || req.sort.order == false)
			delete(req.sort);

		if(so.tag)
			req.ajaxTag = so.tag;

		return req;
	}
	self._perform = function(fields, callback){

		sv.requester.ctrls.loader.show();

		if(sv.ajaxId !== false && sv.ajaxId.readyState < 4)
			sv.ajaxId.abort();

		sv.ajaxId = $.ajax({
			url: so.URL,
			type: 'post',
			data: self._refineReq(fields),
			dataType: so.dataType,
			success: function(result){
				sv.requester.ctrls.loader.hide();

				if(typeof callback == 'function')
					callback(result);
			},
			error: function(xhr, msg, exp){

				if(msg == 'abort') return;

				sv.requester.ctrls.loader.hide();

				console.error('Ajax call failed: '+msg+' '+exp);
				sc.tryAgain.show();
			}
		});
	}
	
    /*** init ***/
	var so = self.opts;
	var sv = self.vars;
	var sc = self.ctrls;
	
	so.onInitialize.call(self);
	
	/*** finally ***/
	
return self;}

function CListClientSide(opts){

	/*** defaults ***/
	var self = {
		pcode: 'CListClientSide', // имя класса
		opts: {
			items: [],
			fetchURL: '', // позволяет брать список элементов на json по указанному урлу. это для того, чтобы не ждать загрузки гигантского списка
			tag: false, // дополнительный флажок, который отправляется в ajax запросе. по нему можно отследить, что именно от этого компонента отправлен данный запрос. полезно при наличии нескольких ajax-компонентов на странице

			whenItemProcess: function(item){return '<div></div>'}, // когда элемент перегоняется из json в html. должна возвращать строку или объект jquery
			
			onInitialize: function(){}, // когда происходит инициализация скрипта
			onItemsRemove: function(){ // когда удаляются элементы
				//sv.requester.ctrls.list.children().css('visibility', 'hidden');
			},
			onAfterRefresh: function(){}, // вызвается после изменения списка
			onBeforeRefresh: function(){} // вызывается перед изменением списка
		},
		vars: {
			items: [],			
			processed: false, // весь список обработан (html для каждого элемента сгенерирован)
			itemIndex: [],
			fltrTimer: {ID:-1},
			promiseUpd: false,
			navCache: {lop:10}
		},
		ctrls: {}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
	};
	if(typeof opts == 'object')
		$.extend(self.opts, opts);
	
	/*** public ***/
	/* methods */
	// добавляет элементы в список. при этом, список автоматически обновляется
	self.addItems = function(items){
		self._addItems(items);
		sv.requester.update();
	}
	// инициализирует ответчик (системный метод)
	self.init = function(req){
		sv.requester = req;
		if(so.fetchURL.length > 0){ // ещё ничего не загружено
			sv.promiseUpd = req.opts.doInitialUpdate; // апдейтнуть после получения элементов по ajax
			req.opts.doInitialUpdate = false;
		}
		sc.nothingFound = req.ctrls.area.find('.-list-nothing-found');
		sc.tryAgain = req.ctrls.area.find('.-list-try-again');
	}
	// выполнить обновление списка
	self.perform = function(fields){	
		if(sv.processed) // если все items перегнаны из json в html, то просто выполнить фильтрацию
			self._perform(fields);
		else // иначе, перегнать, а потом фильтровать.
			self._process(function(){
				self._perform(fields);
			});
	}	
	// вывод следующей страницы
	/*
	self.nextPage = function(cb){
		return self.page(sv.outputIndex++, cb);
	}
	*/
	// сколько страниц уже было показано
	self.pagesShown = function(){
		return sv.outputIndex;
	}
	// выводит страницу с номером page
	self.page = function(page, cb){

		if(sv.navCache.showAll){
			if(page == 0){ // при таком раскладе больше одной страницы не удастся вывести
				// НЕ РЕАЛИЗОВАНО:
				// если в постраничной навигации включено "show all", то мы получаем как бы одну большую страницу...
				// тогда окно должно быть от 0 до длины всего массива sv.itemIndex
				// и тогда вывод надо делать через eachAsync()
				console.error('Вывод сразу всей портянки не реализован');
			}
		}else{
			// в случае, когда страница ограничена:
			var winFrom = page*sv.navCache.lop;
			var winTo = (page+1)*sv.navCache.lop - 1;

			//console.dir(winFrom+' => '+winTo);
			
			if(sv.suppressLO || winFrom >= sv.itemIndex.length) return;
			
			var buf = [];
			var i = 0;
			for(var k = winFrom; k <= winTo; k++){
			
				if(i >= sv.navCache.lop || k >= sv.itemIndex.length)
					break;
			
				buf.push({
					dom:sv.items[sv.itemIndex[k].id].dom,
					id: sv.itemIndex[k].id,
					item: sv.items[sv.itemIndex[k].id]
				});

				i++;
			}
			var aItems = sv.requester.appendHTML(buf);
			if(typeof cb == 'function') cb();
			so.onAfterRefresh.apply(self, [aItems]);
		}
	}
	// возвращает количество страниц (возможно использовать только после хотя бы одного вызова .perform())
	self.pageCount = function(){
		return sv.navCache.showAll ? 1 : Math.ceil(sv.itemIndex.length / sv.navCache.lop);
	}
	// возвращает true, если ещё не все страницы показаны
	self.morePages = function(){
		return sv.outputIndex < self.pageCount();
	}
	
	/*** private ***/
	/* methods */
	self._addItems = function(items){
		$.each(items, function(i, item){
			item.ID = +i;
			sv.items.push(item);
		});
		sv.processed = false; // теперь не все обработаны
	}

	self._process = function(whenDone){
	
		$.eachAsync(sv.items, function(i, item){
			if(typeof(item.dom) != 'undefined') return; // этот элемент уже обработан
			item.HTML.__ID = item.ID;

			sv.items[item.ID].dom = so.whenItemProcess.apply(self, [item, item.ID]);
		},
		function(){
			sv.processed = true;
			whenDone();
		});

	}

	self._perform = function(fields){

		sc.nothingFound.hide();
		sc.tryAgain.hide();
		
		sv.navCache = fields.nav;
		sv.outputIndex = 1; // вывод блоков с начала
		
		clearTimeout(sv.fltrTimer.ID); // остановим всё предыдущее, если ещё работает
		so.onBeforeRefresh.call(self);
			
		sv.itemIndex = []; // отфильтрованные элементы (подмножество sv.items)
		var shown = 0;
		var useSort = typeof(fields.sort) != 'undefined' && fields.sort.by;
		
		// порядок обработки: фильтрация, сортировка, постраничная навигация
		sv.fltrTimer = $.eachAsync(sv.items, function(bug, item){
			if(self._filter(fields.props, item)){
				sv.itemIndex.push(useSort ? {id: item.ID, val: item.PROPS[fields.sort.by]} : {id: item.ID});
				shown++;
			}
		}, function(){ // done
		
			if(shown == 0){
				sv.requester.ctrls.loader.hide(); // местный лоадер типа
				sv.requester.nothingFound();
				sc.nothingFound.show();
			}else{
				if(useSort) sv.itemIndex.sort(fields.sort.order == 'asc' ? self._sortAsc : self._sortDesc);		
				sv.requester.beginPaging();
			}
		});
	}
	
	self._filter = function(props, item){
	
		// если свойств вообще нет, то просто true
		if(props.length == 0) return true;
	
		// действует логика "хотя бы одно совпадение", т.е. OR
		for(k in props)
			if(props.hasOwnProperty(k)){
				// отсутсвущему\пустому свойству автоматически удовлетворяет
				if(typeof(item.PROPS[k]) == 'undefined' || item.PROPS[k].toString().length == 0)
					continue;
					
				if(!sv.requester.vars.props[k].match(item.PROPS[k]))
					return false;
			}
		
		return true;
	}	
	
    /*** init ***/
	var so = self.opts;
	var sv = self.vars;
	var sc = self.ctrls;
	
	self._addItems(so.items);
	so.onInitialize.call(self);

	if(so.fetchURL.length > 0)
		$(function(){
			sv.requester.ctrls.loader.show();
			var flds = {};
			if(so.tag)
				flds['ajaxTag'] = so.tag;
			$.ajax({
				url: so.fetchURL,
				type: "POST",
				dataType: "json",
				data: flds,
				success: function(result){
					self._addItems(result);
					if(sv.promiseUpd)
						sv.requester.firstUpdate();
				},
				error: function(xhr, msg, exp){
					console.error('Ajax call failed: '+msg+' '+exp);
					sc.tryAgain.show();
				},
				complete: function(){
					sv.requester.ctrls.loader.hide();
				}
			});
		});	
	
	/*** finally ***/
	
return self;}

function JQSet(){
	this.context = null;
	this.length = 0;
	this.selector = '';
	this.__addItem = function(item){
		this[this.length++] = item.get(0);
	}
}
JQSet.prototype = jQuery.fn;

$.fn.smoothLoad = function(todo){

	/*** plugin parameters ***/
	var self = {pcode: 'smoothLoad',options:{
		loader: '.-sl-loader',
		onSuccess: function(){}
	}};
	
	/*** methods standard ***/
	self.init = function(options){

		var common = {};
		var opts = $.extend(self.options, options);
		return this.each(function(){
		
			var $this = $(this);
			//if(typeof($this.data(self.pcode)) != 'undefined') return; // плагин уже инициализирован на этом элементе
			
			//////////////////////////////////////////////////////////
			///////////////
			
			// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
			var data = {
				dom: $this,
				ctrls: { // хранимые контролы
					loader: typeof(opts.loader) == 'object' ? opts.loader : $(opts.loader)
				},
				vars: { // переменные величины
				},
				tmpls: {},
				sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
				opts: $.extend({}, opts) // опции плагина на момент инициализации
			}
			
			// тут дальнейшая инициализация
			var img = $this.is('img') ? $this : $this.find('img');
			if(!img.get(0).complete){
				img.css({opacity: 0}); //hide();
				
				data.ctrls.loader.show();	
				
				//(function(img, loader){
					
					img.__timer = setInterval(function(){
						if(img.get(0).complete){
							clearInterval(img.__timer);
							img.css({opacity: 1}).hide().fadeIn(300);
							data.ctrls.loader.hide();
							data.opts.onSuccess.call(data, [img]);
						}
					}, 100);
					
				//})(img, loader);
			}else
				data.opts.onSuccess.call(data, [img]);
			
			///////////////
			//////////////////////////////////////////////////////////
			//$this.data(self.pcode, data);
		});
	}
	
	/*** methods public ***/
	
	/*** methods private ***/
	
	// разбор todo
	return self.init.apply(this, arguments);
	/*
    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
		return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
		return self.init.apply(this, arguments);
	*/
}

$.fn.floatPanel = function(todo){

	/*** plugin parameters ***/
	var self = {pcode: 'floatPanel',opts:{
		tempBulkClass: '-temp-bulk', // класс, который назначается блоку, который замещает панель при скролле вниз
		defZIndex: 99, // z-index по умолчанию
		correct: 0 // небольшой поправочный коэффициент по высоте
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
				vars: { // переменные величины
					initOffset: $this.offset(),
					initPos: $this.css('position'),
					bulk: false,
					winWidth: $(window).width(),
					float: false
				},
				/*
				tmpls: {},
				sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
				*/
				opts: $.extend({}, opts) // опции плагина на момент инициализации
			}
			
			// тут дальнейшая инициализация

			// лучше было бы сделать потом ОДИН обработчик скролла, который будет следить за всеми панелями плагина			 
			$(window).scroll(function(){self._processPanel.call(data)});
			$(window).resize(function(){
				
				/*
				// эта корретировка пока не работает
				var newWidth = $(window).width();
				var oldWidth = data.vars.winWidth;
				if(newWidth != oldWidth && data.vars.float){
					$this.css({right: parseInt($this.css('right')) + (newWidth - oldWidth)});
				}
				*/	

				self._processPanel.call(data);
			});
			self._processPanel.call(data);

			///////////////
			//////////////////////////////////////////////////////////
			$this.data(self.pcode, data);
		});
	}
	
	/*** methods public ***/

	/*** methods private ***/
	self._getRightOffset = function(obj){
		return $(window).width() - obj.offset().left - obj.width();
	}
	self._processPanel = function(){
		var posY = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
		var $this = this.dom;

		if(posY > this.vars.initOffset.top + this.opts.correct){
			if(this.vars.bulk == false)
				this.vars.bulk = $('<div style="height: '+$this.height()+'px; position: '+this.vars.initPos+'" class="'+this.opts.tempBulkClass+'"></div>').insertBefore($this);

			var rOffs = self._getRightOffset($this);

			$this.css({position: 'fixed', top: 0, right: rOffs});
			this.vars.float = true;
		}else{

			var bulk = $this.prev();
			if(this.vars.bulk != false){
				bulk.remove();
				this.vars.bulk = false;
			}

			$this.css({position: this.vars.initPos, top: 'auto', left: 'auto', right: 'auto', 'z-index': this.opts.defZIndex});
			this.vars.float = false;
		}
		this.vars.winWidth = $(window).width();	
	}
	
	// разбор todo
    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
		return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
		return self.init.apply(this, arguments);
}

$.extend({

	equalObj: function(obj1, obj2){
	
		var inclusion = function(obj1, obj2){
			for(k in obj1)
				if(obj1.hasOwnProperty(k))
					if(!(typeof obj1[k] == 'object' ? $.equalObj(obj1[k], obj2[k]) : obj1[k].toString() == obj2[k].toString())) return false;

			return true;
		}
		
		return inclusion(obj1, obj2) && inclusion(obj2, obj1);
	},

	eachAsync: function(set, callback, done, afterEach, blockLen, delay){

		var slice = false;
		var length = 0;
		
		// если set это массив или объект $(), то волноваться не о чем. иначе - есть о чём (особенно если объект общего вида)
		if(typeof(set.length) != 'number'){
		
			slice = function(from, to){
				var chunk = {};
				var startCopying = false;
				// this === set
				$.each(this, function(i, item){
					if(i.toString() == from.toString())
						startCopying = true;
						
					if(startCopying)
						chunk[i] = item;
						
					if(i.toString() == to.toString())
						startCopying = false;
				});
				return chunk;
			}
		} else
			slice = set.slice;
		
		if(typeof(set.length) != 'number')
			$.each(set, function(){
				length++;
			});
		else
			length = set.length;

		if(typeof(afterEach) != 'function')
			afterEach = function(){};

		if(typeof(blockLen) != 'number')
			blockLen = 30;
			
		var times = Math.ceil(length / blockLen);
		var index = 0;
		var globalIndex = 0;
		var self = this;
		
		var handler = {};
		
		var iterator = function(){
			if(times == index){
				if(typeof(done) == 'function')
					done.call(set);
				return false;
			}
			return setTimeout(function(){
				index++;
				$.each(slice.apply(set, [(index-1)*blockLen, index*blockLen-1]), callback);
				afterEach.call(self);
				handler.ID = iterator();
			}, delay || 10);
		}
		handler.ID = iterator();
		return handler;
	}
	
});

/*
Copyright Vassilis Petroulias [DRDigit]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var B64 = {
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    lookup: null,
    ie: /MSIE /.test(navigator.userAgent),
    ieo: /MSIE [67]/.test(navigator.userAgent),
    encode: function (s) {
        var buffer = B64.toUtf8(s),
            position = -1,
            len = buffer.length,
            nan1, nan2, enc = [, , , ];
        if (B64.ie) {
            var result = [];
            while (++position < len) {
                nan1 = buffer[position + 1], nan2 = buffer[position + 2];
                enc[0] = buffer[position] >> 2;
                enc[1] = ((buffer[position] & 3) << 4) | (buffer[++position] >> 4);
                if (isNaN(nan1)) enc[2] = enc[3] = 64;
                else {
                    enc[2] = ((buffer[position] & 15) << 2) | (buffer[++position] >> 6);
                    enc[3] = (isNaN(nan2)) ? 64 : buffer[position] & 63;
                }
                result.push(B64.alphabet[enc[0]], B64.alphabet[enc[1]], B64.alphabet[enc[2]], B64.alphabet[enc[3]]);
            }
            return result.join('');
        } else {
            result = '';
            while (++position < len) {
                nan1 = buffer[position + 1], nan2 = buffer[position + 2];
                enc[0] = buffer[position] >> 2;
                enc[1] = ((buffer[position] & 3) << 4) | (buffer[++position] >> 4);
                if (isNaN(nan1)) enc[2] = enc[3] = 64;
                else {
                    enc[2] = ((buffer[position] & 15) << 2) | (buffer[++position] >> 6);
                    enc[3] = (isNaN(nan2)) ? 64 : buffer[position] & 63;
                }
                result += B64.alphabet[enc[0]] + B64.alphabet[enc[1]] + B64.alphabet[enc[2]] + B64.alphabet[enc[3]];
            }
            return result;
        }
    },
    decode: function (s) {
        var buffer = B64.fromUtf8(s),
            position = 0,
            len = buffer.length;
        if (B64.ieo) {
            result = [];
            while (position < len) {
                if (buffer[position] < 128) result.push(String.fromCharCode(buffer[position++]));
                else if (buffer[position] > 191 && buffer[position] < 224) result.push(String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63)));
                else result.push(String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63)));
            }
            return result.join('');
        } else {
            result = '';
            while (position < len) {
                if (buffer[position] < 128) result += String.fromCharCode(buffer[position++]);
                else if (buffer[position] > 191 && buffer[position] < 224) result += String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63));
                else result += String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63));
            }
            return result;
        }
    },
    toUtf8: function (s) {
        var position = -1,
            len = s.length,
            chr, buffer = [];
        if (/^[\x00-\x7f]*$/.test(s)) while (++position < len)
        buffer.push(s.charCodeAt(position));
        else while (++position < len) {
            chr = s.charCodeAt(position);
            if (chr < 128) buffer.push(chr);
            else if (chr < 2048) buffer.push((chr >> 6) | 192, (chr & 63) | 128);
            else buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128);
        }
        return buffer;
    },
    fromUtf8: function (s) {
        var position = -1,
            len, buffer = [],
            enc = [, , , ];
        if (!B64.lookup) {
            len = B64.alphabet.length;
            B64.lookup = {};
            while (++position < len)
            B64.lookup[B64.alphabet[position]] = position;
            position = -1;
        }
        len = s.length;
        while (position < len) {
            enc[0] = B64.lookup[s.charAt(++position)];
            enc[1] = B64.lookup[s.charAt(++position)];
            buffer.push((enc[0] << 2) | (enc[1] >> 4));
            enc[2] = B64.lookup[s.charAt(++position)];
            if (enc[2] == 64) break;
            buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2));
            enc[3] = B64.lookup[s.charAt(++position)];
            if (enc[3] == 64) break;
            buffer.push(((enc[2] & 3) << 6) | enc[3]);
        }
        return buffer;
    }
};