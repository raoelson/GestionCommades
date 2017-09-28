$ (document).ready(function() {
	if ($("#date_actu").val() == "" ) $("#date_actu").datepicker( ).val(dateMysql2Fr(now()));
	actualite.init();
	
	$("#date_actu").change(function(){
		actualite.init();
	});
	
	$("#check_all").click(function(){
		check = $(this).attr("checked");
		if (check) $(".check_line").attr("checked",true);
		else $(".check_line").attr("checked",false);
	});
});

actualite = {};

var current_id;
var current_page = 1;

actualite.init = function(){
	$("#loading-table").show();
	$("#main-table tbody").html("");
	date = dateFr2Mysql($("#date_actu").val());
	var key = "limit";
	var val = 1;
	$.postJSON(BASE_URL + "actualite/get_all/",{
			"key": key,
			"val": val,
			"date": date
		}, actualite.initCallBack);
	
	$("#pagination_ul > li:eq(1)").addClass("disabled");
	$("#main-table").tablesorter(
			{ headers: {
         			0: { 
         				// disable it by setting the property sorter to false 
         					sorter: false 
         			}
	}});
};

actualite.initCallBack = function(json) {
	var actualites = json.actualite;
	total_page = json.total_page;
	var tbody = "";
	console.log(actualites);
	i = 0;
	$.each(actualites, function(i, elt) {
		check="";
		tbody += "<tr id='tr_"+elt.idactu+"'><td style='width: 13px'><input type='checkbox' value='"+elt.idactu+"' class='check_line'></td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.numtel+"'>" + elt.username + "</a></td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.code_district+"'>" + elt.nom_district + "</td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.date_actu+"'>" + dateMysql2Fr(elt.date_actu) + "</td>";
		tbody += "<td>" + elt.body + "</td>";
		tbody += '<td class="td-actions">';
				tbody += '<a href="javascript: actualite.remove('
				+ elt.idactu
				+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
		tbody += '</td></tr>';
	});
	
	/**PAGINATION **/
	pagination = '<ul id="pagination_ul">';
	pagination +='<li class="li_numpage disabled" id="li_0"><a href="javascript: actualite.page(current_page - 1 )">Prec.</a></li>';
	for (i=1; i<=total_page;i++){
		pagination+='<li class="li_numpage" id="li_'+i+'"><a href="javascript: actualite.page('+i+')">'+i+'</a></li>';
	}
	pagination +='<li class="li_numpage" id="li_'+(total_page+1)+'"><a href="javascript: actualite.page(current_page +1 )">Suiv.</a></li>';
	pagination += '</ul>';
	$(".pagination").html("").append(pagination);
	$(".li_numpage").removeClass("disabled");
	if (current_page == 1) $("#pagination_ul > li:eq(0)").addClass("disabled");
	if (current_page == total_page) $("#pagination_ul > li:eq("+(current_page+1)+")").addClass("disabled");
	$("#pagination_ul > li:eq("+current_page+")").addClass("disabled");
	
	$("#main-table tbody").append(tbody);
	$("#main-table").trigger("update");
	$('.toggle-button').toggleButtons();
	$("#loading-table").hide();
	$("#actualite-spinner").hide();
	$(".tool").tooltip();
};

actualite.page = function(num_page,exception){
	if ($("#li_"+num_page).hasClass("disabled") && !exception ) return;
	$("#loading-table").show();
	$("#main-table tbody").html("");
	current_page = num_page;
	$.postJSON(BASE_URL + "actualite/get_all/",{
		"key" : "limit",
		"val": num_page,
		"date": dateFr2Mysql($("#date_actu").val()) 
		},
		actualite.initCallBack);
};

actualite.action = function(elt) {
	if((elt=="delete")&& !confirm("voulez vous vraiment supprimer?") )return;
	var ids= new Array();
	$.each($(".check_line"), function() {
		if ($(this).attr("checked")) ids.push($(this).val());
	});
	$.postJSON(BASE_URL + "actualite/action/", {
		"ids": ids,
		"action": elt
	}, actualite.actionCallBack);
};
actualite.actionCallBack = function(json){
	actualite.page(current_page,"exception");
	$("#check_all").attr("checked",false);
};

actualite.edit = function(id) {
	current_id = id;
	$("#actualite-spinner").show();
	$.getJSON(BASE_URL + "actualite/get" + id, actualite.editCallBack);
};

actualite.editCallBack = function(json) {
	var elt = json.actualite;
	$("#id").val(elt.id);
	$("#number").val(elt.number);
	$("#smsdate").val(elt.smsdate);
	$("#insertdate").val(elt.insertdate);
	$("#text").val(elt.text);
	$("#phone").val(elt.phone);
	$("#processed").val(elt.processed);
	setTimeout(function() {    $("#actualite-spinner").hide();   },100);
};

/*actualite.cancel = function() {
	$("#id").val("null");
	$("#number").val("");
	$("#smsdate").val("");
	$("#insertdate").val("");
	$("#text").val("");
	$("#phone").val("");
	$("#processed").val("");
	$("#btn-ok").html("Ajouter");
};*/
actualite.remove = function(id) {
	if(!confirm("Voullez vous vraiment supprimer cette ligne ?")) return;
	document.location.href = BASE_URL + "actualite/remove/" + id;
};

actualite.save = function() {
	if ($("#number").val()){
		$("#actualite-spinner").show();
		$.postJSON(BASE_URL + "actualite/save/", {
			"id" : $("#id").val(),
			"number" : $("#number").val(),
			"smsdate" : $("#smsdate").val(),
			"insertdate" : $("#insertdate").val(),
			"text" : $("#text").val(),
			"phone" : $("#phone").val(),
			"processed" : $("#processed").val()
		}, actualite.saveCallBack);
	}
};

actualite.saveCallBack = function(json) {
	actualite.init();
	actualite.cancel();
};
