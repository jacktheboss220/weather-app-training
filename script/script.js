//-------------------------------------------------------------------------------------------------------------//
var getlocation = document.querySelector('.getlocationbox');
var weatherbox = document.querySelector('.weather');
var loc = document.querySelector(".form-control");
var city = document.querySelector("#city");
var btn = document.querySelector(".fs-5.btn.btn-secondary");
var update = document.querySelector('.loading');
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

const weatherUrl = "https://api.openweathermap.org/data/2.5/";
const apiKey = "&appid=17b2aa06e2fc32be5d7db17960eb8f30";

//-------------------------------------------------------------------------------------------------------------//
let temp = document.querySelector('.weather .numb');
let weType = document.querySelector('.weType');
let weLocation = document.querySelector('.weLocation span');
let feeltemp = document.querySelector('.feels .temp .numb');
let humidity = document.querySelector('.humidity .numb');
//-------------------------------------------------------------------------------------------------------------//

btn.addEventListener('click', () => {
    update.style.display = "flex";
    update.innerHTML = "Getting Location.....";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(response, error);
    }
    else {
        alert("GeoLocation is not supported by your Bowers. Please try opening in different one.")
    }
})

//-------------------------------------------------------------------------------------------------------------//

function response(res) {
    const { latitude, longitude } = res.coords;
    const todayWeather = weatherUrl + `weather?lat=${latitude}&lon=${longitude}&units=metric` + apiKey;
    const forecastWeather = weatherUrl + `forecast/daily?lat=${latitude}&lon=${longitude}&cnt=7&units=metric` + apiKey;
    fetch(todayWeather).then(r => {
        r.json().then(rr => {
            setTimeout(() => {
                temp.innerText = rr.main.temp;
                weType.innerText = rr.weather[0].description;
                weLocation.innerText = rr.name;
                feeltemp.innerText = rr.main.feels_like;
                humidity.innerText = rr.main.humidity + "%";
                getlocation.style.display = "none";
                weatherbox.style.display = "flex"
            }, 5000);
        })
    })
}

//-------------------------------------------------------------------------------------------------------------//

city.addEventListener('keydown', res => {
    if (res.key == "Enter" && city.value != "") {
        update.style.display = "flex";
        update.innerHTML = "Getting Location.....";
        const todayWeather = weatherUrl + `weather?q=${city.value}&units=metric` + apiKey;
        const forecastWeather = weatherUrl + `forecast/daily?q=${city.value}&cnt=7&units=metric` + apiKey;
        fetch(todayWeather).then(res => {
            res.json().then(rr => {
                setTimeout(() => {
                    temp.innerText = rr.main.temp;
                    weType.innerText = rr.weather[0].description;
                    weLocation.innerText = rr.name;
                    feeltemp.innerText = rr.main.feels_like;
                    humidity.innerText = rr.main.humidity + "%";
                    getlocation.style.display = "none";
                    weatherbox.style.display = "flex"
                }, 5000);
            })
        })
    }
})

//-------------------------------------------------------------------------------------------------------------//

function error(err) {
    loc.value = err.message
}
document.querySelector('.temp').addEventListener('click', r => {

    let mcel = document.getElementById('mainTemp');
    let mdeg = document.getElementById('mainDeg');
    let scel = document.getElementById('secTemp');
    let sdeg = document.getElementById('secDeg');
    console.log(mcel, mdeg, scel, sdeg);
})