$(document).ready(function() {
	page.init();
	$("#check_all").click(function(){
		check = $(this).attr("checked");
		if (check) $(".check_line").attr("checked",true);
		else $(".check_line").attr("checked",false);
	});
});

page = {};

var current_id;
var current_page = 1;

page.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	cond = "";
	var key = "limit";
	var val = 1;
	if (where!="") {
		key = where[0];
		val = where[1];
	}
	$.postJSON(BASE_URL + "page/get_all/",{
			"key": key,
			"val": val
		}, page.initCallBack);
}
page.initCallBack = function(json) {
	var pages = json.page;
	var total_page = json.total_page;
	var tbody = "";
	i = 0;
	$.each(pages,
					function(i, elt) {
						check="";
						if (json.idgroup == 1) disabled = "";
						else disabled ='disabled = ""';
						if (elt.is_publish == 1) check="checked";
						tbody += "<tr id='tr_"+elt.idpage+"' title='ID PAGE : "+elt.idpage+"'><td style='width: 13px'><input type='checkbox' value='"+elt.idpage+"' class='check_line'></td>";
						tbody += "<td>" + elt.title + "</td>";
						tbody += "<td>" + elt.alias + "</td>";
						tbody += "<td>" + elt.username + "</td>";
						tbody += "<td>" + elt.alias_categorie + "</td>";
						tbody += "<td>" + dateMysql2Fr(elt.date_write) + "</td>";
						tbody += '<td><div class="toggle-button" title="Publi&eacute; le '+dateMysql2Fr(elt.date_publish)+'"><input type="checkbox" '+check+' '+disabled+' onchange="page.publish(this,'+elt.idpage+')"></div></td>';
						tbody += '<td class="td-actions">';
						style = "";
						if (elt.is_publish == 1) style = "display : none";
						if (json.idgroup == 1) style = "";
						tbody += '<a href="#ancre" style="'+style+'" onclick="page.edit('
								+ elt.idpage
								+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
						tbody += '<a href="javascript: page.remove('
								+ elt.idpage
								+ ')" style="'+style+'" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
						
						tbody += '</td></tr>';
					});
	/**PAGINATION **/
	pagination = '<ul id="pagination_ul">';
	pagination +='<li class="li_numpage disabled" id="li_0"><a href="javascript: page.page(current_page - 1 )">Prec.</a></li>';
	for (i=1; i<=total_page;i++){
		pagination+='<li class="li_numpage" id="li_'+i+'"><a href="javascript: page.page('+i+')">'+i+'</a></li>';
	}
	pagination +='<li class="li_numpage" id="li_'+(total_page+1)+'"><a href="javascript: page.page(current_page +1 )">Suiv.</a></li>';
	pagination += '</ul>';
	$(".pagination").html("").append(pagination);
	$(".li_numpage").removeClass("disabled");
	if (current_page == 1) $("#pagination_ul > li:eq(0)").addClass("disabled");
	if (current_page == total_page) $("#pagination_ul > li:eq("+(current_page+1)+")").addClass("disabled");
	$("#pagination_ul > li:eq("+current_page+")").addClass("disabled");
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter(
			{ headers: {
         			0: { 
         				// disable it by setting the property sorter to false 
         					sorter: false 
         			}
	}});
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
};

page.page = function(num_page,exception){
	if ($("#li_"+num_page).hasClass("disabled") && !exception ) return;
	$("#loading-table").show();
	$("#main-table tbody").html("");
	current_page = num_page;
	$.postJSON(BASE_URL + "page/get_all/",{
		"key" : "limit",
		"val": num_page
		},
		page.initCallBack);
};

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

page.action = function(elt) {
	if((elt=="delete")&& !confirm("voulez vous vraiment supprimer ces pages?") )return;
	var ids= new Array();
	$.each($(".check_line"), function() {
		if ($(this).attr("checked")) ids.push($(this).val());
	});
	$.postJSON(BASE_URL + "page/action/", {
		"ids": ids,
		"action": elt
	}, page.actionCallBack);
};
page.actionCallBack = function(json){
	page.page(current_page,"exception");
	$("#check_all").attr("checked",false);
};

page.remove = function(id) {
	if (!confirm("Voulez vous vraiment supprimer cette page ?"))
		return;
	$("#loading-table").show();	
	$.getJSON(BASE_URL + "page/delete/" + id, page.supprCallBack);
};
page.supprCallBack = function(json) {
	var success = json.success;
	$("#tr_" + json.idpage).remove();
	$("#loading-table").hide();
}
