/*
 Какие методы должен поддерживать property:
 .reset()
 .getFiltrable()
 .match()
 
 Какие свойства:
 .code
 */

// базовое свойство
function ABaseProp(opts){

	var s = this;
	
	// опции по умолчанию
	s.opts = $.extend({
		code: null, // строковый код свойства (для фильтра)
		defValue: 0, // значение по-умолчанию
		readTmout: 200,
		
		onReset: function(){}, // вызывается при сбросе свойства
		
		whenUseness: function(uf){console.error('whenUseness not implemented')}, // функция, которая, по идее, вызвается для того, чтобы известить контрол, нужно ли ему отображаться. например, если у всех элементов списка это поле пустое, то нет смысла по нему фильтровать, и контрол лучше скрыть совсем
		/*убрать*/whenBind: function(){}, // функция вызывается один раз - при инициализации, и привязывает изменение виджета к изменению значения свойства. эту функцию надо вырезать
		whenChange: function(){} // когда ПРОГРАММНО меняется значение свойства, и нам нужно поменять виджет
	}, opts);
		
	// значимые переменные
	s.vars = $.extend(s.vars,{
		parent: null, // ссылка на responser
		value: 0, // текущее значение
		updLock: false // флаг, который предотвращает зацикливание сигналов
	});
	
	/*** public ***/
	/* methods */
	s.reset = function(){
		var s = this;

		s.value(s.opts.defValue);
		s.opts.onReset.call(s);
	}
	// когда пользователь что-то щёлкает по виджету, с помощью этого метода нужно менять значение свойства.
	// использовать только эту функцию: она блокирует зацикливание сигналов и устраняет дребезг
	s.valueFromWidget = $.debounce(function(newVal){
		this.valueImmediate(newVal);
	}, s.opts.readTmout);
	// функция задания значения. блокирует зацикливание сигналов, но не устраняет дребезг
	s.valueImmediate = function(newVal){

		var s = this;

		if(newVal === s.vars.value) return;
		this.value(newVal, true);
	}
	// низкоуровневая функция задания значения. не использовать напрямую
	s.value = function(newVal, jamSig){
		var s = this;

		if(typeof newVal != 'undefined'){

			//if(s.vars.updLock || (newVal == s.vars.value)) return;
			if(s.vars.updLock) return;

			s.vars.value = s._clone(newVal);
			s.vars.updLock = true;
			if(!jamSig) s.opts.whenChange.apply(s, [newVal]);
			s.vars.updLock = false;

			if(s.vars.parent && typeof(s.vars.parent.update) == 'function')
				s.vars.parent.update();
			
		}else
			return s.vars.value;
	}
	// этот метод имеет смысл только в связке с CListClientSide
	s.match = function(val){
		console.error('match() not implemented, but should be!');
	}
	s.getFiltrable = function(packed){
		console.error('getFiltrable() not implemented, but should be!');	
	}
	s.option = function(opt, val){

		var s = this;

		if(typeof val == 'undefined') return s.opts[opt];
		s.opts[opt] = val;
	}
	s.setValue = function(val, packed){

		var s = this;

		if(typeof val != 'undefined'){

			if(packed)
				val = s._unpack(val);

			s.vars.value = val;

			s.opts.whenChange.apply(s, [val]);
		}
	}
	
	/*** private ***/
	/* methods */
	s.merge = function(){
		var result = {};
		for(k in arguments)
			result = $.extend(result, arguments[k])

		return result;
	}
	s._isNumeric = function(n){
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	// клонирует значение
	s._clone = function(data){
		if(typeof data == 'object')
			return "length" in data ? $.extend([], data) : $.extend(true, {}, data);
		else
			return data;
	}

    /*** init ***/
	
	/*** finally ***/	
}

function CStringProp(opts){
	
	var s = this;
	$.extend(this, new ABaseProp(opts));

	/*** public ***/
	/* methods */
	s.match = function(val){
		return val.toLowerCase().indexOf(sv.value.toLowerCase()) >= 0;
	}
	s.getFiltrable = function(packed){
		if(sv.value.length == 0 || sv.value == so.defValue) return false;

		return packed ? encodeURIComponent(sv.value) : sv.value;
	}

	/*** private ***/
	/* methods */
	s._unpack = function(val){
		return decodeURIComponent(val.toString());
	}

    /*** init ***/
	var so = s.opts = s.merge(s.opts, {
		defValue: ''
	}, opts);
	var sv = s.vars = s.merge(s.vars, {
		value: so.defValue
	});
	so.whenBind.call(s);

	/*** finally ***/

	return s;
}

function CIntegerProp(opts){
	
	var s = this;
	$.extend(this, new ABaseProp(opts));
	
	/*** public ***/
	/* methods */
	s.match = function(val){
		return val == sv.value;
	}
	s.getFiltrable = function(packed){
		if(sv.value == 0 || sv.value == so.defValue) return false;

		return sv.value;
	}

	/*** private ***/
	/* methods */
	s._unpack = function(val){
		return parseInt(val);
	}

    /*** init ***/
	var so = s.opts = s.merge(s.opts, {
		defValue: 0
	}, opts);
	var sv = s.vars = s.merge(s.vars, {
		value: so.defValue
	});
	so.whenBind.call(s);

	/*** finally ***/

	return s;
}

function CRangeProp(opts){
	
	var s = this;
	$.extend(this, new ABaseProp(opts));
	
	/*** public ***/
	/* methods */
	s.match = function(val){
		val = parseFloat(val);
		return val >= sv.value[0] && val <= sv.value[1];
	}
	s.getFiltrable = function(packed){
		if(sv.value[0] == so.defValue[0] && sv.value[1] == so.defValue[1]) return false;
		return packed ? sv.value.join(':') : sv.value;
	}

	/*** private ***/
	/* methods */
	s._unpack = function(val){
		var res = val.toString().split(':');
		res[0] = parseInt(res[0]);
		res[1] = parseInt(res[1]);

		return res;
	}

    /*** init ***/
	var so = s.opts = s.merge(s.opts, {
		defValue: [0,0]
	}, opts);
	var sv = s.vars = s.merge(s.vars, {
		value: [so.defValue[0], so.defValue[1]]
	});
	so.whenBind.call(s);
	
	/*** finally ***/

	return s;
}

function CListProp(opts){
	
	var s = this;
	$.extend(this, new ABaseProp(opts));
	
	/*** public ***/
	/* methods */
	s.match = function(val){
	
		if(sv.value.length == 0) return true; // если все галочки сняты
		if(typeof val == 'undefined') return false; // если не все галочки сняты, а этого свойства у элемента нет

		val = parseFloat(val);

		if(isNaN(val)) return false; // если свойство это вообще не число

		return typeof sv.value[val] != 'undefined' && sv.value[val] === true;
	}
	s.getFiltrable = function(packed){
		if(sv.value.length == 0) return false;

		// отбираем подмассив, в котором только true
		var pVal = [];
		for(var k in sv.value)
			if(sv.value[k])
				pVal.push(k);

		return pVal.length == 0 ? false : (packed ? pVal.join(':') : pVal);
	}

	/*** private ***/
	/* methods */
	s._unpack = function(val){
		var res = val.toString().split(':');
		var upVal = {};
		for(var k in res)
			upVal[parseInt(res[k])] = true;

		return upVal;
	}

    /*** init ***/
	var so = s.opts = s.merge(s.opts, {
		defValue: []
	}, opts);
	var sv = s.vars = s.merge(s.vars, {
		value: so.defValue
	});
	so.whenBind.call(s);
	
	/*** finally ***/

	return s;
}

//////////////////////////////////////////
////////////////////////////////// ВИДЖЕТЫ
//////////////////////////////////////////

(function($){

	/*
	 Требует: 
	 - integerOnly
	 - kpressChange
	 */
	$.fn.sliderWidget = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'sliderWidget',opts:{
			bounds: [0, 9999], // максимальное и минимальное значение 
			values: [false, false], // начальное значение
			step: 10,

			whenValueMap: function(val){return val}, // маппинг значения для инпута или метки
			whenValueMapBack: function(val){return parseInt(val)},

			onChange: function(val){}, // вызывается при изменении контролов
			onInit: function(){}
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
				
				// check for valList
				if (opts.valList && opts.valList.length) {
					// this is fixed-step-slider
					opts.step = 0;
				}

				// при каждом вызове плагина self будет ДРУГИМ объектом, поэтому к self никаких данных не привязываем, а вместо этого привязываем всё к data
				var data = {
					dom: $this,
					ctrls: { // хранимые контролы
						from: $('.-slider-from', $this),
						to: $('.-slider-to', $this)
					},
					vars: { // переменные величины
						updLock: false, // флаг, который предотвращает зацикливание сигналов
						values: [0, 0]
					},
					/*
					tmpls: {},
					sdata: common, // shared data, общая инфа для всех элементов в выбранном jquery объекте
					*/
					opts: $.extend({}, opts) // опции плагина на момент инициализации
				}
				
				// тут дальнейшая инициализация
				var so = data.opts;
				var sc = data.ctrls;
				var sv = data.vars;

				sc.slider = $this.find('.-slider-track');
				var opt = false;
				if(opt = self._getOpt(sc.slider, 'min'))
					so.bounds[0] = opt;
				var opt = false;
				if(opt = self._getOpt(sc.slider, 'max'))
					so.bounds[1] = opt;

				// если значение изначально не задано, оно берётся равным минимальному и максимальному значениям
				if(!so.values[0])
					so.values[0] = so.bounds[0];

				if(!so.values[1])
					so.values[1] = so.bounds[1];

				// сохраняем начальные значения в текущие
				sv.values = $.extend([], so.values);

				sc.from.integerOnly({zeroAllowed: true, default: so.bounds[0]});
				sc.to.integerOnly({zeroAllowed: false, default: so.bounds[1]});

				if (so.step) {
					sc.slider.slider({
						range  : true,
						min    : so.bounds[0],
						max    : so.bounds[1],
						values : sv.values,
						step: so.step,
						slide: function( event, ui ){

							self._setValue(sc.from, ui.values[0]);
							self._setValue(sc.to, ui.values[1]);
						},
						stop: function(event, ui){

							so.updLock = true;

							sv.values = ui.values;
							so.onChange.apply(data, [sv.values]);

							so.updLock = false;
						}
					});
				} else {

					sc.slider.slider({
						range  : true,
						min    : 1,
						max    : so.valList.length,
						values : [1, so.valList.length],
						slide: function( event, ui ){
							self._setValue(sc.from, so.valList[ui.values[0] - 1]);
							self._setValue(sc.to, so.valList[ui.values[1] - 1]);
						},
						stop: function(event, ui){
							console.log(event);
							so.updLock = true;

							sv.values = [
								so.valList[ui.values[0] - 1],
								so.valList[ui.values[1] - 1]
							];
							
							so.onChange.apply(data, [sv.values]);

							so.updLock = false;
						}
					});
				}

				if (so.step) {
					// step-slider
					self._setValue(sc.from, sc.slider.slider("values", 0));
					self._setValue(sc.to, sc.slider.slider("values", 1));
				} else {
					// fixed-step-slider
					self._setValue(sc.from, so.valList[sc.slider.slider("values", 0) - 1]);
					self._setValue(sc.to, so.valList[sc.slider.slider("values", 1) - 1]);
				}


				sc.from.kpressChange({
					debounced: false, 
					on:function(){
						if(so.updLock) return;

						sv.values[0] = so.whenValueMapBack.apply($this, [$(this).val()]);
						so.onChange.apply(data, [sv.values]);

						sc.slider.slider("values", sv.values);
						//so.onChange.apply(data, [sv.values]);
					}
				});
				sc.to.kpressChange({
					debounced: false, 
					on:function(){
						if(so.updLock) return;

				    	sv.values[1] = so.whenValueMapBack.apply($this, [$(this).val()]);
				    	so.onChange.apply(data, [sv.values]);

				    	sc.slider.slider("values", sv.values);
					}
				});

				so.onInit.apply(data, [sv.values]);

				///////////////
				//////////////////////////////////////////////////////////
				$this.data(self.pcode, data);
			});
		}
		
		/*** methods public ***/
		self.setValue = function(val){
			return this.each(function(){
				var data = $(this).data(self.pcode);
				if(typeof(data) == 'undefined') return;
				
				var sc = data.ctrls;

				val[0] = parseInt(val[0]);
				val[1] = parseInt(val[1]);

				// задаём положение бегунков
				sc.slider.slider("values", val);

				// задаём значения инпутов
				self._setValue(sc.from, val[0]);
				self._setValue(sc.to, val[1]);

			});
		}
		
		/*** methods private ***/
		self._setValue = function(obj, val){
			//obj.val(this.opts.whenValueMap.apply(this, [val]));

			if(obj.is('input[type="text"]'))
				obj.val(val);
			else
				obj.text(val);
		}
		self._getOpt = function(obj, opt){
			return obj.data("slider-"+opt);
		}
		
		// разбор todo
	    if(typeof(todo) == 'string' && todo[0] != '_' && typeof(self[todo]) == 'function') // todo это метод плагина, который вызываем
			return self[todo].apply(this, Array.prototype.slice.call(arguments, 1));
	    else if(typeof(todo) === 'object' || typeof(todo) == 'undefined') // todo это опции, надо сделать init
			return self.init.apply(this, arguments);
	}

	// ввод только цифр, число целое и неотрицательное
	$.fn.integerOnly = function(todo){

		/*** plugin parameters ***/
		var self = {pcode: 'uintegerOnly',opts:{
			default: 1, // если инпут оставляется пустым, он автоматически заполниется этим значением
			zeroAllowed: true // допустимо ли нулевое значение
		}};
		
		/*** methods standard ***/
		self.init = function(opts){

			//var common = {};
			var opts = $.extend(self.opts, opts);
			return this.each(function(){

				var $this = $(this);
				if($this.data(self.pcode) != null) return; // плагин уже инициализирован на этом элементе

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

				// тут дальнейшая инициализация
				if($this.is('input[type="text"]')){

					var f = function(){
						if($this.val().length > 0){
							var val = parseInt($this.val());
				
							if(isNaN(val)){
								$this.val(data.opts.default);
								return;
							}
				
							$this.val(parseInt(val == 0 && !data.opts.zeroAllowed ? data.opts.default : $this.val()));
						}else{
							if(data.opts.default !== false)
								$this.val(parseInt(data.opts.default));
						}
					};
					$this.change(f);
					$this.blur(f);
					$this.bind('input', function(){
						var val = parseInt($this.val());
						if(isNaN(val))
							$this.val(data.opts.default);
					});
					f();

					$this.keypress(function(event){
						var key = event.keyCode || event.which;
						return !($.inArray(key, [0, 8, 13, 37, 38, 39, 40]) < 0 && (key<48 || key>57));
					});

					$this.data(self.pcode, data);
				}
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

})(jQuery);