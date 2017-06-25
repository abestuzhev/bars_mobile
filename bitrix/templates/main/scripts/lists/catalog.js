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
			grdeg: '.-list-noscript-version', // селектор блока, который показывается при gracefull degradation, когда либо js отключен, либо список
			responser: null,
			hash: null,
			
			matchDomain: false, // проверяет соответствие домена указанному. если домены не совпадают, дальнейшая работа скрипта прекращается
			scrollTopOnResort: true, // если true, список будет прокручиваться к верху при каждом обновлении сортировки
			scrollTopOnUpd: true, // если true, список будет прокручиваться к верху при каждом обновлении свойств
			ignoreDuplCalls: true, // если true и свойства пощёлкали и не изменили - перезагрузки не будет
			
			lazyOutput: false, // отображение новых элементов при прокрутке страницы вниз (альтернатива постраничной навигации)
			loAsk: 2, // количество подгрузок, после которых автоподгрузка осуществляется только по нажатию кнопки "more..."
			
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
			whenSortPanelUpdate: function(){
				$(this).show();
			}, // если задана панель сортировки, то она изначально скрыта. и будет показана с помощью этой функции
			
			onReset: function(){}, // вызывается, когда происходит сброс значений списка
			onSortSwitch: function(){}, // вызывается при смене направления сортировки
			onBeforeRefresh: function(){}, // вызывается перед началом изменения списка
			onAfterRefresh: function(){}, // вызывается после изменения списка
			onLazyGoesOff: function(){}, // вызывается, когда происходит переключение с lazy-режима в ручной режим

			// это надо перенести в опции постраничного навигатора:
			onPage: function(p){}, // вызывается, когда загружается страница p
			onPagerPage: function(p){}, // вызывается, когда щёлкнули по странице в навигаторе
			
			debTimeout: 200, // таймаут дебонса реакции на изменения свойств
		},
		vars: {
			entId: Math.ceil(Math.random()*1000),
			sort: {
				by: typeof(opts.sortBy) == 'string' ? opts.sortBy : false,
				order: typeof(opts.sortOrder) == 'string' ? opts.sortOrder : 'asc'
			},
			
			// lazy load
			loLock: false, // флаг, который не дает сработать следующему событию lazyload, пока не отработало предыдущее
			loTimes: 0, // количество подгрузок, которые уже были с момента последней очистки списка

			// other
			prevFields: {}, // кеш значений свойств. позволяет не производить никаких действий, если значение свойств не поменялось
			jumpPos: -1, // координата для кнопки "наверх" и "обратно"

			// модификаторы поведения
			allowDropPN: true, // флажок модификации поведения .update(): включает\отключает сброс номера страницы при .update()
			allowShowControls: true, // флажок модификации поведения .update(): включает\отключает показ контролов при .update()
			firstPage: true // флажок, который означает, что это первая после .update() страница, которая выводится
		},
		ctrls: {
		}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
	};
	if(typeof opts == 'object')
		$.extend(self.opts, opts);

	/*** public ***/
	/* methods */
	// добавляет новые свойства в список существующих
	self.addProps = function(props){
		$.each(props, function(i, item){
			item.vars.parent = self;
			sv.props[item.opts.code] = item;

			// чтение из hash ТУТ
			if(so.hash != null)
				item.setValue(so.hash.getProp(item.opts.code), true);
		});
	}
	// сброс списка
	self.reset = function(){
		so.onReset.call(self);
		
		sc.lazyLoadMore.hide();

		$.each(sv.props, function(i, prop){
			prop.reset();
		});

		self.update();
	}
	// немедленное обновление списка
	self.updateImmediate = function(trans){

		sv.loLock = true; // заблокируем lazy output

		var fields = $.extend({}, {
			props: self.getFilter(),
			nav: self.getNav()
		});

		if(typeof(sv.sort.by) !== false)
			fields['sort'] = sv.sort;

		if(so.ignoreDuplCalls && $.equalObj(sv.prevFields, fields)) return;
		sv.prevFields = $.extend(true, {}, fields);
			
		//console.dir('OLD:');
		//console.dir(sv.prevFields.props);
		//console.dir('NEW:');
		//console.dir(fields.props);

		//###############################################

		if(sv.allowDropPN) sv.nav.reset(); // выставление навигатору страницы номер 1
		sv.firstPage = true;
		sc.lazyLoadMore.hide();

		so.onBeforeRefresh.call(self);
		sc.loader.show();

		sv.loTimes = 0; // сброс счётчика подгрузок

		if(so.hash != null)
			so.hash.store(sv.props, self.getNav(), fields.sort);

		so.responser.perform(fields);
	}
	// обновление списка
	self.update = $.debounce(self.updateImmediate, self.opts.debTimeout);

	// получает значения фильтра
	self.getFilter = function(){

		var props = {};
		var value = '';
		$.each(sv.props, function(i, prop){	
			// ТУТ ВЫДАВАТЬ ТОЛЬКО НЕ-ДЕФОЛТНЫЕ И НЕ-ПУСТЫЕ ЗНАЧЕНИЯ

			//if((value = prop.value()).toString().length > 0)
			if((value = prop.getFiltrable()) !== false)
				props[i] = value;
		});

		console.dir('Props 4 today are:');
		console.dir(props);

		return props;
	}
	self.getSort = function(){
		return sv.sort;
	}

	// получает значения навигационных параметров
	self.getNav = function(){
		return sv.nav.getFlds();
	}

	// производит скролл окна к координате y со скоростью speed
	self.scrollOnTop = function(y, speed){
		$("html, body").animate({scrollTop:y}, typeof speed == 'undefined' ? 1 : speed);
	}
	self.nothingFound = function(){
		so.whenListContainerClear.call(self);
		so.whenListContainerFilled.call(self);

		sc.nothingFound.clone().appendTo(sc.list).show();
		sv.loLock = false; // разблокируем lazy output
		self.updatePager();
	}
	self.tryAgain = function(){
		so.whenListContainerClear.call(self);
		so.whenListContainerFilled.call(self);

		sc.tryAgain.clone().appendTo(sc.list).show();
		sv.loLock = false; // разблокируем lazy output
	}
	// функция вызывается, когда произошёл успешный апдейт
	self.updateDone = function(){

		// очистка списка
		self.clear();
		// перемотка вверх
		if(so.scrollTopOnUpd) self.scrollOnTop();

		sv.loLock = false; // разблокируем lazy output

		if(so.lazyOutput){ // если включен lazyOutput, просто разблокируем его
			
			so.whenListContainerFilled.call(self);
			self.showControls();

		}else{ // иначе выведем страницу
			self.page(sv.nav.page(), function(){
				so.whenListContainerFilled.call(self);
				self.showControls();
			});
		}
	}
	// форсирует отображение именно этой страницы в постраничнике. тупой костыль
	self.freezeDispNavPage = function(page){
		sv.nav.freezePage(page);
	}
	// включает\отключает сбрасывание номера страницы при .update()
	self.allowDropPN = function(way){
		sv.allowDropPN = way;
	}
	self.allowShowControls = function(way){
		sv.allowShowControls = way;
	}
	// отображает панель сортировки и постраничной навигации
	self.showControls = function(){
		if(sv.allowShowControls){
			self.updatePager();
			self.updateSort();
		}
	}
	self.updatePager = function(){
		sv.nav.reInit({
			pages: so.responser.pageCount()
		});
	}
	self.updateSort = function(){
		so.whenSortPanelUpdate.apply(sc.sortPanel, [self]);
	}

	// этот метод генерит jquery выборку из массива html
	self.makeNodes = function(html){

		var aItems = new JQSet();
		for(var k in html){

			// так мы избежим возможной ошибки unrecognized expression
			var item = $('<div>').html(so.whenHtmlWrap.apply(this, [html[k].dom])).children().data('list-item', html[k].item);

			aItems.__addItem(item);
		}

		return aItems;
	}

	// загрузить страницу с номером p и выполнить произвольный колбэк cb. если номер не передан, то загрузка следующей по счёту страницы
	self.page = function(p, cb){

		sc.loader.show();
		sc.lazyLoadMore.hide();

		var pageNotSet = typeof p == 'undefined' || p === false;

		if(pageNotSet){
			//console.dir('page not set');
			//console.dir('curr page is '+sv.nav.page());

			if(sv.firstPage){

				//console.dir('first page it is');

				var page2Load = sv.nav.page();

			}else{

				var page2Load = sv.nav.page() + 1;

			}
		}else{
			//console.dir('page exactly known: '+p);
			var page2Load = p;
		}

		// если страница задана, то выводится её номер. если страница не задана, то если sv.firstPage == true, то берётся sv.nav.page(), иначе - sv.nav.page()+1
		//var page2Load = pageNotSet ? (sv.nav.page() + (sv.firstPage ? 0 : 1)) : p;

		//if(sv.firstPage)
		//	console.dir('first page, no increase');

		var aItems = so.responser.page(page2Load); /*текущая страница*/

		if(aItems !== false){

			if(sv.firstPage) sv.firstPage = false;

			sc.loader.hide();
			so.onPage.apply(self, [p]);

			sv.nav.page(page2Load);

			// добавляем наконец элементы на страницу
			sc.list.append(aItems);

			so.onAfterRefresh.apply(self, [aItems]);
			if(typeof cb == 'function') cb();

			return true;

		}else
			return false;
	}

	self.clear = function(){
		sv.loTimes = 0; // сбрасываем счётчик показов

		so.whenListContainerClear.call(self); // очищаем список
	}

	/*** private ***/
	/* methods */

	// функция измеряет размер окна и списка и возвращает true, если снизу ещё есть пространство для очередной страницы
	self._needLoadMore = function(){

		// ВНЕЗАПНО слетел метод $(window).height(), хз чё такое
		var wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		return wHeight + $(document).scrollTop() >= sc.list.offset().top + +sc.list.height();
	}
	self._setSClass = function(){
		sc.sortBtns.removeClass('-asc').removeClass('-desc');
		this.addClass('-'+sv.sort.order);
	}
	// пересчитывает параметры lazy output после успешной загрузки страницы
	self._modifyLOVars = function(){
		sv.loTimes++;
		//console.dir('lotimes: '+sv.loTimes+', loask: '+so.loAsk);
		if(sv.loTimes == so.loAsk){

			//console.dir('gooff!');

			so.onLazyGoesOff.call(self);

			if(so.responser.morePages())
				sc.lazyLoadMore.show();
		}		
	}
	
    /*** init ***/
	var so = self.opts;
	var sv = self.vars;
	var sc = self.ctrls;
	var d = $(document);

	// if(so.matchDomain){
	// 	var found = false;
	// 	for(var k in so.matchDomain)
	// 		if(so.matchDomain[k] == window.location.host){
	// 			found = true;
	// 			break;
	// 		}

	// 	if(!found){
	// 		console.error('Domain name doesnt match. Should be one of: '+so.matchDomain.join(', '));
	// 		return;
	// 	}
	// }
	
	// базовые контролы
	if((sc.area = $(so.area)).length != 1) return;
	sc.list = sc.area.is('.-list-items') ? sc.area : $('.-list-items', sc.area);
	sc.loader = typeof so.loader == 'object' ? so.loader : $(so.loader, sc.area);

	sc.nothingFound = $('.-list-nothing-found', sc.area);
	sc.tryAgain = $('.-list-try-again', sc.area);

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

	// чтение данных из hash
	if(so.hash != null){
		// номер страницы
		if(so.hash.hasNav())
			so.navOpts.page = so.hash.getNav();

		// сортировка
		if(so.hash.hasSort())
			sv.sort = so.hash.getSort();
	}
	
	// сортировка
	sc.sortBtns = sc.area.find('.-list-sort').bind('click.'+self.pcode, function(){
		var $this = $(this);
		var sortOrder = $this.attr('data-list-sort-order'); // направление сортировки может быть жёстко задано для этой кнопки, а может переключаться

		sv.sort.by = $this.attr('data-list-sort-by');
		sv.sort.order = typeof(sortOrder) == 'undefined' ? (sv.sort.order == 'asc' ? 'desc' : 'asc' ) : sortOrder;
		
		self._setSClass.call($this);

		so.onSortSwitch.apply(self, [sv.sort.order, $this]);
		//if(so.scrollTopOnResort) self.scrollOnTop();
		
		self.update();
	});
	sc.sortBtns.each(function(){ // сортировка по умолчанию
		var $this = $(this);

		if($this.attr('data-list-sort-by') == sv.sort.by){
			self._setSClass.call($this);
			so.onSortSwitch.apply(self, [sv.sort.order, $this]);
		}
	});
	sc.sortPanel = sc.area.find('.-list-sort-links');
	// сброс
	 setTimeout(function () {
        $(so.resetButton).bind('click.' + self.pcode, self.reset);
    }, 1000)

	// навигация
	sv.nav = new CListNav($.extend({
		area: sc.area,
		parent: self
	}, so.navOpts));

	// lazy load
	if(so.lazyOutput){
		sv.loTimer = setInterval(function(){

			//console.dir('try '+sv.loLock);
			if(sv.loLock) return;
			if(sv.loTimes >= so.loAsk) return;

			// периодические попытки подгрузить ещё страницу
			if(self._needLoadMore() && so.responser.morePages()){
				
				if(self.page())
					self._modifyLOVars();
			}

		}, 300);

		sc.lazyLoadMore = $('.-list-lazy-load-more', sc.area).hide();
		sc.lazyLoadMore.find('.-list-llm-click').click(function(){

			self.page(false, function(){
				if(so.responser.morePages())
					sc.lazyLoadMore.show();
			});

		});
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
		// точка начала исполнения
		self.update();
	});

