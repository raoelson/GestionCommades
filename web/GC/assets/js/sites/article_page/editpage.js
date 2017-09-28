$(document).ready(function() {
	$('#body').tinymce({
		// Location of TinyMCE script
		script_url : LIB_JS + 'tiny_mce/tiny_mce.js',
		language : "fr",
		// General options
		theme : "advanced",
		plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",

		// Theme options
		theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		content_css : LIB_JS +"tiny_mce/css/content.css",

		// Drop lists for link/image/media/template dialogs
		//template_external_list_url : "lists/template_list.js",
		//external_link_list_url : "lists/link_list.js",
		external_image_list_url : BASE_URL+"media/get/"+iduser+"/",
		//media_external_list_url : "lists/media_list.js",
		height: "500"
	});
	if (idpage){
		 page.init(idpage); 
	}
	$("#img").change(function(){
		$("#apercu").attr("src",$(this).val()).show();
	});
	var option = "<option></option>";
	$.each(tinyMCEImageList, function(i,elt){
		option +='<option value="'+elt[1]+'">'+elt[0]+'</option>'; 
	});
	$("#img").append(option);
	
	

});

page = {};

var current_id;

page.init = function(id){
	$("#loading").show();
	$.getJSON(BASE_URL + "page/get/" + id, page.initCallBack);
}

page.initCallBack = function(json) {
	var elt = json.page;
	//console.log(elt);
	$("#idpage").val(elt.idpage);
	if (elt.user_iduser) $("#user_iduser").val(elt.user_iduser);
	if (elt.niveau) $("#niveau").val(elt.niveau);
	$("#title").val(elt.title);
	$("#alias").val(elt.alias);
	$("#body").val(elt.body);
	$("#cat_"+elt.categorie_idcategorie).attr("checked","checked");
	page.chooseCategorie(elt.categorie_idcategorie,elt.page_code_district,elt.page_region_idregion);
	$("#img").val(elt.img);
	$("#keywords").val(elt.keywords);
	$("#apercu").attr("src",elt.img).show();
	$("#btn-preview").attr("href",SITE_URL+"page/single/"+elt.categorie_idcategorie+"/"+elt.idpage).show();
	$("#loading").hide();
};
page.cancel = function() {
	document.location = BASE_URL + "page";
}

page.save = function() {
	categorie_idcategorie = $('input:radio:checked').val();
	if (categorie_idcategorie) {
		$.postJSON(BASE_URL + "page/save/", {
			"idpage" : $("#idpage").val(),
			"niveau" : $("#niveau").val(),
			"title" : $("#title").val(),
			"alias" : $("#alias").val(),
			"body" : $("#body").val(),
			"categorie_idcategorie" : categorie_idcategorie,
			"img" : $("#img").val(),
			"keywords": $("#keywords").val(),
			"date_write": now(),
			"user_iduser": $("#user_iduser").val(),
			// On dépublie d'abord l'article
			"is_publish" : 0,
			"page_code_district": $("#page_code_district").val(),
			"page_region_idregion": $("#page_region_idregion").val()
		}, page.saveCallBack);
		return true;
	}
	else {
		alert("Choisissez une catégorie pour cet page");
		return false;	
	}
}
page.saveCallBack = function(json) {
	var elt = json.page;
	//console.log(elt);
	if (elt.success) {
		$("#btn-cancel").html("Terminer");
		$("#idpage").val(elt.idpage);
		$("#message").addClass("alert-info").show().fadeOut(2000);
		$("#btn-preview").attr("href",SITE_URL+"page/single/"+elt.categorie_idcategorie+"/"+elt.idpage).show();
	}
}
page.chooseCategorie = function(id,district, region){
	id = parseInt(id);
	district = parseInt(district);
	region = parseInt(region);
	$("#selectDistrict").hide();
	$("#selectRegion").hide();
	//if (!district) district = "";
	$("#page_code_district").val(district);
	//if (!region) region = "";
	$("#page_region_idregion").val(region);
	switch(id){
	case 4:
		$("#selectDistrict").show();
		break;
	case 5:
		$("#selectRegion").show();	
		break;
	}
}