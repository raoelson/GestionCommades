$(document).ready(function() {
	article.init();
});

article = {};

var current_id;

article.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	cond = "";
	if (where!="") cond+=where[0]+"/"+where[1];
	$.getJSON(BASE_URL + "article/getWhere/"+cond, article.initCallBack);
}
article.initCallBack = function(json) {
	var articles = json.article;
	console.log(articles);
	var tbody = "";
	i = 0;
	$.each(articles,
					function(i, elt) {
						check="";
						if (elt.is_publish == 1) check="checked";
						tbody += "<tr id='tr_"+elt.idarticle+"'><td>" + (++i) + "</td>";
						tbody += "<td>" + elt.title + "</td>";
						tbody += "<td>" + elt.username + "</td>";
						tbody += "<td>" + elt.alias_categorie + "</td>";
						tbody += "<td>" + elt.keywords + "</td>";
						tbody += "<td>" + dateMysql2Fr(elt.date_write) + "</td>";
						tbody += '<td><div class="toggle-button" title="Publi&eacute; le '+dateMysql2Fr(elt.date_publish)+'"><input type="checkbox" '+check+' onchange="article.publish(this,'+elt.idarticle+')"></div></td>';
						tbody += '<td class="td-actions">';
						tbody += '<a href="#ancre" onclick="article.edit('
								+ elt.idarticle
								+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
						tbody += '<a href="javascript: article.remove('
								+ elt.idarticle
								+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
						tbody += '</td></tr>';
					});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
}

article.publish = function(obj,idarticle){
	if (obj.checked) is_publish = 1;
	else is_publish = 0;
	$.postJSON(BASE_URL + "article/save/", {
		"idarticle" : idarticle,
		"is_publish" : is_publish,
		"date_publish": now()
	});
}
article.edit = function(id){
	document.location = BASE_URL + "article/edit/"+id;
};
article.remove = function(id) {
	if (!confirm("Voulez vous vraiment supprimer cet article ?"))
		return;
	$("#loading-table").show();	
	$.getJSON(BASE_URL + "article/delete/" + id, article.supprCallBack);
};
article.supprCallBack = function(json) {
	var success = json.success;
	$("#tr_" + json.idarticle).remove();
	$("#loading-table").hide();
}