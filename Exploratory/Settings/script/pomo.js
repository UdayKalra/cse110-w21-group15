window.onload = function () {
    // Add event listeners
    document.getElementById("timerButton").addEventListener('click', onTimerPressed);
    document.getElementById("test").addEventListener('click', onTestCheckboxChecked);
    document.getElementById("settingsBtn").addEventListener('click', openSettings);
    document.getElementById("close").addEventListener('click', closeSettings);
    document.getElementById("btnSetColor").addEventListener('click', bgColorInputParse);

    //set default values of the bgc setting input
    document.getElementById("inputBGColor").placeholder = rgbToHex(getComputedStyle(document.body).backgroundColor);
}
var pomTime = 25 * 60 * 1000;
var breakTime = 5 * 60 * 1000;
var timerInt = 250; //timer refresh interval in ms
var countDownTime;
var isCounting = false;
var isPomTime = true;
var isAudioMuted = false;
var pomCount = 0;
var delta;

var colorChangeSuccessStr = "Successfully changed background color to ";
var colorChangeFailStr = "Failed to change background color, check input";

function onTestCheckboxChecked() {
    var checkbox = document.getElementById("test");
    if (checkbox.checked == true) {
        pomTime = 25 * 1000;
        breakTime = 5 * 1000;
    } else {
        pomTime = 25 * 60 * 1000;
        breakTime = 5 * 60 * 1000;
    }
}
function onTimerPressed() {
    if (isCounting) {
        //Manual Stop, Reset
        isCounting = false;
        clearInterval(delta);
        isPomTime = true;
        pomCount = 0;
        document.getElementById("timerButton").innerHTML = "Start";
        document.getElementById("timerDisplay").innerHTML = "Timer Stopped";
    } else {
        //Start
        startCountdown();
        if (isPomTime) {
            document.getElementById("timerType").innerHTML = "Pomo #" + pomCount;
        } else {
            if (pomCount < 4) {
                document.getElementById("timerType").innerHTML = "Short Break";
            } else {
                document.getElementById("timerType").innerHTML = "Long Break";
                pomCount = 0;
            }
        }
        document.getElementById("timerButton").innerHTML = "Stop";
    }
}
function startCountdown() {
    isCounting = true;
    //Check next interval type
    let audio = document.getElementById("horn");
    if (!isAudioMuted) {
        audio.play();
    }
    if (isPomTime) {
        countDownTime = Date.now() + pomTime;
        pomCount = pomCount + 1;
    } else {
        if (pomCount < 4) {
            countDownTime = Date.now() + breakTime;
        } else {
            countDownTime = Date.now() + breakTime * 3;
        }
    }
    delta = setInterval(function () {
        var timeDiff = countDownTime - Date.now();
        //Min/sec calculation
        var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        //Formatting
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        //Update display
        document.getElementById("timerDisplay").innerHTML = minutes + ":" + seconds;

        //Countdown over
        if (timeDiff < 0) {
            clearInterval(delta);
            document.getElementById("timerDisplay").innerHTML = "Timer Ended";
            isCounting = false;
            if (isPomTime) {
                isPomTime = false;
            } else {
                isPomTime = true;
            }
            document.getElementById("timerButton").innerHTML = "Start";
        }
    }, timerInt);
}
function openSettings() {
    let modal = document.getElementById("settingsModal");
    modal.style.display = "block";
}
function closeSettings() {
    let modal = document.getElementById("settingsModal");
    modal.style.display = "none";
}
function bgColorInputParse() {
    let bgHex = document.getElementById("inputBGColor").value;
    let depTextList = document.getElementsByClassName("bgc-dependent");
    let alertStr;
    if (bgHex != "" && bgHex.length == 7 && hexToRgb(bgHex) != null) {
        document.body.style.backgroundColor = bgHex;
        for (let i = 0; i < depTextList.length; i++) {
            depTextList.item(i).style.color = contrastFontColorCalc(bgHex); //recolor all
        }
        alertStr = colorChangeSuccessStr + bgHex;   //set alert msg to success and format
    } else {
        alertStr = colorChangeFailStr;  // set alert msg to fail
        document.getElementById("inputBGColor").value = ""; //clear input
    }
    alert(alertStr);    //pop msg
}


//Utils
function contrastFontColorCalc(hex) {
    let fontc;
    let bgc = hexToRgb(hex);
    if ((bgc.r + bgc.g + bgc.b) >= 127 * 3) {
        fontc = "#000000";
    } else {
        fontc = "#ffffff";
    }
    return fontc;
}
//Borrowed code snippets.

//https://stackoverflow.com/a/13713406
function rgbToHex(rgb) {
    if (rgb.charAt(0) == 'r') {
        rgb = rgb.replace('rgb(', '').replace(')', '').split(',');
        var r = parseInt(rgb[0], 10).toString(16);
        var g = parseInt(rgb[1], 10).toString(16);
        var b = parseInt(rgb[2], 10).toString(16);
        r = r.length == 1 ? '0' + r : r; g = g.length == 1 ? '0' + g : g; b = b.length == 1 ? '0' + b : b;
        var colHex = '#' + r + g + b;
        return colHex;
    }
}
//https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}