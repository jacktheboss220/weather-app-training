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
// Additional weather elements
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uvIndex');
const pressure = document.getElementById('pressure');
const cloudCover = document.getElementById('cloudCover');
const dewPoint = document.getElementById('dewPoint');
const lastUpdated = document.getElementById('lastUpdated');
//-------------------------------------------------------------------------------------------------------------//

//-------------------------------------------------------------------------------------------------------------//
// Helper function to format time
function formatTime(timestamp) {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Helper function to get UV Index class
function getUVClass(uv) {
    if (uv < 3) return 'uv-low';
    if (uv < 6) return 'uv-moderate';
    if (uv < 8) return 'uv-high';
    if (uv < 11) return 'uv-very-high';
    return 'uv-extreme';
}

// Helper function to get weather emoji
function getWeatherEmoji(condition) {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('storm') || lower.includes('thunder')) return '⛈️';
    if (lower.includes('haze') || lower.includes('fog')) return '🌫️';
    return '🌤️';
}
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
                    
                    // Populate additional weather details
                    sunrise.innerText = formatTime(res.days[0].sunriseEpoch);
                    sunset.innerText = formatTime(res.days[0].sunsetEpoch);
                    visibility.innerText = res.days[0].visibility ? res.days[0].visibility + ' km' : 'N/A';
                    
                    const uv = res.days[0].uvindex || 0;
                    uvIndex.innerText = uv;
                    uvIndex.className = 'detail-value ' + getUVClass(uv);
                    
                    pressure.innerText = res.days[0].pressure ? res.days[0].pressure + ' mb' : 'N/A';
                    cloudCover.innerText = res.days[0].cloudcover ? res.days[0].cloudcover + '%' : 'N/A';
                    dewPoint.innerText = res.days[0].dew ? res.days[0].dew + '°C' : 'N/A';
                    
                    // Update last updated time
                    const now = new Date();
                    lastUpdated.innerText = 'Last updated: ' + now.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    });
                    
                    // Update forecast with weather icons
                    for (let i = 1; i <= 6; i++) {
                        const emoji = getWeatherEmoji(res.days[i].conditions);
                        document.getElementById("dateId" + i).innerText = res.days[i].datetime;
                        document.getElementById("tempId" + i).innerHTML = 
                            `<div class="weather-icon">${emoji}</div>` +
                            `<div>${res.days[i].temp}°C</div>` +
                            `<div class="temp-range" style="font-size: 12px; color: #999;">` +
                            `<span>↓${res.days[i].tempmin}°</span> <span>↑${res.days[i].tempmax}°</span>` +
                            `</div>`;
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
                        
                        // Populate additional weather details from weatherBit
                        sunrise.innerText = formatTime(res.data[0].sunrise_ts);
                        sunset.innerText = formatTime(res.data[0].sunset_ts);
                        visibility.innerText = res.data[0].vis ? res.data[0].vis + ' km' : 'N/A';
                        
                        const uv = res.data[0].uv || 0;
                        uvIndex.innerText = uv.toFixed(1);
                        uvIndex.className = 'detail-value ' + getUVClass(uv);
                        
                        pressure.innerText = res.data[0].pres ? res.data[0].pres + ' mb' : 'N/A';
                        cloudCover.innerText = res.data[0].clouds ? res.data[0].clouds + '%' : 'N/A';
                        dewPoint.innerText = res.data[0].dewpt ? res.data[0].dewpt + '°C' : 'N/A';
                        
                        const now = new Date();
                        lastUpdated.innerText = 'Last updated: ' + now.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                        });
                        
                        for (let i = 1; i <= 6; i++) {
                            const emoji = getWeatherEmoji(res.data[i].weather.description);
                            document.getElementById("dateId" + i).innerText = res.data[i].datetime;
                            document.getElementById("tempId" + i).innerHTML = 
                                `<div class="weather-icon">${emoji}</div>` +
                                `<div>${res.data[i].temp}°C</div>` +
                                `<div class="temp-range" style="font-size: 12px; color: #999;">` +
                                `<span>↓${res.data[i].min_temp}°</span> <span>↑${res.data[i].max_temp}°</span>` +
                                `</div>`;
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
                                    
                                    // Populate additional weather details
                                    sunrise.innerText = formatTime(res.data[0].sunrise_ts);
                                    sunset.innerText = formatTime(res.data[0].sunset_ts);
                                    visibility.innerText = res.data[0].vis ? res.data[0].vis + ' km' : 'N/A';
                                    
                                    const uv = res.data[0].uv || 0;
                                    uvIndex.innerText = uv.toFixed(1);
                                    uvIndex.className = 'detail-value ' + getUVClass(uv);
                                    
                                    pressure.innerText = res.data[0].pres ? res.data[0].pres + ' mb' : 'N/A';
                                    cloudCover.innerText = res.data[0].clouds ? res.data[0].clouds + '%' : 'N/A';
                                    dewPoint.innerText = res.data[0].dewpt ? res.data[0].dewpt + '°C' : 'N/A';
                                    
                                    const now = new Date();
                                    lastUpdated.innerText = 'Last updated: ' + now.toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        hour12: true 
                                    });
                                    
                                    for (let i = 1; i <= 6; i++) {
                                        const emoji = getWeatherEmoji(res.data[i].weather.description);
                                        document.getElementById("dateId" + i).innerText = res.data[i].datetime;
                                        document.getElementById("tempId" + i).innerHTML = 
                                            `<div class="weather-icon">${emoji}</div>` +
                                            `<div>${res.data[i].temp}°C</div>` +
                                            `<div class="temp-range" style="font-size: 12px; color: #999;">` +
                                            `<span>↓${res.data[i].min_temp}°</span> <span>↑${res.data[i].max_temp}°</span>` +
                                            `</div>`;
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