$(function() {
	$("#menu_" + active).addClass("active");
	$.localScroll();
});
$.postJSON = function(url, data, callback) {
	$.post(url, data, callback, "json");
};
$.fn.enterKey = function(fnc) {
	return this.each(function() {
		$(this).keypress(function(ev) {
			var keycode = (ev.keyCode ? ev.keyCode : ev.which);
			if (keycode == '13') {
				fnc.call(this, ev);
			}
		})
	})
};
find = {};

// GESTION RECHERCHE
$("#form-search").submit(function() {
	if ($("#s").val())
	$.postJSON(BASE_URL + "/find/", {
		"param" : $("#param").val(),
		"controller" : $("#controller").val(),
		"s" : $("#s").val()
	}, find.CallBack);
	return false;
});

find.CallBack = function(json) {
	if (!json.count) {
		alert("Aucun résultat pour votre recherche!");
		return;
	}
	$("#title_search").html("Résultat du recherche dans " + json.controller);
	$("#title_table_search").html("Motif : " + json.query);
	var thead = "<td></td><tr>";
	$.each(json.fields, function(j, field) {
		if (field.indexOf("id") == -1)
		if (field.indexOf("body") == -1)	
		thead += "<th>" + field+ "</th>";
	});
	thead +="<th></th></tr>";
	var tbody = "";
	i = 0;
	$.each(json.results, function(i, elt) {
		tbody += "<tr>";
		$.each(json.fields, function(j, field) {
			if (field.indexOf("id") == -1)
			if (field.indexOf("body") == -1)
			tbody += "<td>" + elt[field]+ "</td>";
			j++;
		});
		id = elt[json.fields[0]];
		if (json.idgroup == 1) {
			tbody += '<td class="td-actions">';
			tbody += '<a href="#ancre" onclick="'+json.controller+'.edit('
					+ id
					+ ')" class="btn btn-small btn-warning" id="btn-edit"><i class="btn-icon-only icon-pencil"></i> </a>';
			tbody += '<a href="javascript: '+json.controller+'.remove('
					+ id
					+ ')" class="btn btn-small" id="btn-suppr"> <i class="btn-icon-only icon-remove"></i></a>';
			tbody += '</td></tr>';
		}
	});
	$("#table-search thead").html("").append(thead);
	$("#table-search tbody").html("").append(tbody);
	$("#search-dialog").modal();
	$("#btn-suppr, #btn-edit").click(function(){
		$("#search-dialog").modal("hide");
	});
};
function dateMysql2Fr(date) {
	date = date.split(" ")[0];
	date = date.split("-");
	return date[2] + "/" + date[1] + "/" + date[0];
}
function dateFr2Mysql(date) {
	date = date.split(" ")[0];
	date = date.split("/");
	return date[2] + "-" + date[1] + "-" + date[0];
}
function dateUTC(date) {
	// Date.UTC(1970, 9, 9)
	date = date.split(" ")[0];
	date = date.split("-");
	return "Date.UTC(" + date[0] + "," + date[1] + "," + date[2] + ")";
}
function now() {
	var date = new Date();
	var month = date.getMonth() + 1;
	return date.getFullYear() + "-" + month + "-" + date.getDate() + " "
			+ date.getHours() + ":" + date.getMinutes() + ":"
			+ date.getSeconds();
}

function reset_form() {
	$("input[type=text], input[type=hidden], textarea").val("");
}
function tab_qualite(i) {
	var tab = new Array("", "Bonne", "Moyenne", "Faible");
	return tab[i];
}