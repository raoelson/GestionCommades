$ (document).ready(function() {
	 $('.multiselect').multiselect({
	      buttonClass: 'btn',
	      buttonWidth: 'auto',
	      buttonContainer: '<div class="btn-group" />',
	      maxHeight: false,
	      buttonText: function(options) {
	        if (options.length == 0) {
	          return 'Aucune selection <b class="caret"></b>';
	        }
	        else if (options.length > 3) {
	          return options.length + ' selected  <b class="caret"></b>';
	        }
	        else {
	          var selected = '';
	          options.each(function() {
	            selected += $(this).text() + ', ';
	          });
	          return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
	        }
	      }
	    });
		
	 $("#text").keypress(function(){
		 if (!message.verify())	$("#nb_car").val(148-$(this).val().length); 
	 });

});

message = {};

message.verify = function (){
	msg = "";
	if (!$("#text").val().length) msg="Entrer votre message";
	if ($("#text").val().length>148) msg = "Text trop long";
	return msg;
};

message.send = function(){
	erreur = message.verify();
	if (erreur){
		alert(erreur);
		return false;
	}
	$("#profile").hide();
	$("#loading-table").show();
	$.postJSON(BASE_URL + "outbox/send_message_group/", {
		"text" : $("#text").val(),
		"dest" : $("#dest").val()
	}, message.sendCallBack);
}
message.sendCallBack = function(json){
	var posts = json.posts;
	$("#group-name").html(posts.dest.toString());
	$("#text").val("");
	 $(".alert-info").fadeIn(1000);
	$(".alert-info").fadeOut(10000, "linear");
	$("#loading-table").hide();
	$("#profile").show();
}