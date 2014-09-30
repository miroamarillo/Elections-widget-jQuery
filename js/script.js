var url = 'http://static.globalnews.ca/content/test/results-2011.js?callback=?';
$.ajax({
	type: 'GET',
	url: url,
	async: false,
	jsonpCallback: 'gNews_getRidingDetailsCallback',
	contentType: "application/json",
	dataType: 'jsonp'
}).done(function(data){
	//Create elections object
	elections = {};
	elections.json = data;
	var json = elections.json;
	var totalVotes = 0;
	json.totalVotes = 0;
	var output = '';
	//processing data
	for(var i = 0; i < json.length; i++){
		json[i].ridingVotes = 0;
		for(var j = 0; j < json[i].results.length; j++){
			//get votes per riding
			json[i].ridingVotes += json[i].results[j].votes;
			totalVotes += json[i].results[j].votes;
		}
		//Store total votes Overall
		json.totalVotes = totalVotes;
	}
	//showing data

	for(var i = 0; i < json.length; i++){
		output += "<li>";
		//Build a table with all the data.  Tables are more accessible for this kind of content
		//Description
		output += "<table summary=\"Results " + json[i].name + "\">";
		//Riding name
		output += "<caption class=\"story-overline\">" + json[i].name + "</caption>";
		//Table head
		output += "<thead><tr>";
		output += "<th scope=\"col\">Name</th>";
		output += "<th scope=\"col\" class=\"alignRight\">Votes</th>";
		output += "<th scope=\"col\" class=\"alignRight\">Local</th>";
		output += "<th scope=\"col\" class=\"alignRight\">Overall</th>";
		output += "<th scope=\"col\">Elected</th>";
		output += "</thead></tr>";
		//Table body
		output += "<tbody>";
			//Loop Results
			for(var j = 0; j < json[i].results.length; j++){
				var totalVotes = '';
				output += "<tr ";
					switch(json[i].results[j].partyCode){
						case "NDP":
							output += "class=\"orange\"";
							break;
						case "PC":
							output += "class=\"blue\"";
							break;
						case "GRN":
							output += "class=\"green\"";
							break;
						case "LIB":
							output += "class=\"red\"";
							break;
						default:
							output += "class=\"gray\"";
							break;
					}
				//Name
				output += "><th scope=\"row\">" + json[i].results[j].name + "</th>";
				//Total Votes
				output += "<td>" + json[i].results[j].votes; + "</td>";
				//Calculate Local Percentage
				output += "<td>" + (json[i].results[j].votes * 100 / json[i].ridingVotes).toFixed(2) + "%</td>";
				//Calculate Overall Percentage
				output += "<td>" + (json[i].results[j].votes * 100 / json.totalVotes).toFixed(2) + "%</td>";
				//if Elected, place a checkmark
				if(json[i].results[j].isElected){
					output += "<td class=\"elected\">&#9745;</td>";
				}
				else{
					output += "<td></td>";
				}
				output += "</tr>";
			};
		output += "</tbody></table>";
		output += "</li>";
	}
	//append content
	$(".slides").html(output);
});
$(window).load(function(){
  $('.flexslider').flexslider({
    animation: "slide",
    animationLoop: true,
    slideshow: false,
    itemWidth: "100%",
    prevText:"",
    nextText:"",
    itemMargin: 5,
    start: function(slider){
      $('body').removeClass('loading');
    }
  });
});