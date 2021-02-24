
// Initialize all global variables.
const pomoSession = {
  count: 0, /* 4 to a set */
  sets: 0, /* counts how many full pomo sets completed */
  state: 'work', /* can be work, shortBreak, or longBreak */
  pomoLen: 0.5, /* these are all set low for testing */
  shortBreakLen: 0.2,
  longBreakLen: 0.2,
  firstStart: true
}

// pomoSession.pomoLen = 0.5

let timerLen
let timerRef
let mins
let seconds

// Add all EventListener when the DOM Loaded
document.addEventListener('DOMContentLoaded', function (event) {
  document.getElementById('play').addEventListener('click', startSession)
  document.getElementById('stop').addEventListener('click', stopSession)
})

function startSession () {
  // Change Start button to Stop button
  document.getElementById('play').style.display = 'none'
  document.getElementById('stop').style.display = 'block'

  // Start the timer
  runTimer()
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
  timerLen = updateTimerLen()
  displayMinSecond()
  // Stop the timer
  clearInterval(timerRef)
}

function runTimer () {
  timerLen = updateTimerLen()
  console.log(timerLen)
  // Special case for first time start a work state, we need to offet a delay when clicking start button
  if (pomoSession.firstStart === true) {
    timerLen -= 1000
    pomoSession.firstStart = false
  }
  timerRef = setInterval(updateTimer, 1000)
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

function displayMinSecond () {
  console.log(timerLen)
  mins = Math.floor((timerLen / 1000) / 60)
  seconds = (timerLen / 1000) % 60
  if (mins < 10) {
    mins = '0' + mins
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  document.getElementById('time').innerHTML = mins + ':' + seconds
}
function updateTimer () {
  if (timerLen <= 0) {
    clearInterval(timerRef)
    stateChange()
  }
  displayMinSecond()
  timerLen -= 1000
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
      runTimer()
      break
    case 'shortBreak':
      pomoSession.state = 'work'
      pomoSession.firstStart = true
      pomoSession.count++
      timerLen = updateTimerLen()
      // Change Stop button to Start button
      document.getElementById('play').style.display = 'block'
      document.getElementById('stop').style.display = 'none'
      break
    case 'longBreak':
      pomoSession.state = 'work'
      pomoSession.firstStart = true
      pomoSession.count = 0
      pomoSession.set++
      updateTimerLen()
      // Change Stop button to Start button
      document.getElementById('play').style.display = 'block'
      document.getElementById('stop').style.display = 'none'
      break
  }
  displayMinSecond()
}
