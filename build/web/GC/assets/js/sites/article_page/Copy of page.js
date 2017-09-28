$(document).ready(function() {
	page.init();
});

page = {};

var current_id;

page.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	cond = "";
	if (where!="") cond+=where[0]+"/"+where[1];
	$.getJSON(BASE_URL + "page/getWhere/"+cond, page.initCallBack);
}
page.initCallBack = function(json) {
	var pages = json.page;
	console.log(pages);
	var tbody = "";
	i = 0;
	$.each(pages,
					function(i, elt) {
						check="";
						if (elt.is_publish == 1) check="checked";
						tbody += "<tr id='tr_"+elt.idpage+"'><td>" + (++i) + "</td>";
						tbody += "<td>" + elt.title + "</td>";
						tbody += "<td>" + elt.username + "</td>";
						tbody += "<td>" + elt.alias_categorie + "</td>";
						tbody += "<td>" + elt.keywords + "</td>";
						tbody += "<td>" + dateMysql2Fr(elt.date_write) + "</td>";
						tbody += '<td><div class="toggle-button" title="Publi&eacute; le '+dateMysql2Fr(elt.date_publish)+'"><input type="checkbox" '+check+' onchange="page.publish(this,'+elt.idpage+')"></div></td>';
						tbody += '<td class="td-actions">';
						tbody += '<a href="#ancre" onclick="page.edit('
								+ elt.idpage
								+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
						tbody += '<a href="javascript: page.remove('
								+ elt.idpage
								+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
						tbody += '</td></tr>';
					});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
}

page.publish = function(obj,idpage){
	if (obj.checked) is_publish = 1;
	else is_publish = 0;
	$.postJSON(BASE_URL + "page/save/", {
		"idpage" : idpage,
		"is_publish" : is_publish,
		"date_publish": now()
	});
}
page.edit = function(id){
	document.location = BASE_URL + "page/edit/"+id;
};
page.remove = function(id) {
	if (!confirm("Voulez vous vraiment supprimer cet page ?"))
		return;
	$("#loading-table").show();	
	$.getJSON(BASE_URL + "page/delete/" + id, page.supprCallBack);
};
page.supprCallBack = function(json) {
	var success = json.success;
	$("#tr_" + json.idpage).remove();
	$("#loading-table").hide();
}