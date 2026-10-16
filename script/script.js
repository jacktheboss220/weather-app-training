/**
 * @author jacktheboss220
 * @description script file for weather webapp
 *
*/

//-------------------------------------------------------------------------------------------------------------//
const API = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
// shortcut: key is public in client code, move behind a proxy (or rotate) before heavy use
const API_KEY = "HVBQXSJ9ZPRMSUZJXEHSXS2CP";
//-------------------------------------------------------------------------------------------------------------//
const $ = id => document.getElementById(id);
const getlocation = document.querySelector('.getlocation');
const weather = document.querySelector('.weather');
const city = $('city');
const btn = document.querySelector('.getlocationbox .btn');
const update = document.querySelector('.loading');
const forecast = document.querySelectorAll('.forecast');
const image = $('weImage');
const weType = document.querySelector('.weType');
const weLocation = document.querySelector('.weLocation span');
const humidity = document.querySelector('.humidity .numb');
const windSpeed = document.querySelector('.speed');
//-------------------------------------------------------------------------------------------------------------//
const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked: just don't remember */ } }
};
let unit = store.get('unit') === 'F' ? 'F' : 'C';
let data = null;   // last API response (metric); re-rendered when the unit changes
let label = "";    // friendly place name when we only have coordinates

// all API values are metric; convert only when displaying
const toUnit = c => unit === 'F' ? c * 9 / 5 + 32 : c;
const fmt = (c, d = 0) => toUnit(c).toFixed(d) + '°';
// times must use the searched city's timezone, not the browser's
const fmtTime = (epoch, o) => new Date(epoch * 1000).toLocaleTimeString('en-US', { timeZone: data.timezone, ...o });

const ICONS = { clear: 'clear', night: 'clear', cloud: 'cloud', rain: 'rain', snow: 'snow', storm: 'storm', fog: 'haze' };

// maps a Visual Crossing icon name (e.g. "partly-cloudy-night") to a theme key
function themeOf(icon) {
    if (/thunder/.test(icon)) return 'storm';
    if (/snow|hail|sleet/.test(icon)) return 'snow';
    if (/rain|shower/.test(icon)) return 'rain';
    if (/fog/.test(icon)) return 'fog';
    if (icon.endsWith('night')) return 'night';
    return /cloud|wind/.test(icon) ? 'cloud' : 'clear';
}

function emoji(icon) {
    if (/thunder/.test(icon)) return '⛈️';
    if (/snow|hail|sleet/.test(icon)) return '❄️';
    if (/rain|shower/.test(icon)) return '🌧️';
    if (/fog/.test(icon)) return '🌫️';
    if (/wind/.test(icon)) return '💨';
    if (/partly/.test(icon)) return icon.endsWith('night') ? '☁️' : '⛅';
    if (/cloud/.test(icon)) return '☁️';
    return icon.endsWith('night') ? '🌙' : '☀️';
}

