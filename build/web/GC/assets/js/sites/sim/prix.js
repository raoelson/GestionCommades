$(document).ready(function() {
	if ($("#date_prix").val() == "" ) $("#date_prix").datepicker( ).val(dateMysql2Fr(now()));
	prix.init();
	$("#date_prix").change(function(){
		prix.init();
	});
	$("#controller").val("prix");
});

prix = {};

var current_id;
var produits;

prix.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$("#main-table thead").html("");
	date = dateFr2Mysql($("#date_prix").val());
	$.postJSON(BASE_URL + "sim/prix/get_all/", {"date":date, "prod": prod}, prix.initCallBack);
};
prix.initCallBack = function(json) {
	var tbody = json.tbody;
	produits = json.produits;
	var thead = '<tr><th>#</th>';
	thead +='<th>Date</th>';
	thead +='<th>District</th>';
	
	$.each(produits, function(i,elt){
		thead +='<th>'+elt.nom_produit+'</th>';
	});
	thead +='<th class="td-actions"></th>';
	thead +='</tr>';				
	$("#main-table thead").append(thead);
	$("#main-table tbody").append(tbody);
	$("#h3-title").html("").append("Prix des produits du "+dateMysql2Fr(json.date_debut)+" au "+dateMysql2Fr(json.date_fin));
	$("#main-table").tablesorter();
	$('.toggle-button').toggleButtons();
	$("#loading-table").hide();
};


prix.edit = function(nom_district,date) {
	$("#prix-spinner").show();
	$.postJSON(BASE_URL + "sim/prix/get/",{"date": date,"nom_district":nom_district}, prix.editCallBack);
};

prix.editCallBack = function(json) {
	var prix = json.prix;
	$.each(prix,function(i,elt){
		$("#prix_"+elt.idproduit).val(elt.prix_conso);
		$("#date").val(dateMysql2Fr(elt.date));
		$("#district_iddistrict").val(elt.iddistrict);
	});
	$("#main-form").show();
};
prix.cancel = function() {
	$("#main-form").hide();
}
prix.add = function() {
	$("#action").val("null");
	$("#date").val($("#date_prix").val());
	$("#code_prix").val("");
	$("#district_iddistrict").val("");
	$.each(produits, function(i,elt){
		$("#prix_"+elt.idproduit).val("");
	});
	$("#main-form").show();
}
prix.remove = function(id) {
	current_id = id;
	if (!confirm("Voulez vous vraiment supprimer cette ligne ?"))
		return;
	$("#prix-spinner").show();
	$.getJSON(BASE_URL + "sim/prix/delete/" + id, prix.supprCallBack);
};
prix.supprCallBack = function(json) {
	$("#tr_" + json.idprix).remove();
	$("#prix-spinner").hide();
}
prix.save = function() {
	erreur ="";
	idproduits = new Array();
	prices = new Array();
	$(".prix").each(function(){
		id = $(this).attr('id').split("prix_");
		idproduits.push(id[1]);
		prices.push($(this).val());
	});
		$.postJSON(BASE_URL + "sim/prix/save/", {
			"date" : dateFr2Mysql($("#date").val()),
			"code_district" : $("#code_district").val(),
			"idproduits" : idproduits,
			"prices": prices
		}, prix.saveCallBack);
}
prix.saveCallBack = function(json) {
	var elt = json.prix;
	if (elt.success)
		prix.init();
	setTimeout(function() {
		$("#prix-spinner").hide();
	}, 100);
	prix.cancel();
}
prix.cancel = function(){
	$("#idprix").val("null");
	$("#nom_prix").val("");
	$("#code_prix").val("");
	$("#main-form").hide();
}