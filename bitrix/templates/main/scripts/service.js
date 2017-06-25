$(document).ready(function() {
	// stylize controls
	$('.service-banner-select,.service-form')
		.find('select,input[type=checkbox],input[type=radio]')
		.styler();

	$('.-banner-select').on('change', function() {
		var data = $(this).val();
		$('.service-banner-box').html( $('.service-banner-box-' + data ).html());
	});

	// show popup
	$('.open-popup').fancybox({
		padding: 0,
		beforeShow: function() {
			this.inner.parents('.fancybox-wrap').addClass('test-drive-popup-fancy');
		}
	});

	$('.-service-form').myForm({
		init: function(options) {
			// this refers to form
			var $form = $(this);

			// clear error on field-click
			$form.find('input,.-accept').on('click focus', function() {
				$(this).removeClass('error');
				// hide err messages
				$('.-result-text').fadeOut('fast', function() {
					$(this).empty();
				});
			});

			// set phone mask
			$form.find('.-phone').inputmask('+7(999) 999-99-99');
		},
		validateForm: function(options) {
			// this refers to form
			var errorMsgs    = [],
				$form        = $(this),
				errorFlag    = false,
				setError     = function(msg) {
					if (!errorFlag) {
						errorMsgs.push(msg);
						// set not-filled error flag
						errorFlag = true;
					}
				},
				formFields   = $form.find('input,textarea,select'),
				emailPattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i,
				phonePattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

			// clear all errors
			$form.find('.error').removeClass('error');

			// iterate fields
			formFields.each(function() {

				var $field = $(this),
					fName  = this.name,
					fValue = $.trim(this.value);

				// check if empty
				if (!fValue.length) {
					setError('Не заполнены необходимые поля');
					$field.addClass('error');
					// continue
					return true;
				}

				// check email
				if ('email' == fName && !emailPattern.test(fValue)) {
					errorMsgs.push('Поле "E-mail" заполнено неверно');
					$field.addClass('error');
				}

				// check phone
				if ('phone' == fName && !phonePattern.test(fValue)) {
					errorMsgs.push('Поле "Телефон" заполнено неверно');
					$field.addClass('error');
				}
			});

			// check `serv` radio buttons
			if (!$form.find('[name=serv]:checked').length) {
				errorMsgs.push('Следует выбрать один из вариантов');
				errorFlag = true;
			}

			// check errors
			if (errorFlag || $form.find('.error').length) {
				$('.-result-text').show().html( errorMsgs.join('<br>') );
				return false; // validation failed
			}

			return true;
		},
		getMoreData: function() {
			return {
				sessid: BX.bitrix_sessid()
			};
		},
		afterResponse: function(data, options) {
			// this refers to form
			var self = $(this),
				message = options.messages.error;

			// show message
			if (data && data.result) {
				message = options.messages.success;
				this.reset(); // clear form
			}

			self.find( options.controls.messagesBox ).show().html( message );
			// hide popup window in 3 secs
			setTimeout(function() {
				$.fancybox.close();
			}, 3000);
		},
		messages: {
			success : 'Заявка успешно отправлена.<br>Наши менеджеры свяжутся с Вами позже.',
			error   : 'Не удалось отправить заявку.<br>Повторите попытку позже.'
		},
		controls: {
			ajaxloader  : '.preloader',
			messagesBox : '.-result-text',
			submit      : '.-submit'
		},
		variables: {
			showSuccess : false
		}
	});
});