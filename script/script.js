var loc = document.querySelector(".form-control")
var btn=document.querySelector
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(res => {
        loc.value = JSON.stringify(res.coords.latitude) + " " + JSON.stringify(res.coords.longitude)
    })
}
else {
    alert("Not")
}