	var url_controller =BASE_URL+"media/save";
	
	var uploader = new plupload.Uploader({
		runtimes: 'html5, flash',
		containes: 'plupload',
		browse_button: 'browse',
		drop_element: 'droparea',
		url: url_controller,
		flash_swf_url: BASE_URL+'assets/backend/js/lib/plupload/plupload.flash.swf',
		multipart: true,
		max_file_size: '10mb',
		urlstream_upload: true,
		unique_names : true,
		filters: [
			{title: 'Images', extensions: 'jpg,gif,jpeg,png'},
                        {title: 'Pdf', extensions: 'pdf'},
			{title : "Zip files", extensions : "zip,rar,7zip,sit"}
		] 
	});
	uploader.init();
	uploader.bind('FilesAdded', function(up, files){
		var filelist = $("#filelist");
		console.log(files);
		for(var i in files){
			var file = files[i];
			filelist.prepend('<div id='+file.id+' class="file">'+file.name+' ('+plupload.formatSize(file.size)+')<div class="progressbar"><div class="progress"></div></div></div>');
		}
		$("#droparea").removeClass('hover');
		uploader.start();
		uploader.refresh();
	});
	uploader.bind('UploadProgress',function(up,file){
		$("#"+file.id).find('.progress').css('width',file.percent+'%');
	});
	uploader.bind('Error', function(up,err){
		alert(err.message);
		$("#droparea").removeClass('hover');
		uploader.refresh();
	});
	uploader.bind('FileUploaded', function (up, file, response){
		data = $.parseJSON(response.response);
		if (data.error){
			alert(data.message);
			$("#"+file.id).remove();		
		}
		else {
			if (data.type=="pdf") $("#"+file.id).replaceWith("<div class='file'><img src='"+BASE_URL+"assets/medias/pdf/pdf-icon.png'>"+data.file+"</div>");
			else $("#"+file.id).replaceWith("<div class='file'><img src="+SITE_URL+"assets/medias/"+iduser+"/"+data.file+">"+data.file+"</div>");
			
		}
	});
	
jQuery(function($){
	$("#droparea").bind({
		dragover: function(e){
			$(this).addClass('hover');
		},
		dragleave: function(e){
			$(this).removeClass('hover');
		}
	});
});