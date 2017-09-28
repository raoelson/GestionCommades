$(document).ready(function() {
	district.getByRegion(1);
});

district = {};

var current_id;
var current_region;


district.getByRegion = function(idregion){
	$("#secondary-table tbody").html("");
	current_region = idregion;
	$.getJSON(BASE_URL + "district/getByRegion/"+idregion, district.initCallBack);
}
district.initCallBack = function(json){
	var districts = json.district;
	console.log(json.idgroup);
	var tbody = "";
 	$.each(districts,function(i,elt){
		val = ++i;
		tbody +="<tr id='key"+elt.iddistrict+"'><td>"+val+"</td><td>"+elt.nom_district+"</td><td>"+elt.nom_region+"</td><td style='text-align: right'>"+elt.code_district+"</td>"; 
		tbody +='<td class="td-actions">';
		if (json.idgroup == 1){
		tbody +='<a href="#ancre2" onclick="district.edit('+elt.iddistrict+')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>&nbsp;';
		tbody +='<a href="javascript: district.remove('+elt.iddistrict+');" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
		}
		tbody +='</td></tr>';
	});
	$("#secondary-table tbody").append(tbody);
	$("#secondary-table").tablesorter();
	$("#loading-table2").hide();
	$("#region_idregion").val(current_region);
}
district.edit = function(id) {
	current_id = id;
	$("#district-spinner").show();
	$.getJSON(BASE_URL + "district/get/" + id, district.editCallBack);
};

district.editCallBack = function(json) {
	var elt = json.district;
	$("#iddistrict").val(elt.iddistrict);
	$("#nom_district").val(elt.nom_district).focus();
	$("#code_district").val(elt.code_district);
	$("#region_idregion").val(elt.region_idregion);
	$("#lat").val(elt.lat);
	$("#long").val(elt.long);
	$("#btn-district-ok").html("Enregistrer");
	setTimeout(function() { 	$("#district-spinner").hide();  }, 100);
};
district.cancel = function(){
	$("#iddistrict").val("null");
	$("#nom_district").val("");
	$("#code_district").val("");
	$("#region_idregion").val("");
	$("#lat").val("");
	$("#long").val("");
	$("#btn-ok").html("Ajouter");
}
district.remove = function(id) {
	current_id = id;
	if (!confirm("Voulez vous vraiment supprimer cette ligne ?"))
		return;
	$.getJSON(BASE_URL + "district/delete/" + id, district.supprCallBack);
};
district.supprCallBack = function(json) {
	var success = json.success;
	$("#key" + success).remove();
}
district.save = function() {
	if ($("#region_idregion").val()){
		$("#district-spinner").show();
		$.postJSON(BASE_URL + "district/save/", {
			"region_idregion": $("#region_idregion").val(),
			"nom_district" : $("#nom_district").val(),
			"iddistrict" : $("#iddistrict").val(),
			"code_district" : $("#code_district").val(),
			"lat": $("#lat").val(),
			"long": $("#long").val()
		}, district.saveCallBack);
	}
}
district.saveCallBack = function(json) {
	var elt = json.district;
	console.log(elt.success);
	if(elt.code_district) district.getByRegion(elt.region_idregion);
	setTimeout(function() { 	$("#district-spinner").hide();  }, 100);
	district.cancel();
}