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

// function and vaiables to pull in geo coordinates
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


// variables for querying hiking project
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
            // var imageURL = hikeResponse.trails[i].imgSmallMed;
            console.log(imageURL);


            var newRow = ("<tr>" +
                "<td>" + hikeResponse.trails[i].name + "</td>" +
                "<td>" + hikeResponse.trails[i].difficulty + "</td>" +
                "<td>" + hikeResponse.trails[i].summary + "</td>" +
                "<td>" + aLink + "</td>" +
                "</tr>");
            $("#trailinfo").append(newRow);

            // dataPoint.ref().push({
            //     imageURL: imageURL
            // });
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
// START HERE JORDAN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    // zipCodeCall();
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
    console.log(snapshot.val().userComments);
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

// dataPoint.ref().on("child_added", function (snapshot) {
//     console.log(snapshot.val().userComments);
//     var reviewRow = ("<tr>" +
//                 "<td>" + trailName + "</td>" +
//                 "<td>" + reviewDate + "</td>" +
//                 "<td>" + userComments + "</td>" +
//                 "</tr>");
//             $("#loadComments").append(reviewRow);
// });