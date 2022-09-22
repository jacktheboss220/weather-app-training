var loc = document.querySelector(".form-control")
var btn = document.querySelector(".fs-5.btn.btn-secondary");

// 17b2aa06e2fc32be5d7db17960eb8f30

btn.addEventListener('click', () => {
    btn.innerHTML = "Getting Location...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(response, error);
    }
    else {
        alert("GeoLocation is not supported by your bowers. Please Try opening in different one.")
    }
})
function response(res) {
    setTimeout(() => {
        btn.innerHTML = "Location Updated"
        const { latitude, longitude } = res.coords;
        loc.value = "latitude : " + latitude + " longitude: " + longitude;
    }, 5000);
}
function error(err) {
    loc.value = err.message
}