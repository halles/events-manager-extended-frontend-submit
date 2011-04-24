var emefs_page = 0;
var emefs_autocomplete_url = "/wp-content/plugins/events-manager-extended/locations-search.php";
var emefs_gmap_enabled = 1;

var emefs_autocomplete_options = {
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
};

function htmlDecode(value){
	return jQuery('<div/>').html(value).text(); 
}

function emefs_deploy() {

	jQuery("input#location_name").autocomplete(emefs_autocomplete_url, emefs_autocomplete_options);
	
	jQuery('input#location_name').result(function(event,data,formatted) {
		item = eval("(" + data + ")"); 
		jQuery('input#location_address').val(item.address);
		jQuery('input#location_town').val(item.town);
		if(emefs_gmap_enabled) {
		   eventLocation = jQuery("input#location_name").val(); 
		   eventTown = jQuery("input#location_town").val(); 
		   eventAddress = jQuery("input#location_address").val();
		   emefs_loadMap(eventLocation, eventTown, eventAddress)
		} 
	});
	
	jQuery("#event_start_date, #event_end_date").datepicker({ dateFormat: 'yy-mm-dd' });
	jQuery('#event_start_time, #event_end_time').timeEntry({ hourText: 'Hour', minuteText: 'Minute', show24Hours: true, spinnerImage: '' });	
	
}

function emefs_loadMap(location, town, address){

	var emefs_mapCenter = new google.maps.LatLng(-34.397, 150.644);
	var emefs_map = false;
	
	var emefs_mapOptions = {
		zoom: 12,
		center: emefs_mapCenter,
		scrollwheel: true,
		disableDoubleClickZoom: true,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	var emefs_geocoder = new google.maps.Geocoder();
	
	if (address !="") {
		searchKey = address + ", " + town;
	} else {
		searchKey =  location + ", " + town;
	}
	
	emefs_geocoder.geocode({'address': searchKey}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			jQuery("#event-map").slideDown('fast',function(){
				if(!emefs_map){
					var emefs_map = new google.maps.Map(document.getElementById("event-map"), emefs_mapOptions);
				}
				emefs_map.setCenter(results[0].geometry.location);
				var emefs_marker = new google.maps.Marker({
					map: emefs_map,
					position: results[0].geometry.location
				});
				var emefs_infowindow = new google.maps.InfoWindow({
					content: '<strong>' + location +'</strong><p>' + address + '</p><p>' + town + '</p>'
	      		});
				emefs_infowindow.open(emefs_map,emefs_marker);
				jQuery('input#location_latitude').val(results[0].geometry.location.lat());
				jQuery('input#location_longitude').val(results[0].geometry.location.lng());
			});
		} else {
			jQuery("#event-map").slideUp();
		}
	});
	
}