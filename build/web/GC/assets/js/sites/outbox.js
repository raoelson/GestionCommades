$ (document).ready(function() {
	if ($("#date_prix").val() == "" ) $("#date_prix").datepicker( ).val(dateMysql2Fr(now()));
	outbox.init();
	$("#date_prix").change(function(){
		outbox.init();
	});
	$("#check_all").click(function(){
		check = $(this).attr("checked");
		if (check) $(".check_line").attr("checked",true);
		else $(".check_line").attr("checked",false);
	});
});

outbox = {};

var current_id;
var current_page = 1;
var total_page;

outbox.init = function(){
	$("#loading-table").show();
	$("#main-table tbody").html("");
	date = dateFr2Mysql($("#date_prix").val());
	var key = "limit";
	var val = 1;
	$.postJSON(BASE_URL + "outbox/get_all/",{
			"key": key,
			"val": val,
			"date": date
		}, outbox.initCallBack);
	//$("#pagination_ul > li:eq(1)").addClass("disabled");
	$("#main-table").tablesorter(
			{ headers: {
         			0: { 
         				// disable it by setting the property sorter to false 
         					sorter: false 
         			}
	}});
};

outbox.initCallBack = function(json) {
	var outboxs = json.outbox;
	total_page = json.total_page;
	var tbody = "";
	
	i = 0;
	$.each(outboxs, function(i, elt) {
		check="";
		tbody += "<tr id='tr_"+elt.idoutbox+"'><td style='width: 13px'><input type='checkbox' value='"+elt.id+"' class='check_line'></td>";
		if (elt.username) tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.number+"'>" + elt.username + "</td>";
		else tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.number+"'>" + elt.number + "</td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.processed_date+"'>" + dateMysql2Fr(elt.processed_date) + "</td>";
		tbody += "<td>" + elt.text + "</td>";
		tbody += "<td>" + elt.processed + "</td>";
		tbody += "<td>" + elt.error + "</td>";
		tbody += '<td class="td-actions">';
				tbody += '<a href="javascript: outbox.remove('
				+ elt.id
				+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
		tbody += '</td></tr>';
	});
	/**PAGINATION **/
	pagination = '<ul id="pagination_ul">';
	pagination +='<li class="li_numpage disabled" id="li_0"><a href="javascript: outbox.page(current_page - 1 )">Prec.</a></li>';
	for (i=1; i<=total_page;i++){
		pagination+='<li class="li_numpage" id="li_'+i+'"><a href="javascript: outbox.page('+i+')">'+i+'</a></li>';
	}
	pagination +='<li class="li_numpage" id="li_'+(total_page+1)+'"><a href="javascript: outbox.page(current_page +1 )">Suiv.</a></li>';
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
	$("#outbox-spinner").hide();
	$(".tool").tooltip();
};

outbox.page = function(num_page,exception){
	if ($("#li_"+num_page).hasClass("disabled") && !exception ) return;
	$("#loading-table").show();
	$("#main-table tbody").html("");
	current_page = num_page;
	$.postJSON(BASE_URL + "outbox/get_all/",{
		"key" : "limit",
		"val": num_page,
		"date": dateFr2Mysql($("#date_prix").val()) 
		},
		outbox.initCallBack);
};

outbox.action = function(elt) {
	if((elt=="delete")&& !confirm("voulez vous vraiment supprimer?") )return;
	var ids= new Array();
	$.each($(".check_line"), function() {
		if ($(this).attr("checked")) ids.push($(this).val());
	});
	$.postJSON(BASE_URL + "outbox/action/", {
		"ids": ids,
		"action": elt
	}, outbox.actionCallBack);
};
outbox.actionCallBack = function(json){
	outbox.page(current_page,"exception");
	$("#check_all").attr("checked",false);
};

outbox.edit = function(id) {
	current_id = id;
	$("#outbox-spinner").show();
	$.getJSON(BASE_URL + "outbox/get" + id, outbox.editCallBack);
};

outbox.editCallBack = function(json) {
	var elt = json.outbox;
	$("#id").val(elt.id);
	$("#number").val(elt.number);
	$("#smsdate").val(elt.smsdate);
	$("#insertdate").val(elt.insertdate);
	$("#text").val(elt.text);
	$("#phone").val(elt.phone);
	$("#processed").val(elt.processed);
	setTimeout(function() {    $("#outbox-spinner").hide();   },100);
};

outbox.cancel = function() {
	$("#id").val("null");
	$("#number").val("");
	$("#smsdate").val("");
	$("#insertdate").val("");
	$("#text").val("");
	$("#phone").val("");
	$("#processed").val("");
	$("#btn-ok").html("Ajouter");
};
outbox.remove = function(id) {
	if(!confirm("Voullez vous vraiment supprimer cette ligne ?")) return;
	document.location.href = BASE_URL + "outbox/remove/" + id;
};

outbox.save = function() {
	if ($("#number").val()){
		$("#outbox-spinner").show();
		$.postJSON(BASE_URL + "outbox/save/", {
			"id" : $("#id").val(),
			"number" : $("#number").val(),
			"smsdate" : $("#smsdate").val(),
			"insertdate" : $("#insertdate").val(),
			"text" : $("#text").val(),
			"phone" : $("#phone").val(),
			"processed" : $("#processed").val()
		}, outbox.saveCallBack);
	}
};

outbox.saveCallBack = function(json) {
	outbox.init();
	outbox.cancel();
};
