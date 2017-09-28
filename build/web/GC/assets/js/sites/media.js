$(document).ready(function() {
	media.init();
	$("#form-search").hide();
	$('#myModal').modal("hide");
	$(".thumbnail").click(function(){
		img = $(this).html();
		h= $(this).find("img").height();
		w = $(this).find("img").width();
		//$("#myModal").css({width: 390+w});
		$(".modal-body").html("").append("<p style='text-align: center'>"+img+"</p>");
		$('#myModal').modal("show");
	});
});

media = {};

var current_id;

media.init = function() {
	$("#loading-table").show();
	thumbs = "";
	$("#main-table tbody").html("");
	$.each(tinyMCEImageList, function(i,elt){
		thumbs +='<li class="span1"><input type="checkbox" class="check_img" value="'+elt[1]+'"><a href="#" accesskey="" class="thumbnail" data-toggle="modal"> <img src="'+elt[1]+'" alt="'+elt[0]+'" style="max-height: 150px"></a></li>'; 
	});
	$("#thumbnails").append(thumbs);
	if (thumbs == "") $("#loading-table").html('<i class="icon-exclamation-sign icon-2x pull-left"></i>Aucune image à afficher');
	else $("#loading-table").hide();
}

media.action = function(elt) {
	if((elt=="delete")&& !confirm("voulez vous vraiment supprimer ces images?") )return;
	var ids= new Array();
	$.each($(".check_img"), function() {
		if ($(this).attr("checked")) ids.push($(this).val());
	});
	console.log(ids);
	$.postJSON(BASE_URL + "media/delete/",{"ids": ids} , media.supprCallBack);
};
media.supprCallBack = function(json) {
	var success = json.success;
	if (success) document.location = BASE_URL +"media";
}
