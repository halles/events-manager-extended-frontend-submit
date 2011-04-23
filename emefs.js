var j_emefs_ajax_url = "/wp-content/plugins/events-manager-extended/locations-search.php";

$j_eme_loc=jQuery.noConflict();

$j_eme_loc(document).ready(function() {

	function htmlDecode(value){
		return $j_eme_loc('<div/>').html(value).text(); 
	}

	var gmap_enabled = 1; 

	$j_eme_loc("input#location_name").autocomplete(j_emefs_ajax_url, {
		width: 260,
		selectFirst: false,
		formatItem: function(row) {
			item = eval("(" + row + ")");
			return htmlDecode(item.name)+'<br /><small>'+htmlDecode(item.address)+' - '+htmlDecode(item.town)+ '</small>';
		},
		formatResult: function(row) {
			item = eval("(" + row + ")");
			return htmlDecode(item.name);
		} 
	});
	
	$j_eme_loc('input#location_name').result(function(event,data,formatted) {
		item = eval("(" + data + ")"); 
		$j_eme_loc('input#location_address').val(item.address);
		$j_eme_loc('input#location_town').val(item.town);
		if(gmap_enabled) {
		   eventLocation = $j_eme_loc("input#location_name").val(); 
		   eventTown = $j_eme_loc("input#location_town").val(); 
		   eventAddress = $j_eme_loc("input#location_address").val();
		   loadMap(eventLocation, eventTown, eventAddress)
		} 
	});
	
});

function loadMap(location, town, address){
	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
		zoom: 13,
		center: latlng,
		scrollwheel: true,
		disableDoubleClickZoom: true,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	
	var map = new google.maps.Map(document.getElementById("event-map"), myOptions);
	var geocoder = new google.maps.Geocoder();
	
	if (address !="") {
		searchKey = address + ", " + town;
	} else {
		searchKey =  location + ", " + town;
	}
	
	geocoder.geocode({'address': searchKey}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
      		map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			var infowindow = new google.maps.InfoWindow({
				content: '<div class="eme-location-balloon"><strong>' + location +'</strong><p>' + address + '</p><p>' + town + '</p></div>'
      		});
			infowindow.open(map,marker);
			$j_eme_loc('input#location_latitude').val(results[0].geometry.location.lat());
			$j_eme_loc('input#location_longitude').val(results[0].geometry.location.lng());
			$j_eme_loc("#event-map").show();
		} else {
			$j_eme_loc("#event-map").hide();
		}
	});
	
}