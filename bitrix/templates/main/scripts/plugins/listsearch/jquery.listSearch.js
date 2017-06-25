(function(jQuery){
	var ListSearch = function() {};
	ListSearch.prototype = {
		/**
		 * run
		 * start incremental search.
		 * @param {} input
		 * @param {} target
		 * @returns {} 
		 */
		run: function(input, target){
			var _this = this;
			var tagName = target.get(0).tagName;
			
			input.on('keyup', function(e){
				text = _this.getInputText(input);
				
				switch(tagName){
				case 'TABLE':
					_this.listSearchTable(target, text);
					break;
				case 'UL':
					_this.listSearchListUl(target, text);
					break;
				case 'OL':
					_this.listSearchListOl(target, text);
					break;
				case 'DL':
					_this.listSearchListDl(target, text);
					break;
				default:
					throw new Error('Illegal tag name ' + targetObject.targetTagName);
				}
			});
		},
		
		getInputText: function(input){
			return input.val();
		},
		
		/**
		 * tag table
		 */
		listSearchTable: function(target, text){
			this.listSearchCommon('tr', target, text);
		},
		
		/**
		 * tag ul
		 */
		listSearchListUl: function(target, text){
			this.listSearchCommon('li', target, text);
		},
		
		/**
		 * tag ol
		 */
		listSearchListOl: function(target, text){
			return this.listSearchListUl(target, text);
		},
		
		/**
		 * tag dl
		 */
		listSearchListDl: function(target, text){
			this.listSearchCommon('dd dt', target, text);
		},
		
		/**
		 * commondSearchList
		 */
		listSearchCommon: function(tagName ,target, text){
			var _this = this;
			var searchWords = this.searchWordToWords(text);
			var wordLength = searchWords.length;
			
			target.find(tagName).each(function(){
				var thisJQuery = jQuery(this);
				if (thisJQuery.data('ignore-list-search') === 'ignore') return true;
				
				var body = _this.getBody(thisJQuery);
				var displayFlag = true;
				
				var wordCount = 0;
				for(wordCount = 0; wordCount < wordLength; wordCount++){
					var word = searchWords[wordCount];
					
					var pattern = new RegExp(word, 'i');
					if ( !body.match(pattern) ) {
						displayFlag = false;
						break;
					}
				}
				
				jQuery(this).css('display', _this.getDisplayProperty(tagName, displayFlag));
				return true;
			})
		},
		
		/**
		 * getDisplayProperty
		 * @param {} tagName
		 * @param {} flag
		 * @returns {} 
		 */
		getDisplayProperty: function(tagName, flag){
			switch(tagName){
			case 'tr':
				return flag?'table-row':'none';
			case 'li':
				return flag?'list-item':'none';
			case 'dd dt':
				return flag?'list-item':'none';
			default:
				throw new Error('Illegal tag name ' + targetObject.targetTagName);
			}
		},
		
		/**
		 * getBody
		 * @returns {}
		 */
		getBody: function(target){
			var body = target.text();
			return jQuery.trim(body);
		},
		
		/**
		 * searchWordToWords
		 * a search text split to search words.
		 * @param {} body
		 * @param {} searchWord
		 * @returns {} 
		 */
		searchWordToWords: function(text){
			text = jQuery.trim(text);
			var pattern = new RegExp(/[ 　\-\/]/);
			var words = text.split(pattern);
			
			// delete empty element
			var newWords = new Array();
			var wordsLength = words.length;
			var wordsCount = 0;
			for (wordsCount = 0; wordsCount < wordsLength; wordsCount++){
				var word = words[wordsCount];
				if (word != ""){
					newWords.push(words[wordsCount]);
				}
			}
			return newWords;
		}
	}
	
	/**
	 * Main stream
	 */
	jQuery.fn.listSearch = function(input, options){
		var options = jQuery.extend(jQuery.fn.listSearch.defaults, options);
		
		// set using objects.
		var target = jQuery(this);
		switch (jQuery.type(input)){
			case 'string':
				input = jQuery(input);
				break;
			case 'object':
				input = input;
				break;
			default:
				throw 'Argiment value "' + input + '" is invalid.';
		}
		
		// Event start
		listSearch = new ListSearch();
		listSearch.run(input, target);
		
		return target;
	};
	
	/**
	 * default settings.
	 */
	jQuery.fn.listSearch.defaults = {
		
	};
})(jQuery);
