const myStorage = window.localStorage

// Initialize all global variables.
const pomoSession = {
  count: 0, /* 4 to a set */
  sets: 0, /* counts how many full pomo sets completed */
  state: 'work', /* can be work, shortBreak, or longBreak */
  pomoLen: 25, /* these are all set low for testing */
  shortBreakLen: 0.2,
  longBreakLen: 0.2,
  firstStart: true
}

// pomoSession.pomoLen = 0.5
const timer = {
  timerLen: 0,
  timerRef: 0
}

// Add all EventListener when the DOM Loaded
document.addEventListener('DOMContentLoaded', function (event) {
  document.getElementById('play').addEventListener('click', startSession)
  document.getElementById('stop').addEventListener('click', stopSession)
  document.getElementById('settings').addEventListener('click', showSettings)
  document.getElementById('close-settings').addEventListener('click', showSettings)
  document.getElementById('pomo-time').addEventListener('input', settingsTime)
  document.getElementById('volume-text').addEventListener('input', changeVolumeSlider)
  document.getElementById('volume-slider').addEventListener('input', changeVolumeText)

  // Update and display timer length
  timer.timerLen = updateTimerLen()
  displayMinSecond(timer.timerLen)
})

function changeVolumeText () {
  const slider = document.getElementById('volume-slider')
  const number = document.getElementById('volume-text')

  // Make volume slider and text adjustor the same value
  number.value = slider.value
}

function changeVolumeSlider () {
  const slider = document.getElementById('volume-slider')
  const number = document.getElementById('volume-text')

  // Set volume slider to be the same as text adjustor, 0 if empty text
  slider.value = (number.value) ? number.value : 0
}

function settingsTime () {
  const adjustedTime = document.getElementById('pomo-time')

  // Alter time based on setting inputs
  if (adjustedTime.value >= 1 && adjustedTime.value <= 99) {
    pomoSession.pomoLen = adjustedTime.value
    timer.timerLen = updateTimerLen()
    displayMinSecond(timer.timerLen)

    document.getElementById('play').disabled = false
    document.getElementById('close-settings').disabled = false
  } else {
    // Out of range, disable play button and settings exit button
    document.getElementById('play').disabled = true
    document.getElementById('close-settings').disabled = true
  }
}

function disableTime () {
  const timeRunning = document.getElementById('stop')
  const adjustedTime = document.getElementById('pomo-time')

  // Disable/enable time adjustment based on running time
  if (timeRunning.style.display === 'block') {
    adjustedTime.disabled = true
  } else {
    adjustedTime.disabled = false
  }
}

function showSettings () {
  // Settings button
  const settingStatus = document.getElementById('settings-overlay')

  // disable time adjustment
  disableTime()

  // Show/hide settings overlay based on current display
  if (settingStatus.style.display === 'none') {
    settingStatus.style.display = 'block'
  } else {
    settingStatus.style.display = 'none'
  }
}

function startSession () {
  // Change Start button to Stop button
  document.getElementById('play').style.display = 'none'
  document.getElementById('stop').style.display = 'block'

  // disable time adjustment
  disableTime()

  // Start the timer
  runTimer(updateTimer)
}

function stopSession () {
  // Reset the pomoSession variable
  pomoSession.state = 'work'
  pomoSession.count = 0
  pomoSession.sets = 1
  pomoSession.firstStart = true

  // Change Stop button to Start button
  document.getElementById('play').style.display = 'block'
  document.getElementById('stop').style.display = 'none'
  // Display the timer in Pomotime
  timer.timerLen = updateTimerLen()
  displayMinSecond(timer.timerLen)
  // Stop the timer
  clearInterval(timer.timerRef)
  // Enable time adjustment
  disableTime()
}

function runTimer (updateTimer) {
  timer.timerLen = updateTimerLen()
  console.log(timer.timerLen)
  // Special case for first time start a work state, we need to offet a delay when clicking start button
  if (pomoSession.firstStart === true) {
    timer.timerLen -= 1000
    pomoSession.firstStart = false
  }
  timer.timerRef = setInterval(updateTimer, 1000)
}

function updateTimerLen () {
  let length
  // Set the timer length based on its state
  switch (pomoSession.state) {
    case 'work':
      length = pomoSession.pomoLen
      break
    case 'shortBreak':
      length = pomoSession.shortBreakLen
      break
    case 'longBreak':
      length = pomoSession.longBreakLen
      break
  }
  return length * 60 * 1000 /* pomoLen in miliseconds */
}

