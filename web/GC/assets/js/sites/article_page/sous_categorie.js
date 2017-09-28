$(document).ready(function() {
	sous_categorie.init();
});

sous_categorie = {};

var current_id;

sous_categorie.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$.getJSON(BASE_URL + "sous_categorie/get/", sous_categorie.initCallBack);
}
sous_categorie.initCallBack = function(json) {
	var sous_categories = json.sous_categorie;
	var tbody = "";
	i = 0;
	$.each(sous_categories,
					function(i, elt) {
						check="";
						tbody += "<tr id='tr_"+elt.idsous_categorie+"'><td>" + (++i) + "</td>";
						tbody += "<td>" + elt.alias_categorie + "</td>";
						tbody += "<td>" + elt.nom_sous_categorie + "</td>";
						tbody += "<td>" + elt.alias_sous_categorie + "</td>";
						if (json.idgroup == 1){
							tbody += '<td class="td-actions">';
							tbody += '<a href="#ancre" onclick="sous_categorie.edit('
									+ elt.idsous_categorie
									+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
							tbody += '<a href="javascript: sous_categorie.remove('
									+ elt.idsous_categorie
									+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
							tbody += '</td></tr>';
						}
					});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
}
sous_categorie.edit = function(id) {
	current_id = id;
	$("#sous_categorie-spinner").show();
	$.getJSON(BASE_URL + "sous_categorie/get/" + id, sous_categorie.editCallBack);
};

sous_categorie.editCallBack = function(json) {
	var elt = json.sous_categorie;
	$("#idsous_categorie").val(elt.idsous_categorie);
	$("#categorie_idcategorie").val(elt.categorie_idcategorie);
	$("#nom_sous_categorie").val(elt.nom_sous_categorie).focus();
	$("#alias_sous_categorie").val(elt.alias_sous_categorie);
};

sous_categorie.remove = function(id) {
	if (!confirm("Voulez vous vraiment supprimer cette sous_categorie ?"))
		return;
	$("#loading-table").show();	
	$.getJSON(BASE_URL + "sous_categorie/delete/" + id, sous_categorie.supprCallBack);
};

sous_categorie.save = function() {
	if ($("#nom_sous_categorie").val()){
		$.postJSON(BASE_URL + "sous_categorie/save/", {
			"idsous_categorie" : $("#idsous_categorie").val(),
			"categorie_idcategorie" : $("#categorie_idcategorie").val(),
			"nom_sous_categorie" : $("#nom_sous_categorie").val(),
			"alias_sous_categorie" : $("#alias_sous_categorie").val()
		}, sous_categorie.saveCallBack);
	}
}
sous_categorie.saveCallBack = function(json) {
	var success = json.success;
	if(success){ 
		sous_categorie.init();	
		sous_categorie.cancel();
	}
	else alert("Sous categorie déjà existant");
}

sous_categorie.cancel = function(){
	reset_form();
	$("#idsous_categorie").val("null");
	$("#categorie_idcategorie").val("");
};
sous_categorie.supprCallBack = function(json) {
	var success = json.success;
	$("#tr_" + json.idsous_categorie).remove();
	$("#loading-table").hide();
}