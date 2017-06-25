function CListClientSide(opts){

	/*** defaults ***/
	var self = {
		pcode: 'CListClientSide', // имя класса
		opts: {
			items: [], // массив элементов, переданный через опции
			fetchURL: '', // позволяет брать список элементов на json по указанному урлу. это для того, чтобы не ждать загрузки гигантского списка
			tag: false, // дополнительный флажок, который отправляется в ajax запросе. по нему можно отследить, что именно от этого компонента отправлен данный запрос. полезно при наличии нескольких ajax-компонентов на странице

			whenItemProcess: function(item){return '<div></div>'}, // когда элемент перегоняется из json в html. должна возвращать строку или объект jquery
			
			onInitialize: function(){}, // когда происходит инициализация скрипта
			onItemsRemove: function(){ // когда удаляются элементы
				//sv.requester.ctrls.list.children().css('visibility', 'hidden');
			},
			onAfterRefresh: function(){}, // вызвается после изменения списка
			onBeforeRefresh: function(){}, // вызывается перед изменением списка

			onBeginFetching: function(){}, // вызывается, когда начинается получение элементов по ajax
			onItemsLoaded: function(){} // вызывается, когда элементы были загружены по ajax
		},
		vars: {
			items: [], // массив с элементами списка
			itemIndex: [], // массив тех элементов, которые соответствуют текущему фильтру и сортировке
			fltrTimer: {ID:-1},
			navCache: {lop:10}, // кеш параметров постраничного навигатора. обновляется при .perform()
			fltrCache: {}, // кеш параметров фильтрации. обновляется при .perform()
			
			// переменные fetch by step
			fbsUse: false, // флаг использования загрузки пошагово. зависит от опций и переопределяется далее
			fbsComplete: false, // загрузка элементов пошагово не завершена
			fbsLoaded: 0, // счётчик, который показывает, сколько элементов уже помещено в sv.itemIndex
			totalLoaded: 0, // сколько было загружено пошагово

			lastPage: 0 // последняя успешно показанная страница
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
		if(sv.fbsUse){ // кое-какие модификации поведения CList
			sv.requester.allowDropPN(false);
			sv.requester.allowShowControls(false);
		}
	}
	// выполнить обновление списка
	self.perform = function(fields){
		self._perform(fields);
	}
	// выводит страницу с номером page (нумерация страниц с 1)
	// ! возвращает список элементов, который представляет собой текущую страницу с номером page. если страница пока не готова - возвращается false
	//self.page = function(page, cb, failCb){
	// функция может быть асинхронной в других реализациях
	self.page = function(page){

		sv.navCache.page = page;

		// по поводу sv.navCache.showAll: на самом деле, это тот же lazyOutput, только с бесконечным выводом (т.е. с loAsk == 0) РЕАЛИЗОВАТЬ ЭТО ПОТОМ!

		//console.dir('REQUEST for page '+page);

		if(sv.fbsUse && !sv.fbsComplete){

			if(sv.fbsLoaded >= page*sv.navCache.lop){
				// генерируем страницу

				//console.dir('output ready page '+page);

				var winFrom = (page-1)*sv.navCache.lop;
				var winTo = page*sv.navCache.lop - 1;

				console.dir(winFrom+' => '+winTo);

				//##################

				var buf = [];
				var i = 0;
				for(var k = winFrom; k <= winTo; k++){

					var item = sv.items[sv.itemIndex[k].id];

					// генерируем dom здесь
					if(typeof item.dom == 'undefined'){
						item.HTML.__ID = item.ID;
						sv.items[item.ID].dom = so.whenItemProcess.apply(self, [item, item.ID]);
					}

					buf.push({
						dom: item.dom,
						id: sv.itemIndex[k].id,
						item: item
					});

					i++;
				}

				console.dir(i+' items at page');

				var aItems = sv.requester.makeNodes(buf);
				so.onAfterRefresh.apply(self, [aItems]);

				sv.lastPage = page; // отмечаем последнюю показанную страницу
				//##################

				return aItems;
			}else{

				//console.dir('page not ready');

				//if(typeof failCb == 'function') failCb();
				return false;
			}

		}else{

			console.dir('output after page '+page);

			var winFrom = (page-1)*sv.navCache.lop;
			var winTo = page*sv.navCache.lop - 1;

			//console.dir(sv.items);
			//console.dir(sv.itemIndex);
			console.dir(winFrom+' => '+winTo);

			// a little hack
			if(sv.itemIndex.length == 0)
				return false;
			
			if(winFrom >= sv.itemIndex.length) return true;

			var buf = [];
			var i = 0;
			for(var k = winFrom; k <= winTo; k++){

				if(i >= sv.navCache.lop || k >= sv.itemIndex.length)
					break;
			
				var item = sv.items[sv.itemIndex[k].id];

				// генерируем dom здесь
				if(typeof item.dom == 'undefined'){
					item.HTML.__ID = item.ID;
					sv.items[item.ID].dom = so.whenItemProcess.apply(self, [item, item.ID]);
				}

				buf.push({
					dom: item.dom,
					id: sv.itemIndex[k].id,
					item: item
				});

				i++;
			}

			console.dir(i+' items at page');

			var aItems = sv.requester.makeNodes(buf);
			so.onAfterRefresh.apply(self, [aItems]);

			sv.lastPage = page; // отмечаем последнюю показанную страницу

			return aItems;
		}
	}
	// возвращает количество страниц (возможно использовать только после хотя бы одного вызова .perform())
	self.pageCount = function(){
		return Math.ceil(sv.itemIndex.length / sv.navCache.lop);
	}
	// сколько страниц уже было показано
	self.pagesShown = function(){
		return sv.lastPage;
	}	
	// возвращает true, если ещё не все страницы показаны
	self.morePages = function(){
		if(sv.fbsUse && !sv.fbsComplete) return true; // пока не все элементы подгружены, этот метод должен всегда выдавать true (что будет означать, что ещё есть, что подгрузить)
		return self.pagesShown() < self.pageCount();
	}
	
	/*** private ***/
	/* methods */
	self._addItems = function(items){
		//console.dir(items);

		$.each(items, function(i, item){

			if(i == 'ADDIT_INFO') return;

			item.ID = sv.items.length;
			sv.items.push(item);
		});
	}

	self._perform = function(fields){
		
		sv.navCache = fields.nav;
		sv.outputIndex = 1; // вывод блоков с начала
		sv.lastPage = 0; // последняя показанная страница - никакая
		
		clearTimeout(sv.fltrTimer.ID); // остановим всё предыдущее, если ещё работает
		so.onBeforeRefresh.call(self);

		sv.itemIndex = []; // отфильтрованные элементы (подмножество sv.items)
		var shown = 0;
		var useSort = typeof(fields.sort) != 'undefined' && fields.sort.by;

		sv.fltrCache = fields.props;

		// если используется пошаговая загрузка и она не завершена
		if(sv.fbsUse && !sv.fbsComplete){

			//console.dir('updating while loading');

			// порядок обработки: фильтрация, сортировка, постраничная навигация
			for(var k in sv.items){
				if(self._filter(fields.props, sv.items[k])){
					sv.itemIndex.push({id: sv.items[k].ID});
					shown++;
				}
			}

			console.dir('items filtered: '+shown);

			// тут надо добить элементы из вспомогательного буфера

			sv.requester.updateDone();

		}else{

			// порядок обработки: фильтрация, сортировка, постраничная навигация
			$.each(sv.items, function(bug, item){
				if(self._filter(fields.props, item)){
                                        var val = "";
                                        
                                        
                                        if (useSort) {
                                            val = item.PROPS[fields.sort.by];
                                            
                                            if (typeof val == "undefined") {
                                                val = "";
                                            }
                                        }
                                    
					sv.itemIndex.push(useSort ? {id: item.ID, val: val} : {id: item.ID});
					shown++; 
				}
                               
			});

//			console.dir('items filtered: '+shown);

			if(shown == 0){
                            sv.requester.ctrls.loader.hide(); // местный лоадер типа
                            sv.requester.nothingFound();
			}else{           
                            
                            if(useSort) sv.itemIndex.sort(fields.sort.order == 'asc' ? self._sortAsc : self._sortDesc);

                            $.each(sv.itemIndex.sort(fields.sort.order == 'asc' ? self._sortAsc : self._sortDesc), function( i, val ) {

                                console.log('знач -  ' + val.val + ' ID - ' + val.id);
                            });

                            sv.requester.updateDone();
			}

			/*
			sv.fltrTimer = $.eachAsync(sv.items, function(bug, item){
				if(self._filter(fields.props, item)){
					sv.itemIndex.push(useSort ? {id: item.ID, val: item.PROPS[fields.sort.by]} : {id: item.ID});
					shown++;
				}
			}, function(){ // done

				console.dir('DONEE!! '+shown);

				if(shown == 0){
					sv.requester.ctrls.loader.hide(); // местный лоадер типа
					sv.requester.nothingFound();
				}else{
					if(useSort) sv.itemIndex.sort(fields.sort.order == 'asc' ? self._sortAsc : self._sortDesc);

					//console.dir('a normal');
					//console.dir(sv.itemIndex.length);

					sv.requester.updateDone();
				}
			});
			*/

		}
	}
	
	// если элемент item удовлетворяет фильтру props, то возвращается true, иначе - false
	self._filter = function(props, item){
	
		// если свойств вообще нет, то просто true
		if(props.length == 0) return true;
	
		// действует логика "хотя бы одно совпадение", т.е. OR
		for(var k in props) {
			if (props.hasOwnProperty(k)) {
				var m = k + '_VALUE_ID',
					k_val = item.PROPS[k],
					m_val = item.PROPS[m];
				
				if ( !k_val || 'undefined' === typeof k_val || k_val.toString().length <= 0 ) {
					// empty or undefined property value
					return false;
				}

				var k_match = sv.requester.vars.props[k].match(k_val),
					m_match = m_val && sv.requester.vars.props[k].match(m_val);

				if(!k_match && !m_match) {
					return false;
				}	
			}
		}
		
		return true;
	}	

	// формирует страницу из диапазона [from, to] массива sv.itemIndex
	self._formPage = function(from, to){

		//console.dir(from+' => '+to);

		var buf = [];
		var i = 0;
		for(var k = from; k <= to; k++){

			var item = sv.items[sv.itemIndex[k].id];

			// генерируем dom здесь
			if(typeof item.dom == 'undefined'){
				item.HTML.__ID = item.ID;
				sv.items[item.ID].dom = so.whenItemProcess.apply(self, [item, item.ID]);
			}

			buf.push({
				dom: item.dom,
				id: sv.itemIndex[k].id,
				item: item
			});

			i++;
		}

		var aItems = sv.requester.makeNodes(buf);
		so.onAfterRefresh.apply(self, [aItems]);

		//console.dir(aItems);

		return aItems;
	}

	self._sortAsc = function(a,b){
            
            if (a.val == null) return -1;
            if (b.val == null) return 1;
            
            return a.val > b.val ? 1 : -1;
	}
	self._sortDesc = function(a,b){	
            
            if (a.val == null) return 1;
            if (b.val == null) return -1;
            
            return b.val > a.val ? 1 : -1;
	}
	
    /*** init ***/
	var so = self.opts;
	var sv = self.vars;
	var sc = self.ctrls;
	
	self._addItems(so.items);
	so.onInitialize.call(self);

	sv.fbsUse = so.fetchURL.length > 0;

	$(function(){

		if(sv.fbsUse){

			so.onBeginFetching.call(self);

			sv.requester.freezeDispNavPage(sv.requester.vars.nav.page()); // замораживаем кнопку, костыль
			sv.navCache = sv.requester.getNav();
			sv.fltrCache = sv.requester.getFilter();

			sc.bar = $('.-list-progress', sc.area).progressBar({
				interactive: false,
				useWheel: false,
				initial: 0,
				smoothBar: true
			});

			var opts = {mode: 'stepByStep', sort: sv.requester.getSort()};
			var pNav = typeof sv.requester.opts.navNum == 'undefined' ? 1 : sv.requester.opts.navNum;
			opts['PAGEN_'+pNav] = 1;

			if (so.limit && so.limit == 'noPageLimit') {
				opts.mode = '';
			}

			(new CAjaxIterator({
				url: so.fetchURL,
				tag: so.tag,
				interval: 50,
				whenEachHit: function(res){

					sc.bar.progressBar('setValue', res.ADDIT_INFO.PERCENT);
					self._addItems(res);

					console.dir('Loaded '+res.ADDIT_INFO.PERCENT+'%');
					console.dir(res);

					var notComplete = res.ADDIT_INFO.PERCENT < 100;
					if(!notComplete)
						sv.fbsComplete = true;

					//if(typeof res.ADDIT_INFO.ITEMS_COUNT == 'number')
					//	console.dir('Expected items: '+res.ADDIT_INFO.ITEMS_COUNT);

					$.each(res, function(i, item){

						if(i == 'ADDIT_INFO') return;

						//console.dir('add item:');
						//console.dir(item);

						if(self._filter(sv.fltrCache, item)){
							sv.itemIndex.push({id: item.ID});
							sv.fbsLoaded++;

							// temp
							sv.totalLoaded++;
						}
					});

					if(sv.fbsComplete){

						so.onItemsLoaded.call(self);

						// откат модификации поведения CList
						sv.requester.allowDropPN(true); // врубаем сброс постраничника при .update()
						sv.requester.allowShowControls(true); // врубаем показ контролов при .update()

						// отдельно обновляем сортировку и навигацию
						sv.requester.showControls();

						sv.requester.freezeDispNavPage(false); // размораживаем кнопку

						console.dir('total');
						console.dir(sv.totalLoaded);
						console.dir(sv.itemIndex);

						if(!sv.totalLoaded){
							sv.requester.ctrls.loader.hide(); // местный лоадер типа
							sv.requester.nothingFound();
						}
					}

					this.vars.cFields['PAGEN_'+pNav]++;

					return notComplete;
				}
			})).start(opts);

		}
	
	});

	/*** finally ***/
	
return self;}