$ (document).ready(function() {
	if ($("#date_prix").val() == "") $("#date_prix").datepicker( ).val(dateMysql2Fr(now()));
	offre_demande.init();
	$("#check_all").click(function(){
		check = $(this).attr("checked");
		if (check) $(".check_line").attr("checked",true);
		else $(".check_line").attr("checked",false);
	});
});

offre_demande = {};

var current_id;
var current_page = 1;

offre_demande.init = function(){
	$("#loading-table").show();
	$("#main-table tbody").html("");
	var key = "limit";
	var val = 1;
	$.postJSON(BASE_URL + "sim/offre_demande/get_all/",{
			"key": key,
			"val": val
		}, offre_demande.initCallBack);
	$("#main-table").tablesorter(
			{ headers: {
         			0: { 
         				// disable it by setting the property sorter to false 
         					sorter: false 
         			}
	}});
};

offre_demande.initCallBack = function(json) {
	var offre_demandes = json.offre_demande;
	total_page = json.total_page;
	var tbody = "";	
	i = 0;
	$.each(offre_demandes, function(i, elt) {
		check="";
		tbody += "<tr id='tr_"+elt.idoffre_demande+"'><td style='width: 13px'><input type='checkbox' value='"+elt.idoffre_demande+"' class='check_line'></td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.date+"'>" + dateMysql2Fr(elt.date) + "</td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title=' Code district: "+elt.code_district+"'>" + elt.nom_district + "</td>";
		tbody += "<td><a href='#'>" + elt.nom_produit + "</td>";
		tbody += "<td><a href='#'>" + elt.qte+" ["+elt.unite+"]"+ "</td>";
		tbody += "<td><a href='#'>" + elt.prix + "</td>";
		tbody += "<td><a href='#'>" + tab_qualite(elt.qualite) + "</td>";
		tbody += "<td>" + elt.text + "</td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.numtel+"'>" + elt.numtel + "</td>";
		tbody += "<td>" + elt.type + "</td>";
		if (json.idgroup == 1){
			tbody += '<td class="td-actions">';
				tbody += '<a href="javascript: offre_demande.remove('
				+ elt.idoffre_demande
				+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
			tbody += '</td></tr>';
		}
	});
	
	/** PAGINATION * */
	if (total_page) {
		pagination = '<div class="control-group">';
		pagination+='<label for="pagination_select">Page :</label><div class="control"><select id="pagination_select" class="span1" onchange="offre_demande.page($(this).val())">';
		for (i = 1; i <= total_page; i++) {
			pagination += '<option value="'+i+'">'+i+'</li>';
		}
		pagination += '</select></div></div>';
		$(".pagination").html("").append(pagination);
		$("#pagination_select").val(current_page);
	};
	
	
	$("#main-table tbody").append(tbody);
	$("#main-table").trigger("update");
	$('.toggle-button').toggleButtons();
	$("#loading-table").hide();
	$("#offre_demande-spinner").hide();
	$(".tool").tooltip();
};

offre_demande.page = function(num_page,exception){
	if ($("#li_"+num_page).hasClass("disabled") && !exception ) return;
	$("#loading-table").show();
	$("#main-table tbody").html("");
	current_page = num_page;
	$.postJSON(BASE_URL + "sim/offre_demande/get_all/",{
		"key" : "limit",
		"val": num_page
		},
		offre_demande.initCallBack);
};

offre_demande.action = function(elt) {
	if((elt=="delete")&& !confirm("voulez vous vraiment supprimer?") )return;
	var ids= new Array();
	$.each($(".check_line"), function() {
		if ($(this).attr("checked")) ids.push($(this).val());
	});
	$.postJSON(BASE_URL + "offre_demande/action/", {
		"ids": ids,
		"action": elt
	}, offre_demande.actionCallBack);
};
offre_demande.actionCallBack = function(json){
	offre_demande.page(current_page,"exception");
	$("#check_all").attr("checked",false);
};

offre_demande.edit = function(id) {
	current_id = id;
	$("#offre_demande-spinner").show();
	$.getJSON(BASE_URL + "offre_demande/get" + id, offre_demande.editCallBack);
};

offre_demande.editCallBack = function(json) {
	var elt = json.offre_demande;
	$("#id").val(elt.id);
	$("#number").val(elt.number);
	$("#smsdate").val(elt.smsdate);
	$("#insertdate").val(elt.insertdate);
	$("#text").val(elt.text);
	$("#phone").val(elt.phone);
	$("#processed").val(elt.processed);
	setTimeout(function() {    $("#offre_demande-spinner").hide();   },100);
};

offre_demande.cancel = function() {
	$("#id").val("null");
	$("#number").val("");
	$("#smsdate").val("");
	$("#insertdate").val("");
	$("#text").val("");
	$("#phone").val("");
	$("#processed").val("");
	$("#btn-ok").html("Ajouter");
};
offre_demande.remove = function(id) {
	if(!confirm("Voullez vous vraiment supprimer cette ligne ?")) return;
	document.location.href = BASE_URL + "offre_demande/remove/" + id;
};

offre_demande.save = function() {
	if ($("#number").val()){
		$("#offre_demande-spinner").show();
		$.postJSON(BASE_URL + "offre_demande/save/", {
			"id" : $("#id").val(),
			"number" : $("#number").val(),
			"smsdate" : $("#smsdate").val(),
			"insertdate" : $("#insertdate").val(),
			"text" : $("#text").val(),
			"phone" : $("#phone").val(),
			"processed" : $("#processed").val()
		}, offre_demande.saveCallBack);
	}
};

offre_demande.saveCallBack = function(json) {
	offre_demande.init();
	offre_demande.cancel();
};
