//necessary to avoid scoping issues with community areas layer
var geojson;

//defines how community areas look when left alone
function style(feature) {
	return {
	fillColor: '#08519c',
	weight: 3,//outline thickness
	opacity: 1,//outline opacity
	color: '#6baed6',//outline color
	dashArray: '3',//dashed outline value
	fillOpacity: 0.2
	};
}//end function style(feature)

//function to highlight a community area on mouseover, similar fields to above function
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 4,
		color: '#08306b',
		dashArray: '',
		fillOpacity: 0.5
	});
	//resolves issues with IE and Opera
	if(!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
	//update info panel with name of community area on mouseover
	info.update(layer.feature.properties);
}//end highlight community area on mouseover function

//function to reset highlighting of community area on mouseout
function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

//zoom to community area on click
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

//do all "this stuff" for each community area
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}//end function onEachFeature

//actually load in the community areas geojson file
geojson = L.geoJson(community_areas, {
	style: style,
	onEachFeature:onEachFeature
});

//options for info panel control
var infoControlOptions = {
	position: 'topleft'
}

//control that shows community area info on hover
var info = L.control(infoControlOptions);

//creates info control
info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function(props) {
	this._div.innerHTML = '<h4>Community Area:</h4>' + (props ?
	'<b>' + props.name + '</b><br />'
	: 'Hover over a community area.');
};

//mapbox street tiles with proper attribution and max zoom level.
//max zoom set to 18 because it's the greatest zoom level where everything shows
var street_map = L.tileLayer('http://{s}.tiles.mapbox.com/v3/nizobe.jn4og4o6/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18
});//.addTo(map);

//satellite imagery tile layer
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});//end satellite imagery tile layer

//street and road labels overlay
var Hydda_RoadsAndLabels = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/roads_and_labels/{z}/{x}/{y}.png', {
	minZoom: 0,
	maxZoom: 18,
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});//end street and road labels overlay

//leaflet layerGroup to hold divvy station markers
var stations = L.layerGroup();

//markercluster to hold divvy stations
var markers = new L.MarkerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	zoomToBoundsOnClick: true,
});

//loop through .csv and add divvy stations to the statiosn layerGroup
d3.csv("Divvy_Bicycle_Stations.csv", function(station_list) {
	for(var i = 0; i < station_list.length; i++)
	{
		var station_name = station_list[i].StationName;
		var station_lat = station_list[i].Latitude;
		var station_lon = station_list[i].Longitude;

		//add to the layerGroup
		//marker = new L.marker([station_lat, station_lon]).bindPopup(station_name).openPopup().addTo()
		stations.addLayer(L.marker([station_lat, station_lon]).bindPopup(station_name).openPopup());

		//add to the markerClusterGroup
		markers.addLayer(L.marker([station_lat, station_lon]).bindPopup(station_name).openPopup());
	}//end for loop through .csv file of divvy station locations
});//end D3 import of divvy station .csv file

//make a map with anchor lat,lon and zoom level
var map = L.map('map', {
	center: [41.86968865729827, -87.64699459075926],
	zoom: 11,
	layers: [street_map, Esri_WorldImagery]
});//.setView([41.86968865729827, -87.64699459075926], 13);

/*mutually exclusive base map layers
it seems that the last layer in the list is the default layer
caveat: satellite (second option on control widget) is checked by default,
even though the street maps layer is displaed by default */
var baseMaps = {
	//"Street Map": street_map,
	"Satellite": Esri_WorldImagery,
	"Street Map": street_map
};

//toggle-able overlays. visible name : variable name
var overlayMaps = {
	"Divvy Stations": stations,
	"Streets (for use with satellite map)": Hydda_RoadsAndLabels,
	"Community Areas": geojson
	//"MARKER CLUSTER": markers
	//"CA Info": info
	//"Community Areas": communitiesLayer
	//"Community Areas": community_areas
};

//option(s) for layer control widget
var layerControlOptions = {
	position: 'topleft'
}

//adds layer toggle control to the map in top right
L.control.layers(baseMaps, overlayMaps, layerControlOptions).addTo(map);

//adds a scale meter to map; defaults to bottom left
L.control.scale().addTo(map);

//adds info panel with name of community area to map
info.addTo(map);