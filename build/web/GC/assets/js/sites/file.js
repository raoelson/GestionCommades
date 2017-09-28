$(document).ready(function() {
	var elf = $('#elfinder').elfinder({
		url : BASE_URL+'file/connector',  // connect	// URL	// (REQUIRED)
		lang: 'fr'          // language (OPTIONAL)
	}).elfinder('instance');
});
