// variables initialized here
const pomTime = 25 * 60 * 1000
const breakTime = 5 * 60 * 1000
const timerInt = 250 // timer refresh interval in ms
let countDownTime
let isCounting = false
let isPomTime = true
let isAudioMuted = false
let pomCount = 0
let delta
let audioVolume = 1

// strings
const colorChangeSuccessStr = 'Successfully changed background color to '
const colorChangeFailStr = 'Failed to change background color, check input'

// add event listeners and set default values after page is loaded
window.onload = function () {
  // Add event listeners
  document.getElementById('timerButton').addEventListener('click', onTimerClick)
  document
    .getElementById('settingsBtn')
    .addEventListener('click', onSettingClick)
  document
    .getElementById('close')
    .addEventListener('click', onSettingCloseClick)
  document.getElementById('test').addEventListener('click', onTestCheckboxClick)
  document.getElementById('mute').addEventListener('click', onMuteCheckboxClick)
  document
    .getElementById('volume-slider')
    .addEventListener('click', onVolumeSliderClick)
  document
    .getElementById('btnSetColor')
    .addEventListener('click', onBGColorChangeClick)

  //set default values of the bgc setting input
  document.getElementById('inputBGColor').placeholder = rgbToHex(
    getComputedStyle(document.body).backgroundColor
  )
}

// fired when test option checkbox is clicked
function onTestCheckboxClick () {
  let checkbox = document.getElementById('test')
  if (checkbox.checked) {
    pomTime = 25 * 1000
    breakTime = 5 * 1000
  } else {
    pomTime = 25 * 60 * 1000
    breakTime = 5 * 60 * 1000
  }
}

// fired when mute checkbox is clicked
function onMuteCheckboxClick () {
  isAudioMuted = document.getElementById('mute').checked
  if (document.getElementById('mute').checked) {
    audioVolume = 0 //set horn volume to 0
    document.getElementById('volume-slider').disabled = true //disable the slider when muted
  } else {
    document.getElementById('volume-slider').disabled = false //enable slider when unmuted
    audioVolume = document.getElementById('volume-slider').value //resume slider volume
  }
  audioVolumeUpdate()
}

// fired when volume slider is clicked
function onVolumeSliderClick () {
  audioVolume = document.getElementById('volume-slider').value
  audioVolumeUpdate()
}

// called when a update of audio volume is performed
function audioVolumeUpdate () {
  document.getElementById('horn').volume = audioVolume
}

// fired when timer button is clicked
function onTimerClick () {
  if (isCounting) {
    // Manual Stop, Reset
    isCounting = false
    clearInterval(delta)
    isPomTime = true
    pomCount = 0
    document.getElementById('timerButton').innerHTML = 'Start'
    document.getElementById('timerDisplay').innerHTML = 'Timer Stopped'
  } else {
    // Start
    startCountdown()
    if (isPomTime) {
      document.getElementById('timerType').innerHTML = 'Pomo #' + pomCount
    } else {
      if (pomCount < 4) {
        document.getElementById('timerType').innerHTML = 'Short Break'
      } else {
        document.getElementById('timerType').innerHTML = 'Long Break'
        pomCount = 0
      }
    }
    document.getElementById('timerButton').innerHTML = 'Stop'
  }
}

// called when countdown starts
function startCountdown () {
  isCounting = true
  // Check next interval type
  const audio = document.getElementById('horn')
  if (!isAudioMuted) {
    audio.play()
  }
  if (isPomTime) {
    countDownTime = Date.now() + pomTime
    pomCount = pomCount + 1
  } else {
    if (pomCount < 4) {
      countDownTime = Date.now() + breakTime
    } else {
      countDownTime = Date.now() + breakTime * 3
    }
  }
  delta = setInterval(function () {
    const timeDiff = countDownTime - Date.now()
    // Min/sec calculation
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
    // Formatting
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    // Update display
    document.getElementById('timerDisplay').innerHTML = minutes + ':' + seconds

    // Countdown over
    if (timeDiff < 0) {
      clearInterval(delta)
      document.getElementById('timerDisplay').innerHTML = 'Timer Ended'
      isCounting = false
      if (isPomTime) {
        isPomTime = false
      } else {
        isPomTime = true
      }
      document.getElementById('timerButton').innerHTML = 'Start'
    }
  }, timerInt)
}

// fired when setting button is pressed
function onSettingClick () {
  const modal = document.getElementById('settingsModal')
  modal.style.display = 'block'
}

// fired when setting window close button is pressed
function onSettingCloseClick () {
  const modal = document.getElementById('settingsModal')
  modal.style.display = 'none'
}

// fired when background color change button is pressed
function onBGColorChangeClick () {
  let bgHex = document.getElementById('inputBGColor').value
  let depTextList = document.getElementsByClassName('bgc-dependent')
  let alertStr
  if (bgHex !== '' && bgHex.length === 7 && hexToRgb(bgHex) != null) {
    document.body.style.backgroundColor = bgHex
    for (let i = 0; i < depTextList.length; i++) {
      depTextList.item(i).style.color = contrastFontColorCalc(bgHex) // recolor all
    }
    alertStr = colorChangeSuccessStr + bgHex // set alert msg to success and format
  } else {
    alertStr = colorChangeFailStr // set alert msg to fail
    document.getElementById('inputBGColor').value = '' // clear input
  }
  alert(alertStr) // pop msg
}

// Utils
function contrastFontColorCalc(hex) {
  let fontc
  const bgc = hexToRgb(hex)
  if (bgc.r + bgc.g + bgc.b >= 127 * 3) {
    fontc = '#000000'
  } else {
    fontc = '#ffffff'
  }
  return fontc
}
// Borrowed code snippets.
// https://stackoverflow.com/a/13713406
function rgbToHex (rgb) {
  if (rgb.charAt(0) === 'r') {
    rgb = rgb.replace('rgb(', '').replace(')', '').split(',')
    let r = parseInt(rgb[0], 10).toString(16)
    let g = parseInt(rgb[1], 10).toString(16)
    let b = parseInt(rgb[2], 10).toString(16)
    r = r.length === 1 ? '0' + r : r
    g = g.length === 1 ? '0' + g : g
    b = b.length === 1 ? '0' + b : b
    const colHex = '#' + r + g + b
    return colHex
  }
}
// https://stackoverflow.com/a/5624139
function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
