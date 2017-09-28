
        var options = {
            chart: {
                type: 'spline',
                zoomType : 'x',
                margin: [ 50, 50, 100, 80]
            },
            title: {
                text: graph_title + ":"
            },
            subtitle: {
                text: graph_subtitle
            },
            xAxis: xAxis,
            yAxis: yAxis,
            
            series: []
        };//OPTIONS
        
      
        
$(function(){
	  options.series = graph_series;	
	  $.postJSON(BASE_URL +"graph/get/",{
  		"sqls": sqls
  		},
  		graph.initCallBack);
});      
        
 graph = {};
  
 graph.initCallBack = function(json){
	 var results = json.results;
	 var count = json.count;
	 var total = 0;
	 for(nb_courbe = 0; nb_courbe<count; nb_courbe++) {
		 var j =1; 
		 var thedata = [];
		 $.each(results[nb_courbe],function(i, elt) {
			 d = dateMysql2Fr(elt.x);
			 d = d.split("/");
			 total += parseInt(elt.y);
			 /**On remplit des valeurs null dans les dates qui ne possèdent pas de données**/
			 while (j<d[0]){
				 thedata.push([
				   		    Date.UTC(d[2], d[1]-1, j++), 0
				   	 ]);
			 }
			 thedata.push([Date.UTC(d[2], d[1]-1, d[0]), parseInt(elt.y)]);
			 j = d[0];
		 });
		 options.series[nb_courbe].data = thedata;
		 console.log(thedata);
	 }
	 if (graph_subtitle)  options.subtitle.text += " : "+ total;
	 
	 
	 $("#graphique").highcharts(options);
 };