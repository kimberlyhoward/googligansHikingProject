var x = document.getElementsByTagName("body");
$(document).ready(function() {
// firebase info
var config = {
    apiKey: "AIzaSyDlQ2kWC8Qw9S5xG-R2ZxMjv1BlWELtEiM",
    authDomain: "bigclassproject-bc504.firebaseapp.com",
    databaseURL: "https://bigclassproject-bc504.firebaseio.com",
    storageBucket: "bigclassproject-bc504.appspot.com",
};

firebase.initializeApp(config);
var dataPoint = firebase.database();
var date = "mm/dd/yyyy";
var comments = "";
var trailName = "";
var imageURL = "";

//****this was script to use browsers lat/lon but no longer needed. worked to hard to delete this business though haha****

// var browserLatitude = 0;
// var browserLongitude = 0;
// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         console.log("Geolocation is not supported by this browser.");
//     }
// }

// function showPosition(position) {
//     browserLatitude = position.coords.latitude;
//     browserLongitude = position.coords.longitude;
//     console.log("lati " + browserLatitude);
//     console.log("long " + browserLongitude);
// }
// getLocation();




// variables for querying hiking project
var radius = 0;
var zipCode = 0;
var length = 0;
var keyword = "";

// declared function for hiking project AJAX call. this is called in the zip code converter function. 
function hikeProjCall() {
    hikProjURL = "https://www.hikingproject.com/data/get-trails?lat=" + inputLatitude + "&lon=" + inputLongitude + "&maxDistance=" + radius + "&key=200226856-004010f8710083cf453ba71820f6e7f4";

    $.ajax({
        url: hikProjURL,
        method: "GET"
    }).then(function (hikeResponse) {
        // console.log(hikeResponse.trails);
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

var inputLatitude = 0;
var inputLongitude = 0;

// start of function to grab zip code
function zipCodeCall() {
    var zipCodeURL = "https://www.zipcodeapi.com/rest/lEMVNatPFx8EP1VM02BUKkuPxeFaaq5qdClcC1TtmYAVm8WTHW7gEY4y9edYk5i3/info.json/" + zipCode + "degrees";

    $.ajax({
        url: zipCodeURL,
        method: "GET"

    }).then(function (zipResponse) {
        inputLatitude = zipResponse.lat;
        inputLongitude = zipResponse.lng;

        // hiking call placed here so that zip code conversion to lat/lon will load first and the GET call for hiking project will work.
        hikeProjCall();
    });
};
// end of function to grab zip code


// start of weather forecast
// START HERE JORDAN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function weatherCall() {
    var weatherURL = "http://api.wunderground.com/api/bc660f73e252f941/forecast/q/" + zipCode + ".json"


    $.ajax({
        url: weatherURL,
        method: "GET"

    }).then(function (weatherResponse) {
        for (let i = 0; i < weatherResponse.forecast.simpleforecast.forecastday.length
            ; i++) {

            // day
            var day = weatherResponse.forecast.simpleforecast.forecastday[i].date.weekday;
            // text to use for weather icon
            var iconText = weatherResponse.forecast.simpleforecast.forecastday[i].icon;
            // weather icon URL
            var iconURL = "https://icons.wxug.com/i/c/k/" + iconText + ".gif";
            // high temp
            var highTemp = weatherResponse.forecast.simpleforecast.forecastday[i].high.fahrenheit;
            // low temp
            var lowTemp = weatherResponse.forecast.simpleforecast.forecastday[i].low.fahrenheit;


            // this is where the forecast divs are assembled
            var weatherDiv = $("<div> class = 'weatherDiv'");
            console.log("1st" + weatherDiv);
            // day of the week is appended
            var dayText = $("<p>").text(day);
            weatherDiv.append(dayText);
            console.log("2nd" + weatherDiv);
            // weather icon is appended
            var iconImage = $("<img>").attr("src", iconURL);

            weatherDiv.append(iconImage);
            console.log("3rd" + weatherDiv);
            // high and low temps are appended
            var tempsHighLow = $("<p>").text(highTemp+ "/" + lowTemp);
            weatherDiv.append(tempsHighLow);
            console.log("4th" + weatherDiv);
            
            // newly created weather div is appended to the page
            $(".weatherArea").append(weatherDiv);


        }
    });
}


// event handler that triggers the 3 GET calls
$("#submit").on("click", function (event) {
    event.preventDefault();
    radius = $("#radius").val().trim();
    zipCode = $("#zipCode").val().trim();
    length = $("#length").val().trim();
    keyword = $("#description").val().trim();
    zipCodeCall();
    weatherCall();
});
$("#submitReview").on("click", function() {
    event.preventDefault();
    var userComments = $("#comments").val().trim();
    var reviewDate = $("#reviewDate").val();
    var trailName = $("#trailName").val().trim();
    dataPoint.ref().push({
        userComments: userComments,
        reviewDate: reviewDate,
        trailName: trailName,
    });
    console.log(trailName, reviewDate, userComments);
//    dataPoint.ref().on("child_added", function (snapshot) {
//     console.log(snapshot.val().imageURL);
//     var hikeImg = $("<img>");
//     hikeImg.attr("src", snapshot.val().imageURL);
//     hikeImg.attr("alt", "Image from the Hike");
//     $("#imageDiv").html(hikeImg);
});
dataPoint.ref().on("child_added", function (snapshot) {
    trailName = (snapshot.val().trailName);
    reviewDate = (snapshot.val().reviewDate);
    userComments = (snapshot.val().userComments);
    var reviewRow = ("<tr>" +
                "<td>" + trailName + "</td>" +
                "<td>" + reviewDate + "</td>" +
                "<td>" + userComments + "</td>" +
                "</tr>");
            $("#loadComments").append(reviewRow);
});
});