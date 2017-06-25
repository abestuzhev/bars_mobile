/*!
 * jQuery Browser Selectors - The solution for special selectors
 * By Mateus Souza - http://mateussouzaweb.com
 * @version 1.2
 *
 * Copyright 2011
 * Licensed under MIT and GPL License - http://www.opensource.org/licenses/mit-license.php || http://www.gnu.org/licenses/gpl.html
 */
(function($){
	
	($.browserSelector = function(){
		
		var userAgent = navigator.userAgent.toLowerCase(),
			html = document.childNodes[1],
			screens = [320, 480, 640, 768, 1024, 1280, 1440, 1680, 1920],
			
			os = /(mac|win|linux|freebsd|mobile|iphone|ipod|ipad|android|blackberry|j2me|webtv)/.exec(userAgent),
			ua = /(ie|firefox|chrome|safari|opera)(?:.*version)?(?:[ \/])?([\w.]+)/.exec(userAgent);
		
		$(html).addClass(os[1] + ' ' + ua[1]);
		
		/**
		 * Fix Safari
		 */
		if(ua[1] == 'safari') $(html).addClass(ua[1] + '-' + ua[2].substring(0, 1));
		else $(html).addClass(ua[1] + '-' + parseInt(ua[2]));
		
		/**
		 * IE conditional
		 */
		if(ua[1] == 'ie'){
			
			for(var ver = 3; ver < 10; ver++) {
				if(parseInt(ua[2]) < ver) $(html).addClass('lt-ie-' + ver);		
			}
		}
		
		/**
		 * Screen resolution
		 */
		$(window).bind('resize', function(){
			
			var w = window.outerWidth || html.clientWidth;
			
			/**
			 * Remove the actual class
			 */
			console.dir(html);
			html.className = $.trim( html.className.replace(/(\s)screen-[0-9]+/ig, '') );
			
			/**
			 * Process each resolution
			 */
			for(var i = 0; i < screens.length; i++ ){
				
				if(w <= screens[i]){
					$(html).addClass('screen-' + screens[i]);
					break;
				}
				
			}
			
		}).trigger('resize');
		
	})();
	
})(jQuery);