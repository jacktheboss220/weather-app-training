/** 
 * @author jacktheboss220 
 * @description script file for weather webapp
 * 
*/

//-------------------------------------------------------------------------------------------------------------//
const getlocation = document.querySelector('.getlocation');
getlocation.style.display = "flex"
const weather = document.querySelector('.weather');
const loc = document.querySelector(".form-control");
const city = document.querySelector("#city");
const btn = document.querySelector(".fs-5.btn.btn-secondary");
const date = document.querySelector('#date');
const update = document.querySelector('.loading');
const box = document.querySelector('.box');
const forecast = document.querySelectorAll('.forecast');
const image = document.getElementById('weImage');
//-------------------------------------------------------------------------------------------------------------//
const weatherBit = "https://api.weatherbit.io/v2.0/forecast/daily?days=7&key=257d1d4650dc4ddb891505e70c2c6c8d";
//-------------------------------------------------------------------------------------------------------------//
const temp = document.querySelector('.weather .numb');
const weType = document.querySelector('.weType');
const weLocation = document.querySelector('.weLocation span');
const feeltemp = document.querySelector('.feels .temp1 .numb');
const humidity = document.querySelector('.humidity .numb');
const windSpeed = document.querySelector('.speed');
//-------------------------------------------------------------------------------------------------------------//

//-------------------------------------------------------------------------------------------------------------//
btn.addEventListener('click', () => {
    update.style.display = "flex";
    update.innerHTML = "Getting Location.....";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(response, error);
    }
    else {
        setTimeout(() => {
            getWeatherByName("Delhi");
        }, 4000);
    }
})
//-------------------------------------------------------------------------------------------------------------//

function response(res) {
    const { latitude, longitude } = res.coords;
    const todayWeather = weatherBit + `&lat=${latitude}&lon=${longitude}`;
    fetch(todayWeather).then(r => {
        r.json().then(rr => {
            newApi(rr.city_name, res.coords);
        })
    }).catch(err => {
        update.innerHTML = "Failed to get location....setting delhi as default location..";
        setTimeout(() => {
            getWeatherByName("Delhi");
        }, 4000);
    })
}

//-------------------------------------------------------------------------------------------------------------//

