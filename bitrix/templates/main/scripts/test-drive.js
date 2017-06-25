;$(document).ready(function() {
	$('.-test-drive-form').myForm({
		init: function(options) {
			// this refers to form
			var $form = $(this);

			// stylize form elements
			$form.find('select,input[type=checkbox],input[type=radio]').styler();

			// set phone mask
			$form.find('.-phone').inputmask('+7(999) 999-99-99');

			// clear error on field-click
			$form.find('input,.-accept').on('click', function() {
				$(this).removeClass('error');
				// hide err messages
				$('.-result-text').fadeOut('fast', function() {
					$(this).empty();
				});
			});

			// show popup
			$('.open-popup').fancybox({
				padding: 0,
				beforeShow: function() {
					this.inner.parents('.fancybox-wrap').addClass('test-drive-popup-fancy');
				}
			});

			// add another "select type" field
			$form.on('click', '.form-add-field', function(evt) {
				evt.preventDefault();
				var clone = $form.find('.-tech-type').last().clone();
				$('.tech-selects').append( clone );
				clone.wrap('<label>');
				clone.styler();
			});

			// date picker
			$form.find('.form-date input').pickadate();
		},
		validateForm: function(options) {
			// this refers to form
			var errorMsgs    = [],
				$form        = $(this),
				errorFlag    = false,
				setError     = function(msg) {
					if (!errorFlag) {
						errorMsgs.push( 'Не заполнены необходимые поля' );
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

				// check checkboxes %)
				if ('checkbox' == $field.prop('type') && !this.checked) {
					setError('Не заполнены необходимые поля');
					$field.closest('.jq-checkbox').addClass('error');
					// continue
					return true;
				}

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
		afterResponse: function(response) {
			// this refers to form
			var self = $(this);
			this.reset(); // clear form
			// remove excess selectboxes, reset default value
			self
				.find('.tech-selects')
				.children()
				.not(':first')
				.remove()
				.end()
				.find('select').val('')
				.trigger('change');

			// update styled checkboxes
			$(this).find('input[type=checkbox]')
				.trigger('change');
		},
		messages: {
			success : 'Заявка успешно отправлена.<br>Наши менеджеры свяжутся с Вами позже.',
			error   : 'Не удалось отправить заявку.<br>Повторите попытку позже.'
		},
		controls: {
			ajaxloader  : '.preloader',
			messagesBox : '.-result-text',
			submit      : '.-submit'
		}
	});
});