$(document).ready(function() {
	suscriber.init();
});

suscriber = {};

var current_id;

suscriber.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$.getJSON(BASE_URL + "suscriber/get/", suscriber.initCallBack);
}
suscriber.initCallBack = function(json) {
	var suscribers = json.suscriber;
	var tbody = "";
	i = 0;
	$.each(suscribers,
					function(i, elt) {
						check="";
						if (elt.is_active == 1) check="checked";
						tbody += "<tr><td>" + elt.idsuscriber + "</td>";
						tbody += "<td>" + elt.suscribername + "</td>";
						tbody += "<td>" + elt.numtel + "</td>";
						tbody += "<td>" + dateMysql2Fr(elt.date_inscription) + "</td>";
						tbody += '<td><div class="toggle-button"><input type="checkbox" '+check+' onchange="suscriber.activate(this,'+elt.idsuscriber+')"></div></td>';
					});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
}

suscriber.activate = function(obj,idsuscriber){
	if (obj.checked) is_active = 1;
	else is_active = 0;
	$.postJSON(BASE_URL + "suscriber/save/", {
		"idsuscriber" : idsuscriber,
		"is_active" : is_active
	});
}
