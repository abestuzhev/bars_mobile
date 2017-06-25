$(document).ready(function() {
	$('.-phone').inputmask('+7(999)999-99-99');
	$(".open-popup").fancybox( {
		padding: 0,
		beforeShow: function() {
			this.inner.parents(".fancybox-wrap").addClass("spares-popup-fancy");
			$(".-result-text").html('');
		}
	});

$('.spares-table').on('click', '.-spares-order-button', function(e) {
	e.preventDefault();
	$('.-spares-form')[0].reset();
	var data      = $(this).data(),
		title     = data.name,
		$form     = $('.-spares-form'),
		node      = $('.-spares-title').val(),
		quantity  = $(this).siblings().find('input').val();

	if (data.name.length) {
		$form.find('.-spare-input').val(data.name);
		$form.find('.-spare-node').val(node);
		$form.find('.-spare-artnumber').val(data.art);

		$form.find('.-quantity-input').val(quantity);
		$form.find('.-quantity').text(quantity);
		$form.find('.-spare-text').text(title);
		$.fancybox($('.-spares-popup'));
		$('.-spares-popup').parents('.fancybox-skin').addClass('fancy-popup');
	}
});

$(".-spares-form").on('submit', function(evt) {
	evt.preventDefault();
	var $phone    = $('.-phone'),
		$email    = $('.-email'),
		phoneVal  = $.trim( $phone.val() ),
		emailVal  = $.trim( $email.val() ),
		showMessage = function(msg) {
			$('.-spares-result')
				.text( msg )
				.css('visibility', 'visible');
		},
		hideMessage = function() {
			$('.-spares-result')
				.text( '' )
				.css('visibility', 'hidden');
		},
		offEvent = function() {
			$(this).off('.err');
			hideMessage();
		};

	// 1) both not filled
	// 2) one filled incorrectly
	// 3) both filled incorrectly

	if (!phoneVal && !emailVal) {
		$email.focus().add( $phone ).on('click.err', offEvent);
		showMessage('Необходимо заполнить e-mail или телефон');
		return false;
	};

	if (emailVal && !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i.test(emailVal) ) {
		$email.focus().on('click.err', offEvent);
		showMessage('Проверьте правильность заполнения полей');
		return false;
	}
	if (phoneVal && (phoneVal.length < 4 || !/^[\d\(\) \-\+]+$/.test(phoneVal)) ) {
		$phone.focus().on('click.err', offEvent);
		showMessage('Проверьте правильность заполнения полей');
		return false;
	}

	$.fancybox.showLoading();
	// disable `submit` button
	$('.-order-spare-popup')
		.find('.spares-order-button')
		.prop('disabled', true);

	var $form    = $(this),
		formURL  = $form.prop('action'),
		formData = new FormData(this);

	formData.append('sessid', window.BX.message['bitrix_sessid']);

	var req = $.ajax({
		url         : formURL,
		type        : 'POST',
		data        : formData,
		contentType : false,
		processData : false
	}).done(function(msg) {
		showMessage('Заявка успешно отправлена');

		setTimeout(function(){
			hideMessage();
			$.fancybox.close();
			// clear field values
			$('.-email').val('');
			$('.-phone').val('');
			// enable button
			$('.-order-spare-popup')
				.find('.spares-order-button')
				.prop('disabled', false);
		}, 2000);

	}).fail(function( jqXHR, textStatus ) {
		alert(textStatus);
	}).always(function() {
		$.fancybox.hideLoading();
	});
});

});