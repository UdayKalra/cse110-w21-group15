const main = require('../source/main')

document.body.innerHTML = '<div id="timer">' +
  '<div id="empty-seeds">' +
  '<img src="./assets/emptySeeds.svg" alt="plain seed">' +
  '</div>' +
  '<img id="timer-background" src="./assets/timerBackground.svg" alt="Timer background">' +
  '<button id="play">' +
  '<span id="play-button"></span>' +
  '</button>' +
  '<button id="stop">' +
  '<span id="stop-button"></span>' +
  '</button>' +
  '<p id="time">25:00</p>' +
  '</div>' +
  '<div id="settings"></div>' +
  '<div id="close-settings"></div>' +
  '<div id="pomo-time"></div>' +
  '<div id="volume-text"></div>' +
  '<div id="volume-slider"></div>' +
  '<div id="onboarding"></div>' +
  '<div id="onboarding-button"></div>' +
  '<div id="onboarding-black"></div>' +
  '<div id="o1"></div>' +
  '<div id="play-restart"></div>' +

require('../source/main')

const evt = document.createEvent('Event')
evt.initEvent('DOMContentLoaded', true, true, document, '', '', '', 0)
document.dispatchEvent(evt)

describe('startSession', () => {
  test('Hide a start button and display a stop button', () => {
    const playBtn = document.getElementById('play')
    const stopBtn = document.getElementById('stop')

    playBtn.click()
    expect(playBtn.style.display).toBe('none')
    expect(stopBtn.style.display).toBe('block')
  })
})

describe('startSession', () => {
  test('Hide a start button and display a stop button', () => {
    const playBtn = document.getElementById('play')
    const stopBtn = document.getElementById('stop')

    stopBtn.click()

    expect(main.pomoSession.state).toBe('work')
    expect(main.pomoSession.count).toBe(0)
    expect(main.pomoSession.sets).toBe(1)
    expect(main.pomoSession.firstStart).toBe(true)
    expect(playBtn.style.display).toBe('block')
    expect(stopBtn.style.display).toBe('none')
  })
})
