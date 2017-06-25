;$(document).ready(function() {

	$('.-phone').inputmask('+7(999) 999-99-99');

	$('.trade-in-form').find('select,input[type=checkbox],input[type=radio],input[type=file]').styler({
		fileBrowse: 'Добавить фото'
	});

	$('.-files-holder').on('change', 'input:file:last', function(e) {
		e.preventDefault();
		$('.-files-holder').append('<input type="file" name="files[]" accept="image/*">');
		$(".-files-holder input[type='file']").styler({
			fileBrowse: 'Добавить фото'
		});
		$( '.-submit' ).animate({
			top: '+=40px'
		},'fast');
	});

	$('.trade-in-form .form-expand a').each(function(e) {

		var blockId = $(this).attr("href");

		$(blockId).hide();

		$(this).click(function(e) {
			e.preventDefault();

			$(this).parents('.form-row').hide();
			$(blockId).show();
		});
	});

	$('.item a.item-box').on('click', function() {
		return false;
	});

	var clearError = function() {
		$(this).removeClass('error');

		$('.-result-text').fadeOut('fast', function() {
			$(this).empty();
		});
	};

	$('.-trade-in-form')
		.on('click', '.-input-field', function() {
			clearError.call( this );
		})
		.find('.-accept.jq-checkbox').on('click', function() {
			clearError.call( this );
		});

	$('.-trade-in-form').on('submit', function(evt) {
		var errorMsgs   = ['Не заполнены необходимые поля'],
			$form       = $(this),
			$firstName  = $form.find('.-name'),
			$lastName   = $form.find('.-last_name'),
			$complect   = $form.find('.-complect'),
			$accept     = $form.find('.-accept'),
			$email      = $form.find('.-email'),
			$phone      = $form.find('.-phone'),
			$model      = $form.find('.-model'),
			$year       = $form.find('.-year'),
			errorFlag   = false,
			setError    = function(field, isError) {
				if (isError) {
					errorFlag = true;
					field.addClass('error');
				} else {
					field.removeClass('error');
				}
			},
			addError    = function(errMsg) {
				if (!errorFlag) {
					errorFlag = true;
					errorMsgs.length = 0; // clear arr
				}

				errorMsgs.push(errMsg);
			};

		// check accept agreement chbox
		setError( $accept, !$accept.is(':checked') );

		// check first name field
		setError( $firstName, !$firstName.val().length );

		// check last name field
		setError( $lastName, !$lastName.val().length );

		// check email field value
		setError( $email, !$email.val().length );

		// check phone field value
		setError( $phone, !$phone.val().length );

		// check model field value
		setError( $model, !$model.val().length );

		// check year field value
		setError( $year, !$year.val().length );

		// check complect field value
		setError( $complect, !$complect.val().length );

		// check email format
		if (!/^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i.test( $email.val() )) {
			addError('Поле "E-mail" заполнено неверно');
		}

		// check phone format
		if (!/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test( $phone.val() )) {
			addError('Поле "Телефон" заполнено неверно');
		}

		// check year
		if (!/^[0-9]{4}$/.test( $year.val() )) {
			addError('Поле "Год выпуска" заполнено неверно')
		}

		if (errorFlag) {
			$('.-result-text').fadeIn('fast', function() {
				$(this).html( errorMsgs.join('<br>') );
			});
		} else {
			$('.form-submit button[type=submit]').prop('disabled', true);
			$('.preloader').css('visibility', 'visible');
			
			var formObj  = $(this),
				formURL  = formObj.attr('action'),
				formData = new FormData( this ),
				sessid   = BX.bitrix_sessid();
			
			formData.append('sessid', sessid);
			
			var	request  = $.ajax({
				url         : formURL,
				type        : 'POST',
				data        : formData,
				processData : false,
			 	contentType : false
			});

			request.done(function(msg) {
				$('.-result-text').fadeIn('fast', function() {
					$(this).html('Заявка успешно отправлена.<br>Наши менеджеры свяжутся с Вами позже.');
				});

				$('.-trade-in-form').get(0).reset();
				$('.-files-holder').children().not(':first').remove();
				$('.-submit').css('top', '');
				$('.-files-holder input[type=file]').trigger('refresh');
				$('.-accept').removeClass('checked');

				setTimeout(function() {
					$('.-result-text').fadeOut('slow', function() {
						$('.-result-text').empty();
					});
				}, 3000);
			});

			request.fail(function() {
				alert(textStatus);
			});

			request.always(function() {
				$('.form-submit button[type="submit"]').removeAttr('disabled');
				$('.column-submit .preloader').css('visibility','hidden');
			});
		}
		evt.preventDefault();
	});

});