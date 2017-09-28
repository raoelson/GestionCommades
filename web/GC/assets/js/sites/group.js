$(document).ready(function() {
	group.init();
});

group = {};

var current_id;
var current_keyword;

group.init = function(){
	$("#loading-table2").show();
	$.getJSON(BASE_URL + "group/get/", group.initCallBack);
};
group.getByKeyword = function(idkeyword){
	$("#secondary-table tbody").html("");
	current_keyword = idkeyword;
	$.getJSON(BASE_URL + "group/getByKeyword/"+idkeyword, group.initCallBack);
	$("#keyword_idkeyword").val(idkeyword);
};
group.initCallBack = function(json){
	var groups = json.group;
	var tbody = "";
 	$.each(groups,function(i,elt){
		val = ++i;
		tbody +="<tr><td>"+val+"</td><td>"+elt.groupname+"</td><td>"+elt.keyword+"</td><td>"+elt.description+"</td>"; 
		tbody +='<td class="td-actions">';
		tbody +='<a href="javascript: group.edit('+elt.idgroup+')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>&nbsp;';
		tbody +='<a href="javascript: group.remove(' +elt.idgroup+')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
		tbody +='</td></tr>';
	});
 	$("#secondary-table tbody").html("");
	$("#secondary-table tbody").append(tbody);
	$("#secondary-table").tablesorter();
	$("#loading-table2").hide();
};
group.edit = function(id) {
	current_id = id;
	$("#group-spinner").show();
	$.getJSON(BASE_URL + "group/get/" + id, group.editCallBack);
};

group.editCallBack = function(json) {
	var elt = json.group;
	$("#idgroup").val(elt.idgroup);
	$("#groupname").val(elt.groupname).focus();
	$("#description").val(elt.description);
	$("#keyword_idkeyword").val(elt.keyword_idkeyword);
	$("#btn-group-ok").html("Enregistrer");
	setTimeout(function() { 	$("#group-spinner").hide();  }, 100);
};
group.cancel = function(){
	$("#idgroup").val("null");
	$("#groupname").val("");
	$("#description").val("");
	$("#keyword_idkeyword").val("");
	$("#btn-ok").html("Ajouter");
};
group.remove = function(id) {
	if(!confirm("Voullez vous vraiment supprimer cette ligne ?")) return;
	document.location.href = BASE_URL + "group/remove/" + id;
};
group.save = function() {
	if ($("#keyword_idkeyword").val()){
		$("#group-spinner").show();
		$.postJSON(BASE_URL + "group/save/", {
			"idgroup" : $("#idgroup").val(),
			"keyword_idkeyword": $("#keyword_idkeyword").val(),
			"groupname" : $("#groupname").val(),
			"description" : $("#description").val()
		}, group.saveCallBack);
	}
};
group.saveCallBack = function(json) {
	var success = json.success;
	if(success) group.init();
	setTimeout(function() { 	
		$("#group-spinner").hide();  
	}, 100);
	group.cancel();
};