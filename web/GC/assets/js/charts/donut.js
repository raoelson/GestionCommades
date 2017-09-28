$(function () {

	var data = [];
	var label = ["Message reçus","Messages envoyés","Utilisateurs","Messages traités"]
	var series = 3;
	i=0;
	$.each($(".stat"), function(){
		if (this.firstElementChild.className == "stat-value"){
			data[i] = { label: label[i], data: parseInt(this.firstElementChild.innerHTML) }
			i++;
		}
	});
	
	$.plot($("#donut-chart"), data,
	{
		colors: ["#F90", "#222", "#777", "#AAA"],
	        series: {
	            pie: { 
	                innerRadius: 0.5,
	                show: true
	            }
	        }
	});
});