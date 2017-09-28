$(document).ready(function() {
	route.init();
	$("#item").focus();
});

route = {};

var current_id;

route.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$.getJSON(BASE_URL + "options/route/get_all/", route.initCallBack);
}
route.initCallBack = function(json) {
	var routes = json.route;
	var tbody = "";
	i = 0;
	$
			.each(
					routes,
					function(i, elt) {
						check = "";
						if (elt.is_active == 1)
							check = "checked";
						tbody += "<tr id='tr_" + elt.idroute + "'>";
						tbody += "<td>" + elt.url_src + "</td>";
						tbody += "<td>" + elt.url_dst + "</td>";
						tbody += '<td class="td-actions">';
						tbody += '<a href="#ancre" onclick="route.edit('
								+ elt.idroute
								+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
						tbody += '<a href="javascript: route.remove('
								+ elt.idroute
								+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
						tbody += '</td></tr>';

					});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	$('.toggle-button').toggleButtons();
	$("#loading-table").hide();
	$("#url_src").focus();
}

route.edit = function(id) {
	current_id = id;
	$("#route-spinner").show();
	$.getJSON(BASE_URL + "options/route/get/" + id, route.editCallBack);
};

route.editCallBack = function(json) {
	var route = json.route;
	$("#idroute").val(route.idroute);
	$("#url_src").val(route.url_src);
	$("#url_dst").val(route.url_dst);
	$("#main-form").show();
	$("#route-spinner").hide();
};
route.cancel = function() {
	$("#main-form").hide();
};
route.add = function() {
	$("#idroute").val("null");
	$("#url_dst").val("");
	$("#url_src").val("");
};
route.rewrite = function(){
	if (confirm("Voulez-vous vraiment réecrire le routage?")) 
	document.location = BASE_URL +"options/route/rewrite/";
};
route.remove = function(id) {
	current_id = id;
	if (!confirm("Voulez vous vraiment supprimer cette ligne ?"))
		return;
	$("#route-spinner").show();
	$.getJSON(BASE_URL + "options/route/delete/" + id, route.supprCallBack);
};
route.supprCallBack = function(json) {
	$("#tr_" + json.idroute).remove();
	$("#route-spinner").hide();
};
route.save = function() {
	erreur = "";
	if ($("#url_src").val() && $("#url_dst").val())
		$.postJSON(BASE_URL + "options/route/save/", {
			"idroute" : $("#idroute").val(),
			"url_src" : $("#url_src").val(),
			"url_dst" : $("#url_dst").val()
		}, route.saveCallBack);
	else
		erreur = "Vérifier le formulaire";
	if (erreur) {
		$("#alert p").html(erreur);
		$("#alert").show();
	}
};
route.saveCallBack = function(json) {
	var elt = json.route;
	if (elt.success)
		route.init();
	setTimeout(function() {
		$("#route-spinner").hide();
	}, 100);
	route.cancel();
};
route.cancel = function() {
	$("#idroute").val("null");
	$("#url_src").val("");
	$("#url_dst").val("");
	// $("#main-form").hide();
};