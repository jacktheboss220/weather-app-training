//-------------------------------------------------------------------------------------------------------------//
var getlocation = document.querySelector('.getlocation');
getlocation.style.display = "flex"
var weather = document.querySelector('.weather');
var loc = document.querySelector(".form-control");
var city = document.querySelector("#city");
var btn = document.querySelector(".fs-5.btn.btn-secondary");
var date = document.querySelector('#date');
var update = document.querySelector('.loading');
//-------------------------------------------------------------------------------------------------------------//
const weatherUrl = "https://api.openweathermap.org/data/2.5/";
const apiKey = "&appid=17b2aa06e2fc32be5d7db17960eb8f30";

//-------------------------------------------------------------------------------------------------------------//
let temp = document.querySelector('.weather .numb');
let weType = document.querySelector('.weType');
let weLocation = document.querySelector('.weLocation span');
let feeltemp = document.querySelector('.feels .temp1 .numb');
let humidity = document.querySelector('.humidity .numb');
let windSpeed = document.querySelector('.speed');
//-------------------------------------------------------------------------------------------------------------//

//-------------------------------------------------------------------------------------------------------------//
btn.addEventListener('click', () => {
    update.style.display = "flex";
    update.innerHTML = "Getting Location.....";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(response, error);
    }
    else {
        getWeatherByName("Delhi");
    }
})

//-------------------------------------------------------------------------------------------------------------//

function response(res) {
    const { latitude, longitude } = res.coords;
    const todayWeather = weatherUrl + `weather?lat=${latitude}&lon=${longitude}&units=metric` + apiKey;
    fetch(todayWeather).then(r => {
        r.json().then(rr => {
            newApi(rr.name);
        })
    })
}

//-------------------------------------------------------------------------------------------------------------//

city.addEventListener('keydown', res => {
    if (res.key == "Enter" && city.value != "") {
        getWeatherByName(city.value);
    }
})

function getWeatherByName(name) {
    name = name.trim();
    update.style.display = "flex";
    update.innerHTML = "Getting Location.....";
    newApi(name);
}
//-------------------------------------------------------------------------------------------------------------//

function newApi(city) {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next7days?unitGroup=metric&include=days%2Ccurrent&key=HVBQXSJ9ZPRMSUZJXEHSXS2CP&contentType=json`).then(r => {
        r.json().then(res => {
            setTimeout(() => {
                date.innerText = res.days[0].datetime;
                temp.innerText = res.days[0].temp;
                weType.innerText = res.days[0].conditions;
                weLocation.innerText = res.resolvedAddress;
                feeltemp.innerText = res.days[0].feelslike;
                humidity.innerText = res.days[0].humidity + "%";
                windSpeed.innerText = res.days[0].windspeed;
                getlocation.style.display = "none";
                weather.style.display = "flex"
            }, 3000)
        })
    })
}
function error(err) {
    loc.value = "Location Permission Denied, Taking Delhi as Default.";
    getWeatherByName("delhi");
}
document.querySelector('.temp').addEventListener('click', r => {
    let mcel = document.getElementById('mainTemp');
    let mdeg = document.getElementById('mainDeg');
    let scel = document.getElementById('secTemp');
    let sdeg = document.getElementById('secDeg');
    console.log(mcel, mdeg, scel, sdeg);
})