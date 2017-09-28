var options = {
	chart : {
		type : 'column',
		zoomType : 'x',
		spacingRight : 20,
		margin : [ 50, 50, 100, 80 ]
	},
	title : {
		text : graph_title + ":"
	},
	subtitle : {
		text : graph_subtitle
	},
	xAxis : xAxis,
	yAxis : yAxis,

	series : []
};// OPTIONS

$(function() {
	if ($("#date_prix").val() == "")
		$("#date_prix").datepicker({
		      changeMonth: true,
		      changeYear: true,
		      showButtonPanel: true
		    }).val(dateMysql2Fr(now()));
	options.series = graph_series;
	$("#date_prix").change(function() {
		graph.init();
	});
	graph.init();
});

graph = {};
graph.init = function() {
	
	$.postJSON(BASE_URL + "graph/get_price/", {
		"date" : dateFr2Mysql($("#date_prix").val()),
		"prod" : prod
	}, graph.initCallBack);
};
var categories = [];
graph.initCallBack = function(json) {
	var results = json.results;
	var districts = json.districts;
	$.each(json.produits, function(i, elt) {
		options.series[i].name = elt.nom_produit;
		if (results[elt.nom_produit]) options.series[i].data = results[elt.nom_produit];
	});
	options.xAxis.categories = districts;
	options.subtitle.text = "Période du "+dateMysql2Fr(json.date_debut) + " au " + dateMysql2Fr(json.date_fin);
	$("#graphique").highcharts(options);
};