function getUVClass(uv) {
    if (uv < 3) return 'uv-low';
    if (uv < 6) return 'uv-moderate';
    if (uv < 8) return 'uv-high';
    if (uv < 11) return 'uv-very-high';
    return 'uv-extreme';
}
//-------------------------------------------------------------------------------------------------------------//
function render() {
    const { currentConditions: c, days, timezone } = data;
    const theme = themeOf(c.icon);
    document.body.dataset.theme = theme;
    image.src = `./Weather Icons/${ICONS[theme]}.svg`;

    $('date').innerText = new Date(c.datetimeEpoch * 1000).toLocaleString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: timezone
    });
    $('mainTemp').innerText = toUnit(c.temp).toFixed(1);
    $('secTemp').innerText = toUnit(c.feelslike).toFixed(1);
    $('mainDeg').innerText = $('secDeg').innerText = '°' + unit;
    $('unitBtn').innerText = unit === 'C' ? 'Switch to °F' : 'Switch to °C';
    weType.innerText = c.conditions;
    weLocation.innerText = label || data.resolvedAddress;
    humidity.innerText = Math.round(c.humidity) + '%';
    windSpeed.innerText = c.windspeed;

    const sun = c.sunriseEpoch ? c : days[0];
    $('sunrise').innerText = fmtTime(sun.sunriseEpoch, { hour: 'numeric', minute: '2-digit' });
    $('sunset').innerText = fmtTime(sun.sunsetEpoch, { hour: 'numeric', minute: '2-digit' });
    $('visibility').innerText = c.visibility != null ? c.visibility + ' km' : 'N/A';
    const uv = c.uvindex || 0;
    $('uvIndex').innerText = uv;
    $('uvIndex').className = 'detail-value ' + getUVClass(uv);
    $('pressure').innerText = c.pressure ? c.pressure + ' mb' : 'N/A';
    $('cloudCover').innerText = c.cloudcover != null ? Math.round(c.cloudcover) + '%' : 'N/A';
    $('dewPoint').innerText = c.dew != null ? fmt(c.dew) + unit : 'N/A';
    $('lastUpdated').innerText = 'Last updated: ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // next 24 hours, starting from the current hour
    const hours = days.slice(0, 2).flatMap(d => d.hours || []).filter(h => h.datetimeEpoch > c.datetimeEpoch - 3600).slice(0, 24);
    $('hourly').innerHTML = hours.map((h, i) => {
        const x = i ? h : c;
        return `<div class="hour"><div class="t">${i ? fmtTime(h.datetimeEpoch, { hour: 'numeric' }) : 'Now'}</div>` +
            `<div class="e">${emoji(x.icon)}</div><div class="v">${fmt(x.temp)}</div></div>`;
    }).join('');

    for (let i = 1; i <= 6; i++) {
        const d = days[i];
        $('dateId' + i).innerText = new Date(d.datetimeEpoch * 1000).toLocaleDateString('en-US', {
            weekday: 'short', day: 'numeric', month: 'short', timeZone: timezone
        });
        $('tempId' + i).innerHTML =
            `<div class="weather-icon">${emoji(d.icon)}</div>` +
            `<div>${fmt(d.temp)}${unit}</div>` +
            `<div class="temp-range"><span>↓${fmt(d.tempmin)}</span> <span>↑${fmt(d.tempmax)}</span></div>`;
    }
}
//-------------------------------------------------------------------------------------------------------------//
function setStatus(msg, isError) {
    update.style.display = msg ? 'flex' : 'none';
    update.textContent = msg;
    update.classList.toggle('error', !!isError);
}

function showWeather(on) {
    getlocation.style.display = on ? 'none' : 'flex';
    weather.style.display = on ? 'flex' : 'none';
    forecast.forEach(f => f.style.display = on ? 'flex' : 'none');
}

// query is a city name or "lat,lon"; name is an optional friendly label for coordinates
async function load(query, name = '') {
    setStatus('Getting weather...');
    try {
        const r = await fetch(`${API}${encodeURIComponent(query)}/next7days?unitGroup=metric&include=days%2Chours%2Ccurrent&key=${API_KEY}&contentType=json`);
        if (r.status === 400) return setStatus(`Couldn't find "${name || query}". Check the spelling and try again.`, true);
        if (!r.ok) return setStatus(r.status === 429 ? 'Too many requests right now, try again later.' : 'Weather service is unavailable, try again later.', true);
        data = await r.json();
        label = name;
        render();
        store.set('last', JSON.stringify({ query, name }));
        setStatus('');
        showWeather(true);
    } catch {
        setStatus("Couldn't load the weather. Check your connection and try again.", true);
    }
}
//-------------------------------------------------------------------------------------------------------------//
btn.addEventListener('click', () => {
    if (!navigator.geolocation) return setStatus('Location is not supported in this browser, search a city instead.', true);
    setStatus('Getting your location...');
    navigator.geolocation.getCurrentPosition(onPosition, onGeoError, { timeout: 10000 });
});

async function onPosition(res) {
    const lat = res.coords.latitude.toFixed(4), lon = res.coords.longitude.toFixed(4);
    // Visual Crossing takes "lat,lon" directly; reverse-geocode only for a friendly name
    const name = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        .then(r => r.json())
        .then(g => [g.city || g.locality, g.countryCode].filter(Boolean).join(", "))
        .catch(() => "");
    load(`${lat},${lon}`, name);
}

function onGeoError(err) {
    setStatus(err.code === 1
        ? 'Location permission denied, search a city instead.'
        : "Couldn't get your location, search a city instead.", true);
}

city.addEventListener('keydown', e => {
    const q = city.value.trim();
    if (e.key === "Enter" && q) load(q);
});

$('backLink').addEventListener('click', e => {
    e.preventDefault();
    setStatus('');
    showWeather(false);
});
//-------------------------------------------------------------------------------------------------------------//
// one global unit for every temperature on the page
['.temp', '.temp1', '#unitBtn'].forEach(sel => document.querySelector(sel).addEventListener('click', () => {
    unit = unit === 'C' ? 'F' : 'C';
    store.set('unit', unit);
    if (data) render();
}));
//-------------------------------------------------------------------------------------------------------------//
showWeather(false);
try {
    const last = JSON.parse(store.get('last'));
    if (last && last.query) load(last.query, last.name);
} catch { /* corrupt saved value: start on the search screen */ }
//-------------------------------------------------------------------------------------------------------------//
