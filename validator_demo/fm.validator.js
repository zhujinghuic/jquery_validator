/*
 	data-required:必须输入
 	data-min:至少输入多少个字符(0-9)
 	data-max:不能超过多少个字符(0-9)
 	data-type：限制输入的类型（email,url,number,digits,phonenumber）
 	data-error-position：错误消息显示的位置（before,after）
 	
 	详细：http://www.jq22.com/jquery-info743
 */
Validator = {
	elementErrorClass: 'error_message',//错误消息的样式
	errorFontSize: 3,//错误消息的字样大小
	showErrorType: 'dialog',//错误消息的实现方式  'info' : 样式式错误   'dialog' : 弹窗式错误  
	language: 'cn',
	languages: {
		'cn': {
			textbox: {
				required: '输入不能为空',
				min: '至少需要 {characters} 个字符以上',
				max: '不能多于 {characters} 个字符',
				email: '邮箱验证不通过',
				url: '不是url地址',
				number: '内容只能是数字',
				digits: '内容只能是数字',
				phonenumber: '手机号码格式不正确'
			},
			password: {
				required: '密码不能为空',
				min: '至少需要 {characters} 个字符以上',
				max: '不能多于 {characters} 个字符',
				match: '密码不匹配'
			},
			radio: {
			},
			checkbox: {
				required: '必须选中单选框'
			},
			select: {
				required: '必须选择一项'
			},
			textarea: {
				required: '输入不能为空',
				min: '至少需要 {characters} 个字符以上',
				max: '不能多于 {characters} 个字符',
				url: '不是url地址'
			}
		}
	}, 
	showError: function (element, text) {
		if (!$(element).hasClass(Validator.elementErrorClass)) {
			var error = document.createElement('div');
			if($(error).hasClass('validator-error')){
				$(error).text("");
			}else{
				$(error).addClass('validator-error').html("<font color='red' size='" + Validator.errorFontSize +"'>" + text + "</font>");
			}
			if ($(element).attr('data-error-position') == undefined) {
				var errorPosition = 'before';
				if ($(this).is('input') && $(this).attr('type') == 'checkbox') {
					 errorPosition = 'before label';
				}
			} else {
				errorPosition = $(element).attr('data-error-position');
			}
			var attrValue = errorPosition.split(' ');
			var targetElementForError;
			if (attrValue[1] == undefined) {
				targetElementForError = element;
			} else {
				targetElementForError = $(element).closest(attrValue[1])[0];
			}
			if (attrValue[0] == 'before') {
				$(targetElementForError).before(error);
			} else if (attrValue[0] == 'after') {
				$(targetElementForError).after(error);
			}
			$(targetElementForError).addClass(Validator.elementErrorClass);
				
			if ($(element).attr('data-match') != undefined) {
				$('#' + $(element).attr('data-match')).addClass(Validator.elementErrorClass);
			}
		}
	},
	validate_data: function (form) {
		var hasErrors = false;
		if(Validator.showErrorType == 'info'){
			var firstErrorElement = null;
			
			Validator.removeErrors(form);
			
			$(form).find('input, select, textarea').each(function () {
				var regex = null;
				// Input[type=text]
				if ($(this).is('input') && ($(this).attr('type') == 'text' || $(this).attr('type') == undefined)) {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined && !hasErrors) {
						Validator.showError(this, Validator.languages[Validator.language].textbox.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined && $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined && $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value')))) {
						Validator.showError(this, Validator.languages[Validator.language].textbox.required);
						hasErrors = true;
					}
					// min
					if ($(this).attr('data-min') != undefined && $(this).val().length < parseFloat($(this).attr('data-min')) && $(this).val().length != 0) {
						Validator.showError(this, Validator.languages[Validator.language].textbox.min.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// max
					if ($(this).attr('data-max') != undefined && $(this).val().length > parseFloat($(this).attr('data-max'))) {
						Validator.showError(this, Validator.languages[Validator.language].textbox.max.replace('{characters}', $(this).attr('data-max')));
						hasErrors = true;
					}

					// patterns
					if ($(this).attr('data-type') != undefined) {
						switch ($(this).attr('data-type')) {
							case 'email':
								regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
								if (!regex.test($(this).val()) && $(this).val() != '') {
									Validator.showError(this, Validator.languages[Validator.language].textbox.email);
									hasErrors = true;
								}
								break;
							case 'url':
								regex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_{},.~+=-]*)?(\#[-a-z\d_]*)?$/i;
								if (!regex.test($(this).val().replace('_', '')) && $(this).val() != '') {
									Validator.showError(this, Validator.languages[Validator.language].textbox.url);
									hasErrors = true;
								}
								break;
							case 'number':
								regex = /^\s*(\+|-)?((\d+([\.,]\d+)?)|([\.,]\d+))\s*$/;
								if (!regex.test($(this).val()) && $(this).val() != '') {
									Validator.showError(this, Validator.languages[Validator.language].textbox.number);
									hasErrors = true;
								}
								break;
							case 'digits':
								regex = /^\s*\d+\s*$/;
								if (!regex.test($(this).val()) && $(this).val() != '') {
									Validator.showError(this, Validator.languages[Validator.language].textbox.digits);
									hasErrors = true;
								}
								break;
							case 'phonenumber':
								regex = /^1[0-9]{10}$/;
								if (!regex.test($(this).val()) && $(this).val() != '') {
									Validator.showError(this, Validator.languages[Validator.language].textbox.phonenumber);
									hasErrors = true;
								}
								break;
						}
					}
				}

				// Input[type=password]
				if ($(this).is('input') && $(this).attr('type') == 'password') {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined) {
						Validator.showError(this, Validator.languages[Validator.language].password.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined && $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined && $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value')))) {
						Validator.showError(this, Validator.languages[Validator.language].password.required);
						hasErrors = true;
					}
					// min
					if ($(this).attr('data-min') != undefined && $(this).val().length < parseFloat($(this).attr('data-min')) && $(this).val().length != 0) {
						Validator.showError(this, Validator.languages[Validator.language].password.min.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// max
					if ($(this).attr('data-max') != undefined && $(this).val().length > parseFloat($(this).attr('data-max'))) {
						Validator.showError(this, Validator.languages[Validator.language].password.max.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// match
					if ($(this).attr('data-match') != undefined && $(this).val() != $('#' + $(this).attr('data-match')).val()) {
						Validator.showError(this, Validator.languages[Validator.language].password.match);
						hasErrors = true;
					}
				}

				// Input[type=radio]
				if ($(this).is('input') && $(this).attr('type') == 'radio') {
				//	var length = $("input[type='radio']").is(':checked').length;
					var isCheck  = $("input[type='radio']:checked").val();
					if ($(this).attr('data-required') != undefined && isCheck ==undefined && $(this).attr('data-required-if') == undefined) {
						Validator.showError(this, Validator.languages[Validator.language].checkbox.required);
						hasErrors = true;
					}
				}

				// Input[type=checkbox]
				if ($(this).is('input') && $(this).attr('type') == 'checkbox') {
					// required
					if ($(this).attr('data-required') != undefined && !$(this).is(':checked') && $(this).attr('data-required-if') == undefined) {
						Validator.showError(this, Validator.languages[Validator.language].checkbox.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined && $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined && $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value')))) {
						Validator.showError(this, Validator.languages[Validator.language].checkbox.required);
						hasErrors = true;
					}
				}

				// Select
				if ($(this).is('select')) {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined) {
						Validator.showError(this, Validator.languages[Validator.language].select.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined && $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined && $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value')))) {
						Validator.showError(this, Validator.languages[Validator.language].select.required);
						hasErrors = true;
					}

				}

				// Textarea
				if ($(this).is('textarea')) {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined) {
						Validator.showError(this, Validator.languages[Validator.language].textarea.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined && $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined && $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value')))) {
						Validator.showError(this, Validator.languages[Validator.language].textarea.required);
						hasErrors = true;
					}
					// min
					if ($(this).attr('data-min') != undefined && $(this).val().length < parseFloat($(this).attr('data-min')) && $(this).val().length != 0) {
						Validator.showError(this, Validator.languages[Validator.language].textarea.min.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// max
					if ($(this).attr('data-max') != undefined && $(this).val().length > parseFloat($(this).attr('data-max'))) {
						Validator.showError(this, Validator.languages[Validator.language].textarea.max.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// patterns
					if ($(this).attr('data-type') != undefined) {
						switch ($(this).attr('data-type')) {
							case 'url':
								regex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_{},.~+=-]*)?(\#[-a-z\d_]*)?$/i;
								if (!regex.test($(this).val()) && $(this).val() != '') {
									Validator.showError(this, Validator.languages[Validator.language].textarea.url);
									hasErrors = true;
								}
								break;
						}
					}
				}

				// Focus first element with error
				if (hasErrors && firstErrorElement == null) {
					firstErrorElement = this;
					$(this).focus();
				}
			});
		}else if(Validator.showErrorType == 'dialog'){
			$(form).find('input, select, textarea').each(function () {
				var regex = null;
				// Input[type=text]
				if ($(this).is('input') && ($(this).attr('type') == 'text' || $(this).attr('type') == undefined)) {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined && !hasErrors) {
						alert(Validator.languages[Validator.language].textbox.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' 
						&& (($(this).attr('data-required-if-value') == undefined 
								&& $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined 
										&& $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value'))) && !hasErrors) {
						alert(Validator.languages[Validator.language].textbox.required);
						hasErrors = true;
					}
					// min
					if ($(this).attr('data-min') != undefined 
							&& $(this).val().length < parseFloat($(this).attr('data-min')) && $(this).val().length != 0 && !hasErrors) {
						alert(Validator.languages[Validator.language].textbox.min.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// max
					if ($(this).attr('data-max') != undefined && $(this).val().length > parseFloat($(this).attr('data-max')) && !hasErrors) {
						alert(Validator.languages[Validator.language].textbox.max.replace('{characters}', $(this).attr('data-max')));
						hasErrors = true;
					}

					// patterns
					if ($(this).attr('data-type') != undefined) {
						switch ($(this).attr('data-type')) {
							case 'email':
								regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
								if (!regex.test($(this).val()) && $(this).val() != '' && !hasErrors) {
									alert(Validator.languages[Validator.language].textbox.email);
									hasErrors = true;
								}
								break;
							case 'url':
								regex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_{},.~+=-]*)?(\#[-a-z\d_]*)?$/i;
								if (!regex.test($(this).val().replace('_', '')) && $(this).val() != '' && !hasErrors) {
									alert(Validator.languages[Validator.language].textbox.url);
									hasErrors = true;
								}
								break;
							case 'number':
								regex = /^\s*(\+|-)?((\d+([\.,]\d+)?)|([\.,]\d+))\s*$/;
								if (!regex.test($(this).val()) && $(this).val() != '' && !hasErrors) {
									alert(Validator.languages[Validator.language].textbox.number);
									hasErrors = true;
								}
								break;
							case 'digits':
								regex = /^\s*\d+\s*$/;
								if (!regex.test($(this).val()) && $(this).val() != '' && !hasErrors) {
									alert(Validator.languages[Validator.language].textbox.digits);
									hasErrors = true;
								}
								break;
							case 'phonenumber':
								regex = /^1[0-9]{10}$/;
								if (!regex.test($(this).val()) && $(this).val() != '' && !hasErrors) {
									alert(Validator.languages[Validator.language].textbox.phonenumber);
									hasErrors = true;
								}
								break;
						}
					}
				}

				// Input[type=password]
				if ($(this).is('input') && $(this).attr('type') == 'password') {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined && !hasErrors) {
						alert(Validator.languages[Validator.language].password.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined 
							&& $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined 
									&& $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value'))) && !hasErrors) {
						alert(Validator.languages[Validator.language].password.required);
						hasErrors = true;
					}
					// min
					if ($(this).attr('data-min') != undefined && $(this).val().length < parseFloat($(this).attr('data-min')) 
							&& $(this).val().length != 0 && !hasErrors) {
						alert(Validator.languages[Validator.language].password.min.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// max
					if ($(this).attr('data-max') != undefined && $(this).val().length > parseFloat($(this).attr('data-max')) && !hasErrors) {
						alert(Validator.languages[Validator.language].password.max.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// match
					if ($(this).attr('data-match') != undefined && $(this).val() != $('#' + $(this).attr('data-match')).val() && !hasErrors) {
						alert(Validator.languages[Validator.language].password.match);
						hasErrors = true;
					}
				}

				// Input[type=radio]
				if ($(this).is('input') && $(this).attr('type') == 'radio') {
				//	var length = $("input[type='radio']").is(':checked').length;
					var isCheck  = $("input[type='radio']:checked").val();
					if ($(this).attr('data-required') != undefined && isCheck ==undefined 
							&& $(this).attr('data-required-if') == undefined && !hasErrors) {
						alert(Validator.languages[Validator.language].checkbox.required);
						hasErrors = true;
					}
				}

				// Input[type=checkbox]
				if ($(this).is('input') && $(this).attr('type') == 'checkbox') {
					// required
					if ($(this).attr('data-required') != undefined 
							&& !$(this).is(':checked') && $(this).attr('data-required-if') == undefined && !hasErrors) {
						alert(Validator.languages[Validator.language].checkbox.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' 
						&& (($(this).attr('data-required-if-value') == undefined 
								&& $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined 
										&& $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value'))) && !hasErrors) {
						alert(Validator.languages[Validator.language].checkbox.required);
						hasErrors = true;
					}
				}

				// Select
				if ($(this).is('select')) {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined && !hasErrors) {
						alert(Validator.languages[Validator.language].select.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined 
							&& $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined 
									&& $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value'))) && !hasErrors) {
						alert(Validator.languages[Validator.language].select.required);
						hasErrors = true;
					}

				}

				// Textarea
				if ($(this).is('textarea')) {
					// required
					if ($(this).attr('data-required') != undefined && $(this).val() == '' && $(this).attr('data-required-if') == undefined && !hasErrors) {
						alert(Validator.languages[Validator.language].textarea.required);
						hasErrors = true;
					}
					// required-if & required-if-value
					if ($(this).attr('data-required-if') != undefined && $(this).val() == '' && (($(this).attr('data-required-if-value') == undefined 
							&& $('#' + $(this).attr('data-required-if')).is(':checked')) || ($(this).attr('data-required-if-value') != undefined 
									&& $('#' + $(this).attr('data-required-if')).val() == $(this).attr('data-required-if-value'))) && !hasErrors) {
						alert(Validator.languages[Validator.language].textarea.required);
						hasErrors = true;
					}
					// min
					if ($(this).attr('data-min') != undefined 
							&& $(this).val().length < parseFloat($(this).attr('data-min')) && $(this).val().length != 0 && !hasErrors) {
						alert(Validator.languages[Validator.language].textarea.min.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// max
					if ($(this).attr('data-max') != undefined && $(this).val().length > parseFloat($(this).attr('data-max')) && !hasErrors) {
						alert(Validator.languages[Validator.language].textarea.max.replace('{characters}', $(this).attr('data-min')));
						hasErrors = true;
					}
					// patterns
					if ($(this).attr('data-type') != undefined) {
						switch ($(this).attr('data-type')) {
							case 'url':
								regex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_{},.~+=-]*)?(\#[-a-z\d_]*)?$/i;
								if (!regex.test($(this).val()) && $(this).val() != '' && !hasErrors) {
									alert( Validator.languages[Validator.language].textarea.url);
									hasErrors = true;
								}
								break;
						}
					}
				}

				// Focus first element with error
				if (hasErrors && firstErrorElement == null) {
					firstErrorElement = this;
					$(this).focus();
				}
			});
		}
		return !hasErrors;
	},
	removeErrors: function (form) {
		// Remove all error text divs
		$(form).find('.validator-error').each(function () {
			$(this).remove();
		});
		$(form).find('.' + Validator.elementErrorClass).each(function () {
			$(this).removeClass(Validator.elementErrorClass);
		});

		// Reset error classes
		$(form).find('input[type=text], input[type=password], input[type=radio], input[type=checkbox], select, textarea').each(function () {
			if ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
				$(this).closest('label').removeClass(Validator.elementErrorClass);
			} else {
				$(this).removeClass(Validator.elementErrorClass);
			}
		});

	}
};

function customValidateMessage(form){
	Validator.removeErrors(form);
}

$(function () {
//	$('form').each(function () {
//		$(this).submit(function () {
//			return Validator.validate_data(this);
//		});
//	});
});