$(document).ready(function() {
	
});

user = {};

user.cancel = function() {
	history.go(-1);
};

user.save = function() {
	var erreur="";
	
	if ($("#password").val() != $("#password-confirm").val()) {
		erreur = "Les mots de passe ne correpondent pas!";
	}
	else if (!$("#login").val() || !$("#numtel").val() || !$("#code_district").val()){
		erreur = "Vérifier bien le formulaire";
	}
	else if (erreur=="") 
		$.postJSON(BASE_URL + "user/profile_save/", {
			"iduser" : $("#iduser").val(),
			"login" : $("#login").val(),
			"password" : $("#password").val(),
			"confirm-password" : $("#confirm-password").val(),
			"username" : $("#username").val(),
			"numtel" : $("#numtel").val(),
			"email" : $("#email").val(),
			"code_district" : $("#code_district").val()
		}, user.saveCallBack);
	if (erreur) {
		$("#alert p").html(erreur);
		$("#alert").show();
		$("#alert").focus();
	}
};
user.saveCallBack = function(json) {
	if (json.user.success) document.location = BASE_URL + "/auth/logout";
};