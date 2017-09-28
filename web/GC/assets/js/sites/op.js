$(document).ready(function() {
	op.init();
	$("#check_all").click(function() {
		check = $(this).attr("checked");
		if (check)
			$(".check_line").attr("checked", true);
		else
			$(".check_line").attr("checked", false);
	});
});

op = {};

var current_id;
var current_page = 1;
var total_page;

op.init = function() {
	$("#loading-table").show();
	$("#main-table tbody").html("");

	var key = "limit";
	var val = 1;
	if (where != "") {
		key = where[0];
		val = where[1];
	}
	$.postJSON(BASE_URL + "op/op/get_all/", {
		"key" : key,
		"val" : val
	}, op.initCallBack);
	$("#pagination_ul > li:eq(1)").addClass("disabled");
	$("#main-table").tablesorter({
		headers : {
			0 : {
				// disable it by setting the property sorter to false
				sorter : false
			}
		}
	});
};
op.page = function(num_page, exception) {
	if ($("#li_" + num_page).hasClass("disabled") && !exception)
		return;
	$("#loading-table").show();
	$("#main-table tbody").html("");
	current_page = num_page;
	$.postJSON(BASE_URL + "op/op/get_all/", {
		"key" : "limit",
		"val" : num_page
	}, op.initCallBack);
};
op.initCallBack = function(json) {
	var ops = json.op;
	total_page = json.total_page;
	var tbody = "";
	i = 0;
	$
			.each(
					ops,
					function(i, elt) {
						check = "";
						if (elt.is_active == 1)
							check = "checked";
						tbody += "<tr id='tr_"
								+ elt.idop
								+ "'><td style='width: 13px'><input type='checkbox' value='"
								+ elt.idop + "' class='check_line'></td>";
						tbody += "<td>" + elt.nom_region + "</td>";
						tbody += "<td>" + elt.nom_district + "</td>";
						tbody += "<td>" + elt.commune + "</td>";
						tbody += "<td>" + elt.fokontany + "</td>";
						tbody += "<td>" + elt.nom_op + "</td>";
						tbody += "<td>" + elt.filiere1 + "</td>";
						tbody += '<td class="td-actions">';
						tbody += '<a href="#ancre" onclick="op.edit('
								+ elt.idop
								+ ')" class="btn btn-small btn-warning"><i class="btn-icon-only icon-pencil"></i> </a>';
						tbody += '<a href="javascript: op.remove('
								+ elt.idop
								+ ')" class="btn btn-small"> <i class="btn-icon-only icon-remove"></i></a>';
						tbody += '</td></tr>';
						++i;
					});
	/** PAGINATION * */
	if (total_page) {
		pagination = '<div class="control-group">';
		pagination+='<label for="pagination_select">Page :</label><div class="control"><select id="pagination_select" class="span1" onchange="op.page($(this).val())">';
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
};

op.edit = function(id) {
	current_id = id;
	$("#op-spinner").show();
	$.getJSON(BASE_URL + "op/op/get/" + id, op.editCallBack);
};

op.editCallBack = function(json) {
	var op = json.op;
	var opgroups = json.opgroups;
	$("#idop").val(op.idop);
	$("#login").val(op.login).addClass("disabled").attr("disabled");
	$("#opname").val(op.opname);
	$("#numtel").val(op.numtel);
	$("#email").val(op.email);
	$("#code_district").val(op.code_district);
	$("#password").val("");
	$("#password-confirm").val("");
	$("#main-form").show();
	setTimeout(function() {
		$("#op-spinner").hide();
	}, 100);
	$("#opname").focus();
	$(".groupclass").attr("checked", false);
	$.each(opgroups, function(i, elt) {
		$("#group_" + elt.group_idgroup).attr("checked", true);
	});
};
op.cancel = function() {
	$("#main-form").hide();
};
op.add = function() {
	$("#idop").val("null");
	$("#login").removeClass("disabled").removeAttr("disabled").val("");
	$("#opname").val("");
	$("#numtel").val("+261");
	$("#password").val("");
	$("#password-confirm").val("");
	$("#code_district").val("");
	$("#main-form").show();
	$("#login").focus();
};
op.remove = function(id) {
	if (!confirm("Voulez vous vraiment supprimer cette ligne ?"))
		return;
	$("#loading-table").show();
	$.getJSON(BASE_URL + "op/op/delete/" + id, op.supprCallBack);
};
op.supprCallBack = function(json) {
	var success = json.success;
	$("#tr_" + json.idop).remove();
	$("#loading-table").hide();
};

op.action = function(elt) {
	if ((elt == "delete") && !confirm("voulez vous vraiment supprimer?"))
		return;
	var ids = new Array();
	$.each($(".check_line"), function() {
		if ($(this).attr("checked"))
			ids.push($(this).val());
	});
	$.postJSON(BASE_URL + "op/op/action/", {
		"ids" : ids,
		"action" : elt
	}, op.actionCallBack);
};
op.actionCallBack = function(json) {
	op.page(current_page, "exception");
	$("#check_all").attr("checked", false);
};

op.save = function() {
	var erreur = "";
	groups = new Array();

	$(".groupclass").each(function() {
		id = $(this).attr('id').split("group_");
		if ($(this).attr("checked"))
			groups.push(id[1]);
	});
	if ($("#password").val() != $("#password-confirm").val()) {
		erreur = "Les mots de passe ne correpondent pas!";
	} else if (!$("#login").val() || !$("#numtel").val()
			|| !$("#code_district").val()) {
		erreur = "Vérifier bien le formulaire";
	} else if (groups == "") {
		erreur = "Vous devez au moins choisir un groupe";
	} else if (erreur == "")
		$.postJSON(BASE_URL + "op/save/", {
			"idop" : $("#idop").val(),
			"login" : $("#login").val(),
			"password" : $("#password").val(),
			"confirm-password" : $("#confirm-password").val(),
			"opname" : $("#opname").val(),
			"numtel" : $("#numtel").val(),
			"email" : $("#email").val(),
			"groups" : groups,
			"code_district" : $("#code_district").val()
		}, op.saveCallBack);
	if (erreur) {
		$("#alert p").html(erreur);
		$("#alert").show();
		$("#alert").focus();
	}
};
op.saveCallBack = function(json) {
	var elt = json.op;
	if (elt.success) {
		op.page(current_page, 'exception');
		setTimeout(function() {
			$("#op-spinner").hide();
		}, 100);
		op.cancel();
	} else {
		$("#alert p").html(elt.erreur);
		$("#alert").show();
		$("#alert").focus();
	}
};