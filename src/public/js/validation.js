$(function(){

	$.validator.addMethod('strongPassword', function(value,element){
		return this.optional(element) 
	    || value.length >= 6
	    && /\d/.test(value)
	    && /[a-z]/i.test(value);
	}, 'Your password must be at least 6 charachters long and contain at least one number\'.')
	$("#register-form").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			name: {
				required: true,
			},
			password: {
				required: true,
				strongPassword: true
			},
			password_conf: {
				required: true,
				equalTo : '#password'
			}
		},
		messages: {
			email: {
				required: 'Please enter an email address',
				email: 'Please enter a <em>valid</em> email address'
			},
			password_conf: {
				required: 'Please configure your password',
				equalTo : 'Please enter the same password'
			},
			name: {
				required: 'Please enter your name address',
			},
			password: {
				required: 'Please enter a password'
			}
		}
	})
})
function remoteValidate(typedIn){
	console.log("called")
	$.post('/validation',{typedIn: typedIn}, function(data,status){
		/*$('#hello').text(message)*/
		$(".validation").text(data)
	    $(".validation").show();
	})
}

$("#email1").click(function(){
	$(".validation").hide()
})