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

// declared function for hiking project AJAX call
function hikeProjCall() {
    hikProjURL = "https://www.hikingproject.com/data/get-trails?lat=" + browserLatitude + "&lon=" + browserLongitude + "&maxDistance=" + radius + "&key=200226856-004010f8710083cf453ba71820f6e7f4";

    $.ajax({
        url: hikProjURL,
        method: "GET"
    }).then(function (hikeResponse) {
        console.log(hikeResponse.trails);
        for (let i = 0; i < hikeResponse.trails.length; i++) {
            var trailLink = hikeResponse.trails[i].url;
            var aLink = "<a href='" + trailLink + "'target='_blank'>" + trailLink + "</a>";

            var newRow = ("<tr>" +
                "<td>" + hikeResponse.trails[i].name + "</td>" +
                "<td>" + hikeResponse.trails[i].difficulty + "</td>" +
                "<td>" + hikeResponse.trails[i].summary + "</td>" +
                "<td>" + aLink + "</td>" +
                "</tr>");
            $("#trailinfo").append(newRow);
        }

    });
};
// end of function for hiking project AJAX call



// start of function to grab zip code
function zipCodeCall() {
    var zipCodeURL = "https://www.zipcodeapi.com/rest/lEMVNatPFx8EP1VM02BUKkuPxeFaaq5qdClcC1TtmYAVm8WTHW7gEY4y9edYk5i3/info.json/" + zipCode + "degrees";

    $.ajax({
        url: zipCodeURL,
        method: "GET"

    }).then(function (zipResponse) {
        console.log(zipResponse.lat);
        console.log(zipResponse.lng);
    });
};
// end of function to grab zip code


// start of weather forecast
function weatherCall() {
    var weatherURL = "";
}


$("#submit").on("click", function (event) {
    event.preventDefault();
    radius = $("#radius").val().trim();
    zipCode = $("#zipCode").val().trim();
    length = $("#length").val().trim();
    keyword = $("#description").val().trim();
    hikeProjCall();
    zipCodeCall();
    weatherCall();

});
