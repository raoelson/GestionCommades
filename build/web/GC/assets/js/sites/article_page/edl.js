$(document).ready(function() {
	$('textarea').tinymce({
		// Location of TinyMCE script
		script_url : LIB_JS + 'tiny_mce/tiny_mce.js',
		language : "fr",
		// General options
		theme : "advanced",
		plugins : "table,advimage",
		// Theme options
		theme_advanced_buttons1 : "bold,italic,underline,undo,redo,justifyleft,justifycenter,justifyright,justifyfull,tablecontrols,image,code",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,
		// Example content CSS (should be your site CSS)
		content_css : LIB_JS +"tiny_mce/css/content.css",
		height: "200"
	});
	if (idedl){
		 edl.init(idedl); 
	}
});

edl = {};

var current_id;

edl.get = function(){
	$("#loading").show();
	$("textarea, input[text]").val("");
	if ($("#annee").val() && $("#edl_code_district").val())
	$.postJSON(BASE_URL + "edl/get/", 
		{
			"annee": $("#annee").val(),
			"edl_code_district":$("#edl_code_district").val()
		}, 
	edl.getCallBack);
	else alert("Seletionner l'année et le district concerné !");
};

edl.getCallBack = function(json) {
	var elt = json.edl;
	if (!elt.idedl) alert("Aucun EDL disponible pour cette année dans ce district");
	$("#contexte").val(elt.contexte),
	$("#situation_geo").val(elt.situation_geo),
	$("#donnees_aep").val(elt.donnees_aep),
	$("#filieres_prioritaires").val(elt.filieres_prioritaires),
	$("#strategie_service").val(elt.strategie_service),
	$("#edl_code_district").val(elt.edl_code_district),
	$("#annee").val(elt.annee);
	$("#filieres_prioritaires").val(elt.filieres_prioritaires);
	$("#loading").hide();
};
edl.cancel = function() {
	document.location = BASE_URL + "edl";
};

edl.save = function() {
	annee = $("#annee").val();
	edl_code_district = $("#edl_code_district").val();
	if (annee && edl_code_district) {
		$.postJSON(BASE_URL + "edl/save/", {
			"contexte" : $("#contexte").val(),
			"situation_geo" : $("#situation_geo").val(),
			"donnees_aep" : $("#donnees_aep").val(),
			"filieres_prioritaires" : $("#filieres_prioritaires").val(),
			"strategie_service" : $("#strategie_service").val(),
			"edl_code_district": $("#edl_code_district").val(),
			"annee":$("#annee").val()
		}, edl.saveCallBack);
		return true;
	}
	else {
		alert("Vérifier le formulaire");
		return false;	
	}
};
edl.saveCallBack = function(json) {
	var elt = json.edl;
	//console.log(elt);
	if (elt.success) {
		$("#btn-cancel").html("Terminer");
		$("#idedl").val(elt.idedl);
		$("#message").addClass("alert-info").show().fadeOut(2000);
	}
};
edl.remove = function(){
	if ($("#annee").val() && $("#edl_code_district").val() && confirm("Voulez-vous vraiment supprimer cet EDL?")){
		$("#loading").show();
		$("textarea, input[text]").val("");
		$.postJSON(BASE_URL + "edl/delete/", {"annee": $("#annee").val(),"edl_code_district":$("#edl_code_district").val()}, edl.getCallBack);
	};
}