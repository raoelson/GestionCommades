$(document).ready(function() {
	keyword.init();
});

keyword = {};

var current_id;

keyword.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$("#keyowrd_idkeyword").html("");
	$.getJSON(BASE_URL + "keywords/get/", keyword.initCallBack);
};

keyword.initCallBack = function(json) {
	var keywords = json.keywords;
	var tbody ="";
	var options = "<option></option>";
	i = 0;
	$.each(keywords, function (i, elt){
		options +="<option value='"+elt.idkeyword+"'>"+elt.keyword.toUpperCase()+"</option>";
		tbody +="<tr><td>"+(++i)+"</td><td>"+elt.keyword+"</td><td>"+elt.keyword_description+"</td>"; 
		tbody +='<td class="td-actions"> <a href="javascript: keyword.edit('+elt.idkeyword+')" class="btn btn-small btn-warning">';
		tbody +='<i class="btn-icon-only icon-pencil"></i> </a> <a href="javascript: group.getByKeyword('+elt.idkeyword+')" title="Groups associés" class="btn btn-small"> ';
		tbody +='<i class="btn-icon-only icon-sitemap"></i></a> <a href="javascript: keyword.remove('+elt.idkeyword+')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i>';
		tbody +='</a></td></tr>';
		i++;
	});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	$("#keyword_idkeyword").append(options);
	$("#loading-table").hide();
};
keyword.edit = function(id) {
	current_id = id;
	$("#keyword_spinner").show();
	$.getJSON(BASE_URL + "keywords/get/" + id, keyword.editCallBack);
};

keyword.editCallBack = function(json) {
	var elt = json.keywords;
	$("#idkeyword").val(elt.idkeyword);
	$("#keyword").val(elt.keyword);
	$("#keyword_description").val(elt.keyword_description);
	$("#btn-ok").html("Enrg.");
	setTimeout(function() {
		$("#keyword-spinner").hide();
	}, 100);
};
keyword.cancel = function() {
	$("#idkeyword").val("null");
	$("#keyword").val("");
	$("#keyword_description").val("");
	$("#btn-ok").html("Ajouter");
};
keyword.remove = function(id) {
	if(!confirm("Voullez vous vraiment supprimer cette ligne ?"))
		return;
	document.location.href = BASE_URL + "keywords/remove/" + id;
};
keyword.save = function() {
	if ($("#keyword").val()){
		$("#keyword-spinner").show();
		$.postJSON(BASE_URL + "keywords/save/", {
			"idkeyword" : $("#idkeyword").val(),
			"keyword" : $("#keyword").val(),
			"keyword_description" : $("#keyword_description").val()
		}, keyword.saveCallBack);
	}
};
keyword.saveCallBack = function(json) {
	var success = json.success;
	if(success) keyword.init();
	setTimeout(function() {    $("#keyword-spinner").hide();    }, 100);
	keyword.cancel();
};