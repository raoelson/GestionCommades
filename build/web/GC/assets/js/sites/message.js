message = {};


$ (document).ready(function() {
	 $("#dest").select2({
		 placeholder: "Sélectionner le(s) destinataire(s)",
		 allowClear: true,
	 });
	 $("#btn-save").click(function(){
		erreur = message.verify();
		if (erreur){
			alert(erreur);
			return false;
		}
		$.postJSON(BASE_URL + "outbox/send_message/", {
			"text" : $("#text").val(),
			"dest" : $("#dest").val()
		}, message.sendCallBack);
 	 });
	 $("#text").keyup(function(){
		 if (!message.verify())	$("#nb_car").val(148-$(this).val().length); 
	 });
});

message.sendCallBack = function(json){
	var posts = json.posts;
	$("#group-name").html(posts.dest.toString());
	$("#text").val("");
	 $(".alert-info").fadeIn(1000);
	$(".alert-info").fadeOut(10000, "linear");
	$("#loading-table").hide();
	$("#profile").show();
}

message.verify = function (){
	msg = "";
	if (!$("#text").val().length) msg="Entrer votre message";
	if ($("#text").val().length>148) msg = "Text trop long";
	return msg;
};
