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
		external_image_list_url : BASE_URL+"media/get/",
		//media_external_list_url : "lists/media_list.js",
		height: "500"
	});
	if (idarticle){
		 article.init(idarticle); 
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

article = {};

var current_id;

article.init = function(id){
	$("#loading").show();
	$.getJSON(BASE_URL + "article/get/" + id, article.initCallBack);
}

article.initCallBack = function(json) {
	var elt = json.article;
	$("#idarticle").val(elt.idarticle);
	$("#title").val(elt.title);
	$("#body").val(elt.body);
	$("#cat_"+elt.categorie_idcategorie).attr("checked","checked");
	$("#img").val(elt.img);
	$("#keywords").val(elt.keywords);
	$("#apercu").attr("src",elt.img).show();
	$("#loading").hide();
};
article.cancel = function() {
	document.location = BASE_URL + "article";
}

article.save = function() {
	categorie_idcategorie = $('input:radio:checked').val();
	if (categorie_idcategorie) {
		$.postJSON(BASE_URL + "article/save/", {
			"idarticle" : $("#idarticle").val(),
			"title" : $("#title").val(),
			"body" : $("#body").val(),
			"categorie_idcategorie" : categorie_idcategorie,
			"img" : $("#img").val(),
			"keywords": $("#keywords").val(),
			"date_write": now()
		}, article.saveCallBack);
		return true;
	}
	else {
		alert("Choisissez une catégorie pour cet article");
		return false;	
	}
}
article.saveCallBack = function(json) {
	var elt = json.article;
	if (elt.success) {
		$("#btn-cancel").html("Terminer");
		$("#idarticle").val(elt.idarticle);
		$("#message").addClass("alert-info").show().fadeOut(2000);
	}
}