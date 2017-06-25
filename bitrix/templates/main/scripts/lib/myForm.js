;(function($) {
	// check 4 FormData availability
	if (! ('FormData' in window) ) {
		throw new Error('your browser does not support FormData');
	}
	// add jQuery method
	$.fn.myForm = function(opts) {
		var options = $.extend(
			true, // deep merge
			{
				init          : $.noop,
				beforeRequest : $.noop,
				afterResponse : $.noop,
				validateForm  : function() {
					return true;
				},
				getMoreData   : function() {
					return {};
				},
				ajaxFlags     : {
					processData: false,
					contentType: false
				},
				messages      : {
					success : 'sending form successfull',
					error   : 'error while sending form'
				},
				controls      : {
					messagesBox : '.-messages-box',
					ajaxloader  : '.-ajax-loader',
					submit      : 'input[type=submit]'
				},
				variables     : {
					fadeTimeout: 4000,
					showSuccess: true
				},
				actionUrl     : window.location.href,
				debug         : false
			},
			opts);

		return this.each(function() {
			var self = $(this);
			if (options.debug) {
				console.log('init form');
			}
			// init form
			options.init.call(this, options);

			var startProgress = function() {
					// show loader
					self
						.find( options.controls.ajaxloader )
						.css('visibility', 'visible');
					// disable submit button
					self
						.find( options.controls.submit )
						.prop('disabled', true);
					// clear old messages
					self
						.find( options.controls.messagesBox )
						.empty();

					if (options.debug) {
						console.log('start progress');
					}
				},
				stopProgress = function() {
					// hide loader
					self
						.find( options.controls.ajaxloader )
						.css('visibility', 'hidden');
					// enable submit button
					self
						.find( options.controls.submit )
						.prop('disabled', false);

					if (options.debug) {
						console.log('stop progress');
					}
				};

			// submit handler
			$(this).on('submit', function(evt) {
				evt.preventDefault();
				if (options.debug) {
					console.log('form submit handler started');
				}
				// show progress
				startProgress();

				// validate form
				if (!options.validateForm.call(this, options)) {
					stopProgress();
					if (options.debug) {
						console.log('validation not passed');
					}
					return false;
				}

				if (options.debug) {
					console.log('validation passed');
				}

				// get form data
				var ajaxOptions = {
						url      : self.prop('action') || options.actionUrl,
						type     : self.prop('method') || 'GET',
						dataType : 'json'
					},
					formData    = new FormData( this ),
					moreData    = options.getMoreData.call(this, options);

				$.each(moreData, function(key, value) {
					formData.append( key, value );
				});

				// extend ajax options
				$.extend( ajaxOptions, {data: formData}, options.ajaxFlags );

				// before form send handler
				options.beforeRequest.call(this, options);

				var msgBox = self.find( options.controls.messagesBox );

				// send request
				$.ajax( ajaxOptions )
					.done(function(response) {
						// invoke afterResponse handler
						options.afterResponse.call(self.get(0), response, options);
						// show success message
						if (options.variables.showSuccess) {

							if (response.status == 'OK') {
								msgBox.html( options.messages.success );
							} else {
								msgBox.html( options.messages.error );
							}
							msgBox.show();

						}
					})
					.fail(function() {
						// show error message
						msgBox
							.html( options.messages.error )
							.show();
					})
					.always(function() {
						if (options.debug) {
							console.log('got response');
						}

						setTimeout(function() {
							msgBox.fadeOut(function() {
								msgBox.empty();
							});
						}, options.variables.fadeTimeout);

						stopProgress();
					});

				if (options.debug) {
					console.log('request sent');
				}
			});
		});
	};

})(jQuery);