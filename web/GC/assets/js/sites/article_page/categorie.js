$(document).ready(function() {
	categorie.init();
});

categorie = {};

var current_id;

categorie.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$.getJSON(BASE_URL + "categorie/get/", categorie.initCallBack);
}
categorie.initCallBack = function(json) {
	var categories = json.categorie;
	var tbody = "";
	i = 0;
	$.each(categories,
					function(i, elt) {
						check="";
						tbody += "<tr id='tr_"+elt.idcategorie+"'><td>" + (++i) + "</td>";
						tbody += "<td>" + elt.nom_categorie + "</td>";
						tbody += "<td>" + elt.alias_categorie + "</td>";
						if (json.idgroup == 1){
							tbody += '<td class="td-actions">';
							tbody += '<a href="#ancre" onclick="categorie.edit('
									+ elt.idcategorie
									+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
							tbody += '<a href="javascript: categorie.remove('
									+ elt.idcategorie
									+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
							tbody += '</td></tr>';
						}
					});
	if (json.idgroup == 1){
		tbody+='<tr style="vertical-align: bottom">';
		tbody+='<td><input type="hidden" id="idcategorie" value="null"></td>';
		tbody+='<td><input type="text" style="width: 80%;margin-bottom: -4px;" id="nom_categorie" name="nom_categorie"></td>';
		tbody+='<td><input type="text" style="width: 80%;margin-bottom: -4px;" id="alias_categorie" name="alias_categorie"></td>';
		tbody += '<td class="td-actions">';
		tbody += '<a href="javascript: categorie.save()" class="btn btn-small btn-warning"> <i class="btn-icon-only icon-save"></i></a>';
		tbody += '<a href="javascript: categorie.cancel()" class="btn btn-small"> <i class="btn-icon-only icon-off"></i></a>';
		tbody += '</td></tr>';
	}
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
}
categorie.edit = function(id) {
	current_id = id;
	$("#categorie-spinner").show();
	$.getJSON(BASE_URL + "categorie/get/" + id, categorie.editCallBack);
};

categorie.editCallBack = function(json) {
	var elt = json.categorie;
	$("#idcategorie").val(elt.idcategorie);
	$("#nom_categorie").val(elt.nom_categorie).focus();
	$("#alias_categorie").val(elt.alias_categorie);
};

categorie.remove = function(id) {
	if (!confirm("Voulez vous vraiment supprimer cette categorie ?"))
		return;
	$("#loading-table").show();	
	$.getJSON(BASE_URL + "categorie/delete/" + id, categorie.supprCallBack);
};

categorie.save = function() {
	if ($("#nom_categorie").val()){
		$.postJSON(BASE_URL + "categorie/save/", {
			"idcategorie" : $("#idcategorie").val(),
			"nom_categorie" : $("#nom_categorie").val(),
			"alias_categorie" : $("#alias_categorie").val()
		}, categorie.saveCallBack);
	}
}
categorie.saveCallBack = function(json) {
	var success = json.success;
	if(success) categorie.init();
	categorie.cancel();
}

categorie.cancel = function(){
	reset_form();
	$("#idcategorie").val("null");
};
categorie.supprCallBack = function(json) {
	var success = json.success;
	$("#tr_" + json.idcategorie).remove();
	$("#loading-table").hide();
}