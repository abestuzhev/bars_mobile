(function (w, $) {

    w.bapp = w.bapp || {};

    w.bapp.initCreditForm = function () {

        $('.-buy-credit-form').myForm({
            init: function (options) {

                // this refers to form
                var $form = $(this);
                // stylize form elements
                $form.find('select,input[type=checkbox],input[type=radio]').styler();
                // set phone mask
                $form.find('.-phone').inputmask('+7(999) 999-99-99');
                // clear error on field-click
                $form.find('input,.-accept').on('click', function () {
                    $(this).removeClass('error');
                });
            },
            validateForm: function (options) {
                // this refers to form
                var errorMsgs = [],
                        $form = $(this),
                        errorFlag = false,
                        setError = function (msg) {
                            if (!errorFlag) {
                                errorMsgs.push('Не заполнены необходимые поля');
                                // set not-filled error flag
                                errorFlag = true;
                            }
                        },
                        $formFields = $form.find('.-required'),
                        $accept = $form.find('.-accept'),
                        emailPattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i,
                        phonePattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

                // clear all errors
                $form.find('.error').removeClass('error');

                // iterate fields
                $formFields.each(function () {

                    var $field = $(this),
                            fName = this.name,
                            fValue = $.trim(this.value);

                    // check if empty req fields
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

                // check agree
                if (!$accept.is(':checked')) {
                    errorMsgs.push('Не подтверждено согласие на обработку персональных данных');
                    $accept.closest('.jq-checkbox').addClass('error');
                }

                // check errors
                if (errorFlag || $form.find('.error').length) {
                    $('.-result-text').show().html(errorMsgs.join('<br>'));
                    return false; // validation failed
                }

                return true;
            },
            getMoreData: function () {
                return {
                    sessid: BX.bitrix_sessid()
                };
            },
            afterResponse: function (response) {
                // clear form && hide
                if (response.result != 'N') {
                    this.reset();
                    $('#alfa-content').html(response.alfaData);
                    setTimeout(function () {
                        BX.submit(BX('alfa-form'));
                        $.fancybox.close();
                    }, 5000);
                }
                else {
                    setTimeout(function () {
                        $('.-result-text.result-text').html(response.err);
                    }, 1);
                    //this.messages.error = response.err;
                }
            },
            messages: {
                success: /*'Заявка успешно отправлена.<br>Наши менеджеры свяжутся с Вами позже.'*/ 'Вы будете перенаправлены на страницу банка через <b>5</b> секунд',
                error: 'Не удалось отправить заявку.<br>Повторите попытку позже.'
            },
            controls: {
                ajaxloader: '.-ajax-loader',
                messagesBox: '.-result-text',
                submit: '.-submit'
            }
        });

    };


})(window, jQuery);
