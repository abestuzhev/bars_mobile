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
	// выводит страницу с номером page
	self.page = function(page, cb){

		sv.fldCache.nav.page = page;

		var aItems = [];
		var buf = [];
		var ids = [];

		// тут надо учесть асинхронность

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
			var aItems = sv.requester.makeNodes(buf);

			if(typeof cb == 'function') cb();
			so.onAfterRefresh.apply(self, [aItems]);
		});

		return aItems;
	}
	// возвращает количество страниц (возможно использовать только после хотя бы одного вызова .perform())
	self.pageCount = function(){
		if(typeof sv.fldCache.nav == 'undefined') return -1;
		return sv.fldCache.nav.showAll ? 1 : Math.ceil(sv.itemsCount / sv.fldCache.nav.lop);
	}
	// сколько страниц уже было показано
	self.pagesShown = function(){
		return sv.fldCache.nav.page;
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
			type: 'get',
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