city.addEventListener('keydown', res => {
    if (res.key == "Enter" && city.value != "") {
        getWeatherByName(city.value);
    }
})
//-------------------------------------------------------------------------------------------------------------//
function getWeatherByName(name) {
    name = name.trim();
    update.style.display = "flex";
    update.innerHTML = "Getting Location.....";
    newApi(name);
}
//-------------------------------------------------------------------------------------------------------------//
weatherType = ["clear", "cloud", "haze", "rain", "snow", "storm"];
function newApi(city, loca) {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next7days?unitGroup=metric&include=days%2Ccurrent&key=HVBQXSJ9ZPRMSUZJXEHSXS2CP&contentType=json`).then(r => {
        if (r.status != 400) {
            r.json().then(res => {
                setTimeout(() => {
                    date.innerText = res.days[0].datetime;
                    temp.innerText = res.days[0].temp;
                    weType.innerText = res.days[0].conditions;
                    weatherType.forEach(ele => {
                        if (res.days[0].conditions.toLowerCase().includes(ele)) {
                            image.src = `./Weather Icons/${ele}.svg`
                        }
                    })
                    weLocation.innerText = res.resolvedAddress;
                    feeltemp.innerText = res.days[0].feelslike;
                    humidity.innerText = res.days[0].humidity + "%";
                    windSpeed.innerText = res.days[0].windspeed;
                    for (let i = 1; i <= 6; i++) {
                        document.getElementById("dateId" + i).innerText = res.days[i].datetime;
                        document.getElementById("tempId" + i).innerText = res.days[i].temp + '°C';
                    };
                    getlocation.style.display = "none";
                    weather.style.display = "flex";
                    forecast.forEach(ele => {
                        ele.style.display = "flex";
                    }, 3000)
                })
            })
        }
        else {
            const todayWeather = weatherBit + `&city=${city}`;
            fetch(todayWeather).then(r => {
                r.json().then(res => {
                    setTimeout(() => {
                        date.innerText = res.data[0].datetime;
                        temp.innerText = res.data[0].temp;
                        weType.innerText = res.data[0].weather.description;
                        weatherType.forEach(ele => {
                            if (res.data[0].weather.description.toLowerCase().includes(ele)) {
                                image.src = `./Weather Icons/${ele}.svg`
                            }
                        })
                        weLocation.innerText = res.city_name;
                        feeltemp.innerText = res.data[0].app_max_temp;
                        humidity.innerText = res.data[0].rh + "%";
                        windSpeed.innerText = res.data[0].wind_spd;
                        for (let i = 1; i <= 6; i++) {
                            document.getElementById("dateId" + i).innerText = res.data[i].datetime;
                            document.getElementById("tempId" + i).innerText = res.data[i].temp + '°C';
                        };
                        getlocation.style.display = "none";
                        weather.style.display = "flex";
                        forecast.forEach(ele => {
                            ele.style.display = "flex";
                        })
                    }, 3000);
                }).catch(err => {
                    if (loca) {
                        const { latitude, longitude } = loca;
                        const todayWeather = weatherBit + `&lat=${latitude}&lon=${longitude}`;
                        fetch(todayWeather).then(r => {
                            r.json().then(res => {
                                setTimeout(() => {
                                    date.innerText = res.data[0].datetime;
                                    temp.innerText = res.data[0].temp;
                                    weType.innerText = res.data[0].weather.description;
                                    weatherType.forEach(ele => {
                                        if (res.data[0].weather.description.toLowerCase().includes(ele)) {
                                            image.src = `./Weather Icons/${ele}.svg`
                                        }
                                    })
                                    weLocation.innerText = res.city_name;
                                    feeltemp.innerText = res.data[0].app_max_temp;
                                    humidity.innerText = res.data[0].rh + "%";
                                    windSpeed.innerText = res.data[0].wind_spd;
                                    for (let i = 1; i <= 6; i++) {
                                        document.getElementById("dateId" + i).innerText = res.data[i].datetime;
                                        document.getElementById("tempId" + i).innerText = res.data[i].temp + '°C';
                                    };
                                    getlocation.style.display = "none";
                                    weather.style.display = "flex";
                                    forecast.forEach(ele => {
                                        ele.style.display = "flex";
                                    })
                                }, 3000);
                            })
                        })
                    }
                })
            })
        }
    }).catch(err => {
        update.innerHTML = "Failed to get the weather update for the current location taking Delhi as default.."
        setTimeout(() => {
            getWeatherByName("Delhi");
        }, 4000);

    })
}
//-------------------------------------------------------------------------------------------------------------//
function error(err) {
    update.innerText = "Location Permission Denied, Taking Delhi as Default.";
    setTimeout(() => {
        getWeatherByName("Delhi");
    }, 4000);
}
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
document.querySelector('.temp').addEventListener('click', r => {
    let mcel = document.getElementById('mainTemp');
    let mdeg = document.getElementById('mainDeg');
    if (mdeg.innerText.includes('C')) {
        mcel.innerText = ((Number(mcel.innerText) * 9 / 5) + 32).toFixed(2);
        mdeg.innerText = ` °F`
    } else {
        mcel.innerText = ((Number(mcel.innerText) - 32) * 5 / 9).toFixed(2);
        mdeg.innerText = ` °C`
    }
})
//-------------------------------------------------------------------------------------------------------------//
document.querySelector('.temp1').addEventListener('click', r => {
    let scel = document.getElementById('secTemp');
    let sdeg = document.getElementById('secDeg');
    if (sdeg.innerText.includes('C')) {
        scel.innerText = ((Number(scel.innerText) * 9 / 5) + 32).toFixed(2);
        sdeg.innerText = ` °F`
    } else {
        scel.innerText = ((Number(scel.innerText) - 32) * 5 / 9).toFixed(2);
        sdeg.innerText = ` °C`
    }
})
//-------------------------------------------------------------------------------------------------------------//