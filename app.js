var x = document.getElementsByTagName("body");


var browserLatitude = 0;
var browserLongitude = 0;
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    browserLatitude = position.coords.latitude;
    browserLongitude = position.coords.longitude;
    console.log("lati " + browserLatitude);
    console.log("long " + browserLongitude);
}

getLocation();


var radius = 0;
var zipCode = 0;
var length = 0;
var keyword = "";

$("#submit").on("click", function (event) {
    event.preventDefault();
    radius = $("#radius").val().trim();
    zipCode = $("#zipCode").val().trim();
    length = $("#length").val().trim();
    keyword = $("#description").val().trim();
    // i need to figure out how to only pull variables if there is a value in the input field. Otherwise I think there will be an issue.
    hikProjURL = "https://www.hikingproject.com/data/get-trails?lat=" + browserLatitude + "&lon=" + browserLongitude + "&maxDistance=" + radius +"&key=200226856-004010f8710083cf453ba71820f6e7f4";

    $.ajax({
        url: hikProjURL,
        method: "GET"
    }).then(function(response){
        console.log(response.trails);
        for (let i = 0; i < response.trails.length; i++) {
            var trailLink = response.trails[i].url;
            var aLink = "<a href='"+trailLink+"'target='_blank'>"+trailLink+"</a>";

            var newRow = ("<tr>" +
            "<td>" + response.trails[i].name + "</td>" +
            "<td>" + response.trails[i].difficulty + "</td>" +
            "<td>" + response.trails[i].summary + "</td>" +
            "<td>" + aLink + "</td>" +
            "</tr>");
            $("#trailinfo").append(newRow);
        }

    });


});
