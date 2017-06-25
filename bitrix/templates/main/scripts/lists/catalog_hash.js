// http://dev.bars.ru/catalog/test/#!/PRICE=100:200&POWER=300&NAME=Имя+товара/PRICE=asc/2
function CListHash(opts){

	/*** defaults ***/
	var s = this;
	$.extend(s, {
		//pcode: 'CListHash', // имя класса
		opts: {
			hTempl: '!/{props}/{sort}/{nav}', // шаблон маршрута списка в хеше
			allowed: '^\\s/', // разрешённые символы в частях маршрута (между {})
			code2val: '=', // разделитель между PROPERTY_CODE и VALUE
			prop2prop: '&' // разделитель между PROPERTY_CODE=VALUE
		}, // опции по умолчанию
		vars: {
			fields: {
				nav: {page: false},
				sort: {by: false},
				props: {}
			} // текущие значения
		}, // значимые переменные
		/*
		ctrls: {}, // ссылки на контролы
		tmpls: {} // ссылки на шаблоны
		*/
	});
	if(typeof opts == 'object')
		$.extend(s.opts, opts);
	
	/*** public ***/
	/* methods */
	s.hasNav = function(){
		return sv.fields.nav.page !== false;
	}
	s.getNav = function(){
		return sv.fields.nav.page;
	}
	s.hasSort = function(){
		return sv.fields.sort.by != false;
	}
	s.getSort = function(){
		return sv.fields.sort.by == false ? false : $.extend({}, sv.fields.sort);
	}
	s.getProp = function(code){
		return sv.fields.props[code];
	}
	s.store = function(props, nav, sort){
		//console.dir('STORING');
		//console.dir(fields);

		// props - опрашиваем свойства и получаем не-дефолтные упакованные
		// nav, sort - как обычно

		//sv.fields = $.extend(true, {}, fields);
		sv.fields = {
			props: {},
			sort: $.extend({}, sort),
			nav: $.extend({}, nav)
		};

		$.each(props, function(i, prop){
			if((value = prop.getFiltrable(true)) !== false)
				sv.fields.props[i] = value;
		});

		s._2Hash();
	}
	s.storePage = function(page){
		sv.fields.nav.page = page;
		s._2Hash();
	}
	
	/*** private ***/
	/* methods */
	s._2Hash = function(){

		var props = [];
		for(var k in sv.fields.props)
			props.push(k+'='+sv.fields.props[k]);

		console.dir('UPDATE HASH:');
		console.dir(sv.fields);

		window.location.hash = '#'+s.opts.hTempl.
					replace('{nav}', sv.fields.nav.page).
					replace('{sort}', sv.fields.sort.by+so.code2val+sv.fields.sort.order).
					replace('{props}', props.join(so.prop2prop));
	}

    /*** init ***/
	var so = s.opts;
	var sv = s.vars;
	//var sc = s.ctrls;

	var results = new RegExp(so.hTempl.replace(/{[a-z-_]+}/ig, '(['+so.allowed+']*)')).exec(window.location.hash);

	if(results != null){
		// перестановка порядка пока не учитывается
		sv.fields = {
			props: typeof results[1] == 'string' ? results[1].split(so.prop2prop) : {},
			sort: typeof results[2] == 'string' ? results[2].split(so.code2val) : {},
			nav: {page: parseInt(results[3]) ? parseInt(results[3]) : false}
		};

		sv.fields.sort = {
			by: typeof sv.fields.sort[0] == 'string' ? sv.fields.sort[0] : false,
			order: sv.fields.sort[1] == 'asc' ? 'asc' : 'desc'
		};

		// парсим свойства
		var props = {};
		for(var k in sv.fields.props){
			var p = sv.fields.props[k].split('=');
			if(p.length < 2) continue;

			props[p[0]] = p[1];
		}

		sv.fields.props = props;
	}

	console.dir('PARSED:');
	console.dir(sv.fields);

	/*** finally ***/
	
	return s;
}