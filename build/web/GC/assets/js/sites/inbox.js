$ (document).ready(function() {
	if ($("#date_prix").val() == "") $("#date_prix").datepicker( ).val(dateMysql2Fr(now()));
	inbox.init();
	$("#date_prix").change(function(){
		inbox.init();
	});
	$("#check_all").click(function(){
		check = $(this).attr("checked");
		if (check) $(".check_line").attr("checked",true);
		else $(".check_line").attr("checked",false);
	});
});

inbox = {};

var current_id;
var current_page = 1;

inbox.init = function(){
	$("#loading-table").show();
	$("#main-table tbody").html("");
	date = dateFr2Mysql($("#date_prix").val());
	var key = "limit";
	var val = 1;
	$.postJSON(BASE_URL + "inbox/get_all/",{
			"key": key,
			"val": val,
			"date": date
		}, inbox.initCallBack);
	
	$("#pagination_ul > li:eq(1)").addClass("disabled");
	$("#main-table").tablesorter(
			{ headers: {
         			0: { 
         				// disable it by setting the property sorter to false 
         					sorter: false 
         			}
	}});
};

inbox.initCallBack = function(json) {
	var inboxs = json.inbox;
	total_page = json.total_page;
	var tbody = "";
	
	i = 0;
	$.each(inboxs, function(i, elt) {
		check="";
		tbody += "<tr id='tr_"+elt.idinbox+"'><td style='width: 13px'><input type='checkbox' value='"+elt.id+"' class='check_line'></td>";
		if (elt.username) tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.number+"'>" + elt.username + "</td>";
		else tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.number+"'>" + elt.number + "</td>";
		tbody += "<td><a href='#' class='tool' data-toggle='tooltip' title='"+elt.smsdate+"'>" + dateMysql2Fr(elt.smsdate) + "</td>";
		tbody += "<td>" + elt.text + "</td>";
		tbody += "<td>" + elt.processed + "</td>";
		tbody += '<td class="td-actions">';
				tbody += '<a href="javascript: inbox.remove('
				+ elt.id
				+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
		tbody += '</td></tr>';
	});
	
	/**PAGINATION **/
	pagination = '<ul id="pagination_ul">';
	pagination +='<li class="li_numpage disabled" id="li_0"><a href="javascript: inbox.page(current_page - 1 )">Prec.</a></li>';
	for (i=1; i<=total_page;i++){
		pagination+='<li class="li_numpage" id="li_'+i+'"><a href="javascript: inbox.page('+i+')">'+i+'</a></li>';
	}
	pagination +='<li class="li_numpage" id="li_'+(total_page+1)+'"><a href="javascript: inbox.page(current_page +1 )">Suiv.</a></li>';
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
	$("#inbox-spinner").hide();
	$(".tool").tooltip();
};

inbox.page = function(num_page,exception){
	if ($("#li_"+num_page).hasClass("disabled") && !exception ) return;
	$("#loading-table").show();
	$("#main-table tbody").html("");
	current_page = num_page;
	$.postJSON(BASE_URL + "inbox/get_all/",{
		"key" : "limit",
		"val": num_page,
		"date": dateFr2Mysql($("#date_prix").val()) 
		},
		inbox.initCallBack);
};

inbox.action = function(elt) {
	if((elt=="delete")&& !confirm("voulez vous vraiment supprimer?") )return;
	var ids= new Array();
	$.each($(".check_line"), function() {
		if ($(this).attr("checked")) ids.push($(this).val());
	});
	$.postJSON(BASE_URL + "inbox/action/", {
		"ids": ids,
		"action": elt
	}, inbox.actionCallBack);
};
inbox.actionCallBack = function(json){
	inbox.page(current_page,"exception");
	$("#check_all").attr("checked",false);
};

inbox.edit = function(id) {
	current_id = id;
	$("#inbox-spinner").show();
	$.getJSON(BASE_URL + "inbox/get" + id, inbox.editCallBack);
};

inbox.editCallBack = function(json) {
	var elt = json.inbox;
	$("#id").val(elt.id);
	$("#number").val(elt.number);
	$("#smsdate").val(elt.smsdate);
	$("#insertdate").val(elt.insertdate);
	$("#text").val(elt.text);
	$("#phone").val(elt.phone);
	$("#processed").val(elt.processed);
	setTimeout(function() {    $("#inbox-spinner").hide();   },100);
};

inbox.cancel = function() {
	$("#id").val("null");
	$("#number").val("");
	$("#smsdate").val("");
	$("#insertdate").val("");
	$("#text").val("");
	$("#phone").val("");
	$("#processed").val("");
	$("#btn-ok").html("Ajouter");
};
inbox.remove = function(id) {
	if(!confirm("Voullez vous vraiment supprimer cette ligne ?")) return;
	document.location.href = BASE_URL + "inbox/remove/" + id;
};

inbox.save = function() {
	if ($("#number").val()){
		$("#inbox-spinner").show();
		$.postJSON(BASE_URL + "inbox/save/", {
			"id" : $("#id").val(),
			"number" : $("#number").val(),
			"smsdate" : $("#smsdate").val(),
			"insertdate" : $("#insertdate").val(),
			"text" : $("#text").val(),
			"phone" : $("#phone").val(),
			"processed" : $("#processed").val()
		}, inbox.saveCallBack);
	}
};

inbox.saveCallBack = function(json) {
	inbox.init();
	inbox.cancel();
};
