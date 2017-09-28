$(document).ready(function() {
	user.init();
	$("#check_all").click(function(){
		check = $(this).attr("checked");
		if (check) $(".check_line").attr("checked",true);
		else $(".check_line").attr("checked",false);
	});
});

user = {};

var current_id;
var current_page = 1;

user.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");
	cond = "limit/1";
	if (where!="") cond =where[0]+"/"+where[1];
	$.getJSON(BASE_URL + "user/get_all/"+cond, user.initCallBack);
	$("#pagination_ul > li:eq(1)").addClass("disabled");
	$("#main-table").tablesorter(
			{ headers: {
         			0: { 
         				// disable it by setting the property sorter to false 
         					sorter: false 
         			}
			}});
};
user.page = function(num_page,exception){
	if ($("#li_"+num_page).hasClass("disabled") && !exception ) return;
	$(".li_numpage").removeClass("disabled");
	if (num_page == 1) $("#pagination_ul > li:eq(0)").addClass("disabled");
	else if (num_page == total_page) $("#pagination_ul > li:eq("+(num_page+1)+")").addClass("disabled");
	current_page = num_page;
	$("#pagination_ul > li:eq("+num_page+")").addClass("disabled");
	$("#loading-table").show();
	$("#main-table tbody").html("");
	$.getJSON(BASE_URL + "user/get_all/limit/"+num_page, user.initCallBack);
};
user.initCallBack = function(json) {
	var users = json.user;
	console.log(users);
	var tbody = "";
	i = 0;
	$.each(users,
					function(i, elt) {
						check="";
						if (elt.is_active == 1) check="checked";
						tbody += "<tr id='tr_"+elt.iduser+"'><td style='width: 13px'><input type='checkbox' value='"+elt.iduser+"' class='check_line'></td>";
						tbody += "<td>" + elt.login + "</td>";
						tbody += "<td>" + elt.username + "</td>";
						tbody += "<td>" + elt.numtel + "</td>";
						tbody += "<td>" + elt.email + "</td>";
						tbody += "<td>" + elt.nom_district + "</td>";
						tbody += '<td><div class="toggle-button"><input type="checkbox" '+check+' onchange="user.activate(this,'+elt.iduser+')" id="checkbox_'+elt.iduser+'"></div></td>';
						tbody += '<td class="td-actions">';
						tbody += '<a href="#ancre" onclick="user.edit('
								+ elt.iduser
								+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
						tbody += '<a href="javascript: user.remove('
								+ elt.iduser
								+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
						tbody += '</td></tr>';
						++i;
					});
	$("#main-table tbody").append(tbody);
	$("#main-table").trigger("update");
	 $('.toggle-button').toggleButtons();
	$("#loading-table").hide();
};

user.activate = function(obj,iduser){
	if (obj.checked) is_active = 1;
	else is_active = 0;
	$.postJSON(BASE_URL + "user/save/", {
		"iduser" : iduser,
		"is_active" : is_active,
		"date_activation": now()
	});
};
user.edit = function(id) {
	current_id = id;
	$("#user-spinner").show();
	$.getJSON(BASE_URL + "user/get/" + id, user.editCallBack);
};

user.editCallBack = function(json) {
	var user = json.user;
	var usergroups = json.usergroups;
	$("#iduser").val(user.iduser);
	$("#login").val(user.login).addClass("disabled").attr("disabled");
	$("#username").val(user.username);
	$("#numtel").val(user.numtel);
	$("#email").val(user.email);
	$("#code_district").val(user.code_district);
	$("#password").val("");
	$("#password-confirm").val("");
	$("#main-form").show();
	setTimeout(function() {
		$("#user-spinner").hide();
	}, 100);
	$("#username").focus();
	$(".groupclass").attr("checked",false);
	$.each(usergroups, function(i, elt){
		$("#group_"+elt.group_idgroup).attr("checked",true);
	});
};
user.cancel = function() {
	$("#main-form").hide();
};
user.add = function() {
	$("#iduser").val("null");
	$("#login").removeClass("disabled").removeAttr("disabled").val("");
	$("#username").val("");
	$("#numtel").val("+261");
	$("#password").val("");
	$("#password-confirm").val("");
	$("#code_district").val("");
	$("#main-form").show();
	$("#login").focus();
};
user.remove = function(id) {
	if (!confirm("Voulez vous vraiment supprimer cet utilisateur ?"))
		return;
	$("#loading-table").show();
	$.getJSON(BASE_URL + "user/delete/" + id, user.supprCallBack);
};
user.supprCallBack = function(json) {
	var success = json.success;
	$("#tr_" + json.iduser).remove();
	$("#loading-table").hide();
};

user.action = function(elt) {
	if((elt=="delete")&& !confirm("voulez vous vraiment supprimer?") )return;
	var ids= new Array();
	$.each($(".check_line"), function() {
		if ($(this).attr("checked")) ids.push($(this).val());
	});
	$.postJSON(BASE_URL + "user/action/", {
		"ids": ids,
		"action": elt
	}, user.actionCallBack);
};
user.actionCallBack = function(json){
	user.page(current_page,"exception");
	$("#check_all").attr("checked",false);
};

user.save = function() {
	var erreur="";
	groups = new Array();
	
	$(".groupclass").each(function(){
		id = $(this).attr('id').split("group_");
		if ($(this).attr("checked")) groups.push(id[1]);
	});
	if ($("#password").val() != $("#password-confirm").val()) {
		erreur = "Les mots de passe ne correpondent pas!";
	}
	else if (!$("#login").val() || !$("#numtel").val() || !$("#code_district").val()){
		erreur = "Vérifier bien le formulaire";
	}
	else if (groups=="" ) {
		erreur = "Vous devez au moins choisir un groupe";
	}
	else if (erreur=="") 
		$.postJSON(BASE_URL + "user/save/", {
			"iduser" : $("#iduser").val(),
			"login" : $("#login").val(),
			"password" : $("#password").val(),
			"confirm-password" : $("#confirm-password").val(),
			"username" : $("#username").val(),
			"numtel" : $("#numtel").val(),
			"email" : $("#email").val(),
			"groups": groups,
			"code_district" : $("#code_district").val()
		}, user.saveCallBack);
	if (erreur) {
		$("#alert p").html(erreur);
		$("#alert").show();
		$("#alert").focus();
	}
};
user.saveCallBack = function(json) {
	var elt = json.user;
	if (elt.success)
		user.page(current_page,'exception');
		setTimeout(function() {
		$("#user-spinner").hide();
	}, 100);
	user.cancel();
};