$(document).ready(function() {
	region.init();
});

region = {};

var current_id;

region.init = function(){
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$("#region_idregion").html("");
	$.getJSON(BASE_URL + "region/get/", region.initCallBack);
}
region.initCallBack = function(json){
	var regions = json.region;
	var tbody = "";
	var options = "<option></option>";
	i=0;
 	$.each(regions,function(i,elt){
 		options +="<option value='"+elt.idregion+"'>"+elt.nom_region.toUpperCase()+"</option>";
		tbody +="<tr><td>"+(++i)+"</td><td>"+elt.nom_region+"</td><td style='text-align: right'>"+elt.code_region+"</td>"; 
		tbody +='<td class="td-actions"><a href="javascript: district.getByRegion('+elt.idregion+')" title="Districts associés" class="btn btn-small"><i class="btn-icon-only icon-sitemap"></i></a> ';
		if (json.idgroup == 1){
		tbody +='<a href="#ancre" onclick="region.edit('+elt.idregion+')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
		tbody +='<a href="javascript: " class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
		}
		tbody +='</td></tr>';
		i++;
	});
	$("#main-table tbody").append(tbody);
	$("#main-table").tablesorter();
	$("#region_idregion").append(options);
	$("#loading-table").hide();
}
region.edit = function(id) {
	current_id = id;
	$("#region-spinner").show();
	$.getJSON(BASE_URL + "region/get/" + id, region.editCallBack);
};

region.editCallBack = function(json) {
	var elt = json.region;
	$("#idregion").val(elt.idregion);
	$("#nom_region").val(elt.nom_region).focus();
	$("#code_region").val(elt.code_region);
	$("#btn-ok").html("Enreg.");
	setTimeout(function() { 	$("#region-spinner").hide();  }, 100);
};
region.cancel = function(){
	$("#idregion").val("null");
	$("#nom_region").val("");
	$("#code_region").val("");
	$("#btn-ok").html("Ajouter");
}
region.remove = function(id) {
	current_id = id;
	if (!confirm("Voulez vous vraiment supprimer cette ligne ?"))
		return;
	$.getJSON(BASE_URL + "region/delete/" + id, region.supprCallBack);
};
region.supprCallBack = function(json) {
	var success = json.success;
	$("#key" + success).remove();
}
region.save = function() {
	if ($("#nom_region").val()){
		$("#region-spinner").show();
		$.postJSON(BASE_URL + "region/save/", {
			"idregion" : $("#idregion").val(),
			"nom_region" : $("#nom_region").val(),
			"code_region" : $("#code_region").val()
		}, region.saveCallBack);
	}
}
region.saveCallBack = function(json) {
	var success = json.success;
	if(success) region.init();
	setTimeout(function() { 	$("#region-spinner").hide();  }, 100);
	region.cancel();
}