return self;}

/*
 В следующей версии требуется более чётко разграничить такие вещи, как:
 - выбор текущей страницы
 - подсвечивание диапазона страниц
 */
function CListNav(opts){

	/*** defaults ***/
	var s = this;
	$.extend(s, {
		//pcode: 'CListNav', // имя класса
		opts: {
			area: false,
			whenSelect: function(){ // что делать с кнопкой, когда на неё нажали
				if('addClass' in this) this.addClass('active');
			},
			whenDeSelect: function(){ // что делать с кнопкой, когда она отщёлкивается
				if('removeClass' in this) this.removeClass('active');
			},
			whenGlow: function(){ // что делать с кнопкой, когда она подсвечивается
				if('addClass' in this) this.addClass('glowing');
			},
			whenFade: function(){ // что делать с кнопкой, когда она гаснет
				if('removeClass' in this) this.removeClass('glowing');
			},
			whenHide: function(){
				this.ctrls.list.css('visibility', 'hidden');
			},
			whenShow: function(){
				this.ctrls.list.css('visibility', 'visible');
			},

			onPageClick: function(page){}, // выполняется, когда пользователь щёлкнул по номеру страницы в навигаторе. нумерация с 1
			onAfterRender: function(cBtn){}, // выполняется, когда блок навигатора отрисован
			onArrowDisable: function(r){}, // выполняется, когда некуда двигать вправо или некуда двигать влево
			onArrowEnable: function(r){} // выполняется, когда можно двигать вправо или можно двигать влево
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
			prevSelected: false,
			frozenPage: false
		}, // значимые переменные
		ctrls: {
			items: new JQSet(), // все текущие кнопочки
			prevBtn: false,
			nextBtn: false
		}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
	});
	if(typeof opts == 'object')
		$.extend(s.opts, opts);

	//console.dir(s.vars.page);

	/*** public ***/
	/* methods */
	s.freezePage = function(page){
		sv.frozenPage = page;
	}
	// перерисовывает навигатор
	s.reInit = function(params){
		sv.pageCount = +params.pages;

		// если страница одна или вообще нет, то надо скрыть нафиг постраничник

		so['when'+(sv.pageCount < 2 ? 'Hide' : 'Show')].call(s);

		// страниц вряд ли будет много, поэтому тут можем позволить себе вставку в dom в цикле
		sc.list.empty();

		if(sv.pageCount == 0) return;

		sc.items = new JQSet();

		if(typeof st.pageItem == 'string')
			for(var i = 1; i <= sv.pageCount; i++)
				(function(i){

					var item = $('<div>').html(st.pageItem.replace('#PAGE#', i)).children().appendTo(sc.list).click(function(){
						so.onPageClick.apply(s, [i]);
						s.clickPage(i);
					});

					sc.items.__addItem(item);
				})(i);

		// renderer
		var cBtn = sv.frozenPage !== false ? sv.frozenPage : sv.page;

		// текущую кнопку надо подсветить и сделать активной
		sv.glowing = [];
		s._selectUp(cBtn);
		s._glowUp(cBtn);

		if(cBtn == 1){
			so.onArrowDisable.apply(s, [false]);
			so.onArrowEnable.apply(s, [true]);
		}

		if(cBtn == sv.pageCount){
			so.onArrowDisable.apply(s, [true]);
			so.onArrowEnable.apply(s, [false]);
		}

		so.onAfterRender.apply(s, [cBtn]);
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
	// эмулирует нажатие на кнопку страницы
	s.clickPage = function(i){
		if(sv.selected == i) return;

		sv.selected = i; // записываем номер последней нажатой страницы
		sv.page = i; // текущая страница

		s._clickPage(i);
	}
	// просто сохраняет номер текущей страницы (или выдаёт его)
	// если asClick == true, то выполняется обработчик нажатия "как на кнопку"
	s.page = function(p, asClick){

		if(typeof p == 'undefined') return sv.page;

		p = parseInt(p);
		if(p < 1) p =1;
		if(sv.pageCount > 0 && p > sv.pageCount) p = sv.pageCount;

		sv.page = p;

		// подсвечиваем текущий элемент
		s._glowUp(p);

		if(asClick)
			s.clickPage(p);
	}
	s.reset = function(){

		sv.page = 1;

		so.onPageClick.apply(s, [1]);
		s.clickPage(1);
		so.onArrowDisable.apply(s, [false]);
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
			if(sv.requester.page(i, function(){

				sv.requester.opts.whenListContainerFilled.call(sv.requester);

			}))
				sv.requester._modifyLOVars();
		}

		// подсвечиваем текущий элемент
		s._glowUp(i);		
	}
	s._clickPage = function(i){
		// гасим все подсвеченные
		s._fadeGlowing();

		// делаем кнопку нажатой
		s._selectUp(i);

		s._page(i);

		if(sv.requester.opts.hash != null)
			sv.requester.opts.hash.storePage(i); // небольшой хак

		if(sv.page == 1 || sv.page == sv.pageCount){
			so.onArrowDisable.apply(s, [sv.page == sv.pageCount]);
			so.onArrowEnable.apply(s, [sv.page == 1]);
		}else
			so.onArrowEnable.call(s); // врубаем все
	}

    /*** init ***/
	var so = s.opts;
	var sv = s.vars;
	var sc = s.ctrls;
	var st = s.tmpls;

	sc.area = $('.-list-pagenav', $(so.area));
	sc.list = sc.area.is('.-list-pn-clip') ? sc.area : sc.area.find('.-list-pn-clip');

	st.pageItem = $('script[type="text/html"].-list-pn-item', sc.area).html();

	// кнопка вперёд
	sc.right = $('.-list-pn-forward', sc.area).click(function(){

		if(sv.selected == sv.pageCount) return false;

		sv.page = sv.selected + 1;

		s._clickPage(sv.page);
	});
	// кнопка назад
	sc.left = $('.-list-pn-backward', sc.area).click(function(){

		if(sv.selected == 1) return false;

		sv.page = sv.selected - 1;

		s._clickPage(sv.page);
	});

	sv.lastPressedPage = sv.page;

	/*** finally ***/
	
	return s;
}