function displayMinSecond (timerLen) {
  // console.log(timerLen)
  let mins = Math.floor((timerLen / 1000) / 60)
  let seconds = (timerLen / 1000) % 60
  if (mins < 10) {
    mins = '0' + mins
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  document.getElementById('time').innerHTML = mins + ':' + seconds
}
function updateTimer () {
  if (timer.timerLen <= 0) {
    clearInterval(timer.timerRef)
    stateChange()
  }
  console.log(timer.timerLen)
  displayMinSecond(timer.timerLen)
  timer.timerLen -= 1000
}

/* this function does the actual changes to the document and our
   session object. it's a bit hefty right now */
function stateChange () {
  switch (pomoSession.state) {
    case 'work':
      if (pomoSession.count === 4) {
        pomoSession.state = 'longBreak'
      } else {
        pomoSession.state = 'shortBreak'
      }
      runTimer(updateTimer)
      break
    case 'shortBreak':
      pomoSession.state = 'work'
      pomoSession.firstStart = true
      pomoSession.count++
      timer.timerLen = updateTimerLen()
      // Change Stop button to Start button
      document.getElementById('play').style.display = 'block'
      document.getElementById('stop').style.display = 'none'
      break
    case 'longBreak':
      pomoSession.state = 'work'
      pomoSession.firstStart = true
      pomoSession.count = 0
      pomoSession.sets++
      timer.timerLen = updateTimerLen()
      // Change Stop button to Start button
      document.getElementById('play').style.display = 'block'
      document.getElementById('stop').style.display = 'none'
      break
  }
  displayMinSecond(timer.timerLen)
}

// Onboarding
// myStorage = window.localStorage
// firstTime = true initially.
const onboarding = document.getElementById('onboarding')
const onboardingButton = document.getElementById('onboarding-button')
let current = 1
const textDivs = [...document.querySelectorAll('.otext')]
console.log(textDivs)
window.addEventListener('DOMContentLoaded', e => {
  e.preventDefault()
  console.log('DOMContentLoaded')
  onboardingButton.addEventListener('click', onBoardingClick)
  document.getElementById('onboarding-black').addEventListener('click', blackClicked)
  restartSession()

  if (myStorage.getItem('firstTime') === null) {
    console.log('first time visiting')
    myStorage.setItem('firstTime', false)
    onboarding.setAttribute('class', 'active')
    hideOnClickOutside(document.getElementById('onboarding-background'), 'play-restart')
    return 1
  } else {
    console.log('not first time visiting')
    myStorage.setItem('firstTime', false)
    onboarding.setAttribute('class', 'in-active')
  }
  return 0
})

// function to cycle through onboarding pages
const onBoardingClick = e => {
  document.getElementById(`o${current}`).style.display = 'none'
  current = current + 1
  if (current > 6) {
    onboarding.setAttribute('class', 'in-active')
    return 'closed'
  }
  document.getElementById('onboarding-progress-bar').src = `./assets/onboarding-${current}.svg`
  document.getElementById(`o${current}`).style.display = 'block'
  return 'continue'
}

function restartSession () {
  document.getElementById('play-restart').addEventListener('click', function () {
    hideOnClickOutside(document.getElementById('onboarding-background'), 'play-restart')
    console.log('close')
    onboarding.setAttribute('class', 'active')
    current = 1
    restartOnboarding()
  })
}

const restartOnboarding = () => {
  textDivs.forEach(item => {
    item.style.display = 'none'
    return 1
  })
  document.getElementById(`o${current}`).style.display = 'block'
  document.getElementById('onboarding-progress-bar').src = `./assets/onboarding-${current}.svg`
}

const blackClicked = e => {
  e.preventDefault()
  console.log('clicked')
}

// const showOnBoarding = () => {
//   onboarding.setAttribute('class', 'active')
// }
// hides onboarding menu
const hideOnClickOutside = (element, buttonId) => {
  const outsideClickListener = e => {
    if (e.target.id !== buttonId && !element.contains(e.target) && !document.getElementById(buttonId).contains(e.target)) {
      document.getElementById('onboarding').setAttribute('class', 'in-active')
      removeClickListener()
    }
    console.log(element.contains(e.target))
    console.log(e.target)
  }
  console.log('removed by outside window')
  console.log(element)
  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  setTimeout(document.addEventListener('click', outsideClickListener), 0)
}

// testing for click on onboarding-black
module.exports = {
  pomoSession: pomoSession,
  timer: timer,
  startSession: startSession,
  stopSession: stopSession,
  runTimer: runTimer,
  updateTimerLen: updateTimerLen,
  displayMinSecond: displayMinSecond,
  stateChange: stateChange,
  updateTimer: updateTimer
}
