$(document).ready(function() {
	produit.init();
	$("#nom_produit").focus();
	$("#controller").val("produit");
});
produit = {};

var current_id;

produit.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$.getJSON(BASE_URL + "sim/produit/get_all/", produit.initCallBack);
}
produit.initCallBack = function(json) {
	var produits = json.produit;
	var tbody = "";
	i = 0;
	$.each(produits,
					function(i, elt) {
						check="";
						if (elt.is_active == 1) check="checked";
						tbody += "<tr id='tr_"+elt.idproduit+"'><td>" + elt.idproduit + "</td>";
						tbody += "<td>" + elt.nom_produit + "</td>";
						tbody += "<td>" + elt.nom_categorie + "</td>";
						tbody += "<td>" + elt.code_produit + "</td>";
						tbody += "<td>" + elt.unite + "</td>";
						if (json.idgroup == 1) {
							tbody += '<td class="td-actions">';
							tbody += '<a href="#ancre" onclick="produit.edit('
									+ elt.idproduit
									+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
							tbody += '<a href="javascript: produit.remove('
									+ elt.idproduit
									+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
							tbody += '</td></tr>';
						}
					});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
}


produit.edit = function(id) {
	current_id = id;
	$("#produit-spinner").show();
	$.getJSON(BASE_URL + "sim/produit/get/" + id, produit.editCallBack);
};

produit.editCallBack = function(json) {
	var produit = json.produit;
	$("#idproduit").val(produit.idproduit);
	$("#nom_produit").val(produit.nom_produit);
	$("#categorie_idcategorie").val(produit.categorie_idcategorie);
	$("#code_produit").val(produit.code_produit);
	$("#unite").val(produit.unite);
	$("#main-form").show();
	$("#produit-spinner").hide();
};
produit.cancel = function() {
	$("#main-form").hide();
}
produit.add = function() {
	$("#idproduit").val("null");
	$("#nom_produit").val("");
	$("#code_produit").val("");
	$("#unite").val("");
	$("#main-form").show();
	$("#login").focus();
}
produit.remove = function(id) {
	current_id = id;
	if (!confirm("Voulez vous vraiment supprimer cette ligne ?"))
		return;
	$("#produit-spinner").show();
	$.getJSON(BASE_URL + "sim/produit/delete/" + id, produit.supprCallBack);
};
produit.supprCallBack = function(json) {
	$("#tr_" + json.idproduit).remove();
	$("#produit-spinner").hide();
}
produit.save = function() {
	erreur ="";
	if ($("#nom_produit").val() && $("#code_produit").val())
		$.postJSON(BASE_URL + "sim/produit/save/", {
			"idproduit" : $("#idproduit").val(),
			"categorie_idcategorie" : $("#categorie_idcategorie").val(),
			"nom_produit" : $("#nom_produit").val(),
			"code_produit" : $("#code_produit").val(),
			"unite" : $("#unite").val()
			
		}, produit.saveCallBack);
	else erreur = "Vérifier le formulaire";
	if (erreur) {
		$("#alert p").html(erreur);
		$("#alert").show();
	}
}
produit.saveCallBack = function(json) {
	var elt = json.produit;
	if (elt.success)
		produit.init();
	setTimeout(function() {
		$("#produit-spinner").hide();
	}, 100);
	produit.cancel();
}
produit.cancel = function(){
	$("#idproduit").val("null");
	$("#nom_produit").val("");
	$("#code_produit").val("");
	//$("#main-form").hide();
}