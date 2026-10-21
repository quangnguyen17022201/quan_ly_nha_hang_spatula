// File: dangnhap.js

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    var timeString = hours + ":" + minutes + ":" + seconds + " - " + day + "/" + month + "/" + year;
    document.getElementById("realTimeClock").innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock();

var toggleBtn = document.getElementById("toggleBtn");
var passwordInput = document.getElementById("password");
toggleBtn.onclick = function() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.innerText = "Ẩn mật khẩu";
    } else {
        passwordInput.type = "password";
        toggleBtn.innerText = "Hiện mật khẩu";
    }
};

var loginForm = document.getElementById("loginForm");
var errorMsg = document.getElementById("errorMsg");
var submitBtn = document.getElementById("submitBtn");
loginForm.onsubmit = function(event) {
    event.preventDefault();
    var empId = document.getElementById("empId").value;
    var password = passwordInput.value;
    errorMsg.style.display = "none";
    submitBtn.innerText = "ĐANG XÁC THỰC...";
    submitBtn.disabled = true;
    setTimeout(function() {
        if (empId.toUpperCase() === "ADMIN" && password === "123456") {
            submitBtn.innerText = "ĐĂNG NHẬP THÀNH CÔNG";
            submitBtn.style.backgroundColor = "#28a745";
            submitBtn.style.color = "#fff";
            setTimeout(function() {
                window.location.href = "datban.html"; 
            }, 500);
        } else {
            errorMsg.style.display = "block";
            submitBtn.innerText = "VÀO CA LÀM VIỆC";
            submitBtn.disabled = false;
            passwordInput.value = "";
            passwordInput.focus();
        }
    }, 1000);
};