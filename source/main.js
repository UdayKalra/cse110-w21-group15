const myStorage = window.localStorage

/********************************
*  _____ _                      *
* |_   _(_)_ __ ___   ___ _ __  *
*   | | | | '_ ` _ \ / _ \ '__| *
*   | | | | | | | | |  __/ |    *
*   |_| |_|_| |_| |_|\___|_|    *
*                               *
*********************************/

// Initialize all global variables.
const pomoSession = {
  count: 0 /* 4 to a set */,
  pomoPerSet: 4 /* the number of pomos per pomo set, default 4 */,
  sets: 0 /* counts how many full pomo sets completed */,
  state: 'work' /* can be work, shortBreak, or longBreak */,
  pomoLen: 25 /* these are all set low for testing */,
  shortBreakLen: 5,
  longBreakLen: 15,
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
  document.getElementById('short-break-time').addEventListener('input', settingsTime)
  document.getElementById('long-break-time').addEventListener('input', settingsTime)
  document.getElementById('add-task').addEventListener('click', addToList)

  // Update and display timer length
  timer.timerLen = updateTimerLen()
  displayMinSecond(timer.timerLen)
})

function settingsTime () {
  const adjustPomoTime = document.getElementById('pomo-time')
  const adjustSbTime = document.getElementById('short-break-time')
  const adjustLbTime = document.getElementById('long-break-time')

  // Alter time based on setting inputs
  if ((adjustPomoTime.value >= 1 && adjustPomoTime.value <= 99) &&
  (adjustSbTime.value >= 1 && adjustSbTime.value <= 99) &&
  (adjustLbTime.value >= 1 && adjustLbTime.value <= 99)) {
    pomoSession.pomoLen = adjustPomoTime.value
    pomoSession.shortBreakLen = adjustSbTime.value
    pomoSession.longBreakLen = adjustLbTime.value
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
  const adjustPomoTime = document.getElementById('pomo-time')
  const adjustSbTime = document.getElementById('short-break-time')
  const adjustLbTime = document.getElementById('long-break-time')

  // Disable/enable time adjustment based on running time
  if (timeRunning.style.display === 'block') {
    adjustPomoTime.disabled = true
    adjustSbTime.disabled = true
    adjustLbTime.disabled = true
  } else {
    adjustPomoTime.disabled = false
    adjustSbTime.disabled = false
    adjustLbTime.disabled = false
  }
}

function showSettings () {
  // Settings button
  const settingStatus = document.getElementById('settings-overlay')
  const adjustPomoTime = document.getElementById('pomo-time')
  const adjustSbTime = document.getElementById('short-break-time')
  const adjustLbTime = document.getElementById('long-break-time')

  if (parseInt(adjustPomoTime.value) !== pomoSession.pomoLen) {
    adjustPomoTime.value = pomoSession.pomoLen
  }

  if (parseInt(adjustSbTime.value) !== pomoSession.shortBreakLen) {
    adjustSbTime.value = pomoSession.shortBreakLen
  }

  if (parseInt(adjustLbTime.value) !== pomoSession.longBreakLen) {
    adjustLbTime.value = pomoSession.longBreakLen
  }

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

function updateSeedsImage () {
  // set empty filename for later
  let filename = './assets/seeds-'
  const fileext = '.svg'
  const emptySeedFileSrc = './assets/emptySeeds.svg'
  // get the original image source from html
  const seedsImage = document.getElementById('seeds')
  let seedNumber
  // get timerLen
  // compare to either pomoLen, shortbreaklen, or longbreaklen
  // NOTE THAT TIME IN POMOSESSION IS STORED IN MINUTES AND TIMERLEN IS IN MILLISECONDS
  switch (pomoSession.state) {
    case 'work':
      seedNumber = (1 - timer.timerLen / (pomoSession.pomoLen * 60000)) * 25
      break
    case 'shortBreak':
      seedNumber = (1 - timer.timerLen / (pomoSession.shortBreakLen * 60000)) * 25
      break
    case 'longBreak':
      seedNumber = (1 - timer.timerLen / (pomoSession.longBreakLen * 60000)) * 25
      break
  }
  // get the correct seedNumber int (  (timerLen / pomoLen) * 25 )
  // console.log('seedNumber='+seedNumber)
  if (parseInt(seedNumber) === 0) {
    filename = emptySeedFileSrc
  } else {
    filename = filename + parseInt(seedNumber) + fileext
  }

  // console.log(filename)
  // concatenate seedNumber to filename
  seedsImage.src = filename
  seedsImage.setAttribute('src', filename) // FALLBACK SET SRC
}

function updateProgressBar () {
  // eyeballed svg width
  const fillerBar1MaxWidth = 249
  const fillerBar2MaxWidth = 54
  // filler bar HTML elements
  const fillerBar1SvgId = 'filler-bar-1-svg'
  const fillerBar2SvgId = 'filler-bar-2-svg'
  const fillerBar1SvgElem = document.getElementById(fillerBar1SvgId)
  const fillerBar2SvgElem = document.getElementById(fillerBar2SvgId)

  // check pomo session state
  switch (pomoSession.state) {
    case 'work':
      // update bar 1 according to pomo progress
      fillerBar1SvgElem.setAttribute(
        'width',
        (1 - timer.timerLen / (pomoSession.pomoLen * 60000)) * fillerBar1MaxWidth
      )
      // leave bar 2 empty
      fillerBar2SvgElem.setAttribute('width', 0)
      break
    case 'shortBreak':
      // leave bar 1 full
      fillerBar1SvgElem.setAttribute('width', fillerBar1MaxWidth)
      // update bar 2 according to short break progress
      fillerBar2SvgElem.setAttribute(
        'width',
        (1 - timer.timerLen / (pomoSession.shortBreakLen * 60000)) *
          fillerBar2MaxWidth
      )
      break
    case 'longBreak':
      // leave bar 1 full
      fillerBar1SvgElem.setAttribute('width', fillerBar1MaxWidth)
      // update bar 2 according to long break progress
      fillerBar2SvgElem.setAttribute(
        'width',
        (1 - timer.timerLen / (pomoSession.longBreakLen * 60000)) * fillerBar2MaxWidth
      )
      break
  }
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
    stateChange(runTimer, displayMinSecond)
  }
  console.log(timer.timerLen)
  updateSeedsImage()
  updateProgressBar()
  displayMinSecond(timer.timerLen)
  timer.timerLen -= 1000

  /* update the focused tasks time spent */
  if (pomoSession.state === 'work' && focusedTask.length > 0) {
    focusedTask[0].time += 1000
  }
}

/* this function does the actual changes to the document and our
   session object. it's a bit hefty right now */
function stateChange (runTimer, displayMinSecond) {
  console.log('inStateChange')
  switch (pomoSession.state) {
    case 'work':
      if (pomoSession.count === pomoSession.pomoPerSet) {
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
      if (pomoSession.count === pomoSession.pomoPerSet) {
        document.getElementById('progress-bar-background').src =
          '/source/assets/progressBarLongBreak.svg'
        // document.getElementById('progress-bar').setAttribute('bottom',24)
        console.log('imageChangedToLongBreak')
      } else {
        document.getElementById('progress-bar-background').src =
          './assets/backgroundProgressBar.svg'
        // document.getElementById('progress-bar').setAttribute('bottom','5')
        console.log('imageChangedBack')
      }
      timer.timerLen = updateTimerLen()
      // Change Stop button to Start button
      document.getElementById('play').style.display = 'block'
      document.getElementById('stop').style.display = 'none'
      break
    case 'longBreak':
      // change progress bar background back to short break
      document.getElementById('progress-bar-background').src =
        './assets/backgroundProgressBar.svg'
      console.log('imageChangedBack')
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

/************************************
 *  _____         _    _ _     _    *
 * |_   _|_ _ ___| | _| (_)___| |_  *
 *   | |/ _` / __| |/ / | / __| __| *
 *   | | (_| \__ \   <| | \__ \ |_  *
 *   |_|\__,_|___/_|\_\_|_|___/\__| *
 *                                  *
 ************************************/

const focusedTask = []
const masterList = []
const completedList = []

const list = document.getElementById('tasks')

function buildNewTask () {
  const taskInput = document.getElementById('pomo-task')
  const newTask = document.createElement('div')
  newTask.setAttribute('class', 'task-object')
  newTask.setAttribute('draggable', true)

  /* fill task object with it's buttons and text elements */
  const focusButton = document.createElement('button')
  focusButton.setAttribute('class', 'focus-task-button')
  focusButton.innerHTML = '<img src="assets/focusTask.svg" alt="focus task" id="focus-task-icon">'
  focusButton.addEventListener('click', focusTask)
  newTask.appendChild(focusButton)

  const delButton = document.createElement('button')
  delButton.setAttribute('class', 'delete-task-button')
  delButton.innerHTML = '<img src="assets/minusSign.svg" alt="delete task" id="delete-task-icon">'
  delButton.addEventListener('click', delFromList)
  newTask.appendChild(delButton)

  const taskText = document.createElement('p')
  taskText.setAttribute('class', 'task-text')
  taskText.innerHTML = taskInput.value
  newTask.appendChild(taskText)

  const compButton = document.createElement('button')
  compButton.setAttribute('class', 'complete-task-button')
  compButton.innerHTML = '<img src="assets/checkTask.svg" alt="complete task" id="complete-task-icon">'
  compButton.addEventListener('click', completeTask)
  compButton.style.display = 'none'
  newTask.appendChild(compButton)

  taskInput.value = ''

  return newTask
}

function addToList () {
  const newTask = buildNewTask()
  const tmptask = {
    taskBody: newTask,
    time: 0
  }
  masterList.push(tmptask)

  redrawList()
}

function focusTask () {
  const temp = focusedTask.pop()
  const index = masterList.findIndex(x => x.taskBody === this.parentElement)
  focusedTask.push(masterList[index])
  focusedTask[0].taskBody.setAttribute('class', 'focused-task')
  focusedTask[0].taskBody.children[0].disabled = true
  focusedTask[0].taskBody.children[0].innerHTML = '<img src="assets/focusTaskActive.svg" alt="focus task" id="focus-task-activeicon">'
  focusedTask[0].taskBody.children[3].style.display = 'block'

  /* remove focused task from the list and if there was a previously
     focused task, add it back to the list */
  masterList.splice(index, 1)
  if (temp !== undefined) {
    temp.taskBody.setAttribute('class', 'task-object')
    temp.taskBody.children[0].disabled = false
    temp.taskBody.children[0].innerHTML = '<img src="assets/focusTask.svg" alt="focus task" id="focus-task-icon">'
    temp.taskBody.children[0].setAttribute('src', 'assets/focusTask.svg')
    temp.taskBody.children[3].style.display = 'none'
    masterList.splice(0, 0, temp)
  }

  redrawList()
}

/* removes an item from our task list */
function delFromList () {
  /* figure out where the task came from, then get rid of it */
  if (focusedTask.length > 0 && this.parentElement === focusedTask[0].taskBody) {
    focusedTask.pop()
  } else {
    const index = masterList.findIndex(x => x.taskBody === this.parentElement)
    if (index === -1) {
      completedList.splice(completedList.findIndex(x => x.taskBody === this.parentElement), 1)
    } else {
      masterList.splice(index, 1)
    }
  }

  this.parentElement.remove()

  redrawList()
}

function completeTask () {
  let temp
  if (focusedTask.length > 0 && this.parentElement === focusedTask[0].taskBody) {
    temp = focusedTask.pop()
  } else {
    const index = masterList.findIndex(x => x.taskBody === this.parentElement)
    temp = masterList[index]
    masterList.splice(index, 1)
  }
  temp.taskBody.setAttribute('class', 'completed-task')
  temp.taskBody.children[temp.taskBody.children.length - 1].remove()
  temp.taskBody.children[0].remove()

  const taskTime = document.createElement('p')
  taskTime.setAttribute('class', 'task-time')
  taskTime.innerHTML = 'Pomos: ' + (temp.time / (pomoSession.pomoLen * 60 * 1000)).toFixed(1)
  temp.taskBody.appendChild(taskTime)

  completedList.push(temp)

  redrawList()
}

/* this deletes all of the children of the task list and repopulates them
   using the arrays that represent their contents */
function redrawList () {
  while (list.firstChild) {
    list.removeChild(list.firstChild)
  }

  if (focusedTask.length > 0) {
    list.appendChild(focusedTask[0].taskBody)
  }

  for (let i = 0; i < masterList.length; i++) {
    list.appendChild(masterList[i].taskBody)
  }

  for (let i = 0; i < completedList.length; i++) {
    list.appendChild(completedList[i].taskBody)
  }
}

/**********************************************************
*   ___        _                         _ _              *
*  / _ \ _ __ | |__   ___   __ _ _ __ __| (_)_ __   __ _  *
* | | | | '_ \| '_ \ / _ \ / _` | '__/ _` | | '_ \ / _` | *
* | |_| | | | | |_) | (_) | (_| | | | (_| | | | | | (_| | *
*  \___/|_| |_|_.__/ \___/ \__,_|_|  \__,_|_|_| |_|\__, | *
*                                                  |___/  *
***********************************************************/

// Onboarding
// myStorage = window.localStorage
// firstTime = true initially.
const onBoardingVars = {
  onboarding: document.getElementById('onboarding'),
  onboardingButton: document.getElementById('onboarding-button'),
  current: 1,
  textDivs: [...document.querySelectorAll('.otext')]
}
// const onboarding = document.getElementById('onboarding')
// const onboardingButton = document.getElementById('onboarding-button')
// let current = 1
// const textDivs = [...document.querySelectorAll('.otext')]
// console.log(textDivs)

const addContent = e => {
  onBoardingVars.onboardingButton.addEventListener('click', onBoardingClick)
  restartSession()

  if (myStorage.getItem('firstTime') === null) {
    console.log('first time visiting')
    myStorage.setItem('firstTime', false)
    onBoardingVars.onboarding.setAttribute('class', 'active')
    hideOnClickOutside(document.getElementById('onboarding-background'), 'play-restart')
    return 1
  } else {
    console.log('not first time visiting')
    myStorage.setItem('firstTime', false)
    onBoardingVars.onboarding.setAttribute('class', 'in-active')
    return 0
  }
}

window.addEventListener('DOMContentLoaded', addContent)
// function to cycle through onboarding pages
const onBoardingClick = e => {
  let current = onBoardingVars.current
  document.getElementById(`o${current}`).style.display = 'none'
  current = current + 1
  onBoardingVars.current = current
  if (current > 6) {
    document.getElementById('onboarding').setAttribute('class', 'in-active')
    return 'closed'
  }
  document.getElementById('onboarding-progress-bar').src = `./assets/onboarding-${current}.svg`
  document.getElementById(`o${current}`).style.display = 'block'
  return 'continue'
}

const restartClick = function (e) {
  hideOnClickOutside(document.getElementById('onboarding-background'), 'play-restart')
  document.getElementById('onboarding').setAttribute('class', 'active')
  onBoardingVars.current = 1
  restartOnboarding()
}
function restartSession () {
  document.getElementById('play-restart').addEventListener('click', restartClick)
}

const restartOnboarding = () => {
  onBoardingVars.textDivs.forEach(item => {
    item.style.display = 'none'
  })
  document.getElementById(`o${onBoardingVars.current}`).style.display = 'block'
  document.getElementById('onboarding-progress-bar').src = `./assets/onboarding-${onBoardingVars.current}.svg`
}

// const showOnBoarding = () => {
//   onboarding.setAttribute('class', 'active')
// }

// hides onboarding menu
const hideOnClickOutside = (element, buttonId) => {
  const outsideClickListener = e => {
    console.log(e.target.id !== buttonId && !element.contains(e.target) && !document.getElementById(buttonId).contains(e.target))
    console.log(e.target.id !== buttonId)
    console.log(!element.contains(e.target))
    console.log(!document.getElementById(buttonId).contains(e.target))
    if (e.target.id !== buttonId && !element.contains(e.target) && !document.getElementById(buttonId).contains(e.target)) {
      document.getElementById('onboarding').setAttribute('class', 'in-active')
      removeClickListener()
    }
  }
  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }
  setTimeout(document.addEventListener('click', outsideClickListener), 0)
}

// module.exports = {
//   pomoSession: pomoSession,
//   timer: timer,
//   startSession: startSession,
//   stopSession: stopSession,
//   runTimer: runTimer,
//   updateTimerLen: updateTimerLen,
//   displayMinSecond: displayMinSecond,
//   stateChange: stateChange,
//   updateTimer: updateTimer,
//   settingsTime: settingsTime,
//   disableTime: disableTime,
//   showSettings: showSettings,
//   addContent,
//   onBoardingClick,
//   onBoardingVars,
//   restartSession,
//   hideOnClickOutside,
//   restartClick,
//   restartOnboarding,
//   myStorage,
//   updateProgressBar,
//   updateSeedsImage,
//   buildNewTask,
//   addToList,
//   focusTask,
//   delFromList,
//   completeTask,
//   redrawList,
//   focusedTask
// }