function CAjaxIterator(opts){

	/*** defaults ***/
	var s = this;
	$.extend(s, {
		opts: {
			url: '', // урл, на который итератор стучится
			tag: false, // ID Ajax-запроса
			interval: 1000, // интервал по умолчанию
			escapeJSON: false, // проверять или нет
			loader: {show:function(){},hide:function(){}}, // объект, который обладает двумя методами - .show() и .hide()

			whenEachHit: function(){}, // функция, которая выполняется на каждом хите
			onStop: function(){}, // функция, которая вызывается при завершении цикла, а также во время ошибки
			onError: function(){} // функция, которая вызывается при ошибке
		}, // опции по умолчанию
		vars: {
			status: 'U',
			created: false,
			running: false,
			timeTag: false,
			ajaxTag: false,
			step: 0, // текущий шаг
			cFields: {} // текущие поля, которые передаются на каждом хите
		} // значимые переменные
	});
	if(typeof opts == 'object')
		$.extend(s.opts, opts);
	
	/*** public ***/
	/* methods */
	// вызывается для начала процесса. поля fields передаются в запросе на каждом хите
	s.start = function(fields){
		if(sv.running) return;
		sv.running = true;
		sv.status = 'R';

		sv.cFields = fields;
		s._call();
	}
	// прерывание процесса
	s.stop = function(){
		clearInterval(sv.timeTag);

		if(typeof(sv.ajaxTag) != 'undefined' && sv.ajaxTag.readyState < 4)
			sv.ajaxTag.abort();

		s._stop();
	}
	// выдаёт ссылку на текущие поля, которые были переданы .start(). Это позволяет их модифицировать между итерациями
	s.fields = function(){
		return sv.cFields;
	}
	s.status = function(){
		return sv.status;
	}		
	
	/*** private ***/
	/* methods */
	s._stop = function(){
		sv.step = 0;
		sv.running = false;
		sv.status = 'S';		
	}
	s._call = function(){
		so.loader.show();
		
		var flds = {__step: sv.step};
		if(so.tag)
			flds.ajaxTag = so.tag;

		sv.ajaxTag = $.ajax({
				url: so.url,
				data: $.extend(flds, sv.cFields),
				type: "POST",
				dataType: "json",
				success: function(result){
					sv.step++;

					if(so.escapeJSON)
						$.each(result, function(i, item){
							if(typeof(item) == 'string')
								result[i] = s._escapeHtml(item.toString());
						});
					
					if(!so.whenEachHit.apply(s, [result, sv.cFields])){
						so.onStop.apply(s, [result, sv.cFields]);
						s._stop();
					}else if(sv.running)
						sv.timeTag = setTimeout(function(){s._call()}, so.interval);
				},
				error: function(xhr, message, descr){
					if(message == 'abort') return;
					s.stop();
					so.onStop.apply(s, [{}, sv.cFields]);
					so.onError.apply(s, [message, descr]);
					console.error('Ajax call failure: '+message+'('+descr+')');
				},
				complete: function(){
					so.loader.hide();
				}
		});
	}
	s._escapeHtml = function(unsafe){
	  return unsafe
		  .replace(/&/g, "&amp;")
		  .replace(/</g, "&lt;")
		  .replace(/>/g, "&gt;")
		  .replace(/"/g, "&quot;")
		  .replace(/'/g, "&#039;");
	}

    /*** init ***/
	var so = s.opts;
	var sv = s.vars;

	return s;	
}

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

/*
 классы для связи с dom:
 .-pb-progress // dom элемент, который используется в качестве индикатора прогресса. меняется параметр width
 */
$.fn.progressBar = function(todo){

	/*** plugin parameters ***/
	var self = {pcode: 'progressBar',options:{
		interactive: true, // реагирует ли progressbar на нажатие мыши\вращение колёсика
		useWheel: true, // если true и interactive == true, то значение bar`а можно менять, вращая колесо мыши
		top: 100, // верхняя граница (значение, которое будет соответствовать 100%)
		step: 1, // шаг сетки
		initial: false, // начальное значение, число
		eventExtArea: false,
		smoothBar: false, // если true, то шкала будет изменяться плавно, а не скачками
		
		onValueChange: function(newVal){}, // срабатывает при всех изменениях значения
		onValueChangeByUser: function(newVal){}, // срабатывает только при изменении значения НЕ ПРОГРАММНО
		onTrackBarChange: function(tempVal, pos){}, // срабатывает, когда меняется положение bar`а
		onDragStart: function(){}, // срабатывает, когда пользователь начинает двигать bar
		onDragEnd: function(){} // срабатывает, когда пользователь заканчивает двигать bar
	}};
	
	/*** methods standard ***/
	self.init = function(options){

		//var common = {};
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
				},
				vars: { // переменные величины
					value: 0, // текущее значение шкалы (может оказаться любым целым из диапазона [0. data.opts.top]
					stepped: 0, // то же, что и value, но выровненное по сетке, если data.opts.step > 1
					//width: $this.width(), // при ресайзе пересчитать это
					offset: Math.floor($this.offset().left), // и это тоже
					followMouse: false, // флажок, который сбрасывается в true, если mousedown сработал на элементе. регулирует драг
					followWheel: false, // флажок, который сбрасывается в true, когда срабатывает mouseover и обратно, когда mouseout. регулирует реакцию на вращение колеса мыши
					notClick: false // флажок, который сбрасывается в true, если между mousedown и mouseup был mousemove
				},
				/*
				tmpls: {},
				sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
				*/
				opts: $.extend({}, opts) // опции плагина на момент инициализации
			}
			
			// тут дальнейшая инициализация
			$this.css('position', 'relative');
			data.ctrls.bar = $('.-pb-progress', $this).css({position: 'absolute', left: 0});
			//data.vars.k = data.vars.width / data.opts.top;
			
			if(data.opts.interactive){
			
				var muCb = function(){
					if(data.vars.followMouse){
						if(!data.vars.notClick) self._processMouse.call(data); // если это простой щелчок (т.е. между mousedown и mouseup не было mousemove)
						
						data.vars.value = data.vars.tempValue;
						data.vars.notClick = data.vars.followMouse = false;
						
						data.opts.onValueChange.apply(data, [data.vars.value]);
						data.opts.onValueChangeByUser.apply(data, [data.vars.value]);
						data.opts.onDragEnd.apply(data, [data.vars.value]);
					}
				}
				var mmCb = function(e){
					if (!e) e = window.event;
					
					data.vars.mouse = e.pageX ? e.pageX :(e.clientX ? e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft : 0);

					if(data.vars.followMouse){
						data.vars.notClick = true;
						self._processMouse.call(data);
					}
				};
				var mdCb = function(){
					data.vars.followMouse = true;
					data.opts.onDragStart.apply(data, [data.vars.value]);
				}
			
				$(document).bind('mousemove.'+self.pcode, mmCb)
				.bind('touchmove.'+self.pcode, function(e){
					mmCb({
						clientX: e.originalEvent.changedTouches[0].clientX
					});
				})
				.bind('mouseup.'+self.pcode, muCb)
				.bind('touchend.'+self.pcode, muCb);
				
				var area = $this;
				var aarea = false;
				if((aarea = $(data.opts.eventExtArea)).length == 1)
					area = aarea;
				
				area.bind('mousedown'/*.'+self.pcode*/, mdCb);
				area.bind('touchstart.'+self.pcode, mdCb);					
				
				if(data.opts.useWheel){
				
					area.bind('mouseover.'+self.pcode, function(){
						data.vars.followWheel = true;
					}).bind('mouseout.'+self.pcode, function(){
						data.vars.followWheel = false;
					}).bind('mousewheel.'+self.pcode, function(e, delta){
						if(data.vars.followWheel){
							e = e.originalEvent || window.event;
							var delta = 0;
							if(e.wheelDelta){
								delta = event.wheelDelta / 120;
								if (window.opera) delta = -delta;
							}else if (event.detail){
								delta = -event.detail / 3;
							}
							if(self._setValue.apply(data, [data.vars.stepped + delta*data.opts.step, true]))
								data.opts.onValueChangeByUser.apply(data, [data.vars.value]);
							return false;
						}
					});
				}
			}
			if(data.opts.initial !== false)
				self._setValue.apply(data, [+data.opts.initial]);
			
			///////////////
			//////////////////////////////////////////////////////////
			$this.data(self.pcode, data);
		});
	}
	
	/*** methods public ***/
	// получает значения первого элемента jquery-выборки
	self.getValue = function(getStepped){
		var frst = this.eq(0).data(self.pcode).vars;
		return getStepped ? frst.stepped : frst.value;
	}
	// задаёт положение индикатора прогресса между значениями [0, data.opts.top]
	self.setValue = function(progress){
		return this.each(function(){
			var data = $(this).data(self.pcode);
			if(typeof data == 'undefined') return;
			self._setValue.apply(data, [progress]);
		});
	}
	
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
	// обратное преобразование: координаты мыши => положение progressbar => значение
	// тут надо возможно захуярить throttle декоратор
	self._processMouse = function(){
		var w = this.dom.width();
		var pos = this.vars.mouse - this.vars.offset;
		if(pos < 0) pos = 0;
		if(pos > w) pos = w;

		this.vars.tempValue = Math.floor(pos / w * this.opts.top);
		pos = Math.floor(pos);

		// эту хуету надо ещё выровнять по сетке, если сетка есть
		if(this.opts.step > 1 && pos > 0){
			var tVal = this.vars.tempValue;
			var steppedTVal = tVal - (tVal % this.opts.step);
			
			if(steppedTVal < this.opts.top)
				steppedTVal += this.opts.step;

			//console.dir('pos: '+pos+' tVal: '+tVal+' stVal: '+steppedTVal+' stepped (now): '+this.vars.stepped);

			if(steppedTVal == this.vars.stepped) return;
			else this.vars.stepped = steppedTVal;	

			// теперь из скорректированного steppedTVal надо получить позицию bar
			pos = self._map.apply(this, [steppedTVal]);
		}else
			this.vars.stepped = this.vars.tempValue;
		
		this.ctrls.bar.css('width', pos+'px');
		this.opts.onTrackBarChange.apply(this, [this.vars.tempValue, pos]);
	}
	// прямое преобразование: задаваемое значение => отображение progressbar
	self._setValue = function(progress, strict){
			
		var top = this.opts.top;
		
		progress = +progress;
		if(strict && (progress < 0 || progress > top)) return; // строгое попадание в интервал
		if(progress < 0) progress += top; // отрицательные значения возвращаем обратно в интервал
		if(progress > top) progress %= top; // значения, большие top, возвращаем обратно в интервал
		
		var fin = function(progress){
			this.vars.value = progress;
			this.opts.onValueChange.apply(this, [this.vars.value]);
		}
		
		// выравниваем progress по сетке
		if(this.opts.step > 1){
			var stepped = progress - (progress % this.opts.step);
			if(stepped == this.vars.stepped){
				fin.apply(this, [progress]);
				return;
			}else
				this.vars.stepped = stepped;
		}else
			this.vars.stepped = progress;
		
		// теперь надо мапнуть шкалу progress в ширину нашего progressbar
		var mappedProgress = self._map.apply(this, [progress]);
		
		if(this.vars.value != mappedProgress){

			if(this.opts.smoothBar)
				this.ctrls.bar.animate({width: mappedProgress+'px'});
			else
				this.ctrls.bar.css('width', mappedProgress+'px');

			fin.apply(this, [progress]);
			this.opts.onTrackBarChange.apply(this, [this.vars.value, mappedProgress]);
		}
		return true;
	}
	self._map = function(value){
		var mapped = Math.round(value * this.dom.width() / this.opts.top);
		if(mapped > this.vars.top)
			mapped = this.vars.top;
		return mapped;
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

			if(typeof obj1 == 'undefined' || typeof obj2 == 'undefined') return false;

			for(var k in obj1)
				if(obj1.hasOwnProperty(k)){
					if(typeof obj2[k] == 'undefined') return false;
					//console.dir(obj1[k]+' == '+obj2[k]);
					if(!(typeof obj1[k] == 'object' ? $.equalObj(obj1[k], obj2[k]) : obj1[k].toString() == obj2[k].toString())) return false;
				}

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
	},
	
	dup: function(data){
		if(typeof data == 'object')
			return "length" in data ? $.extend([], data) : $.extend(true, {}, data);
		else
			return data;
	}

});

