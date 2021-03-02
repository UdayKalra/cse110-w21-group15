const main = require('../source/main')

document.body.innerHTML = '<div>' +
  '<button id="play">' +
  '<span id="play-button"></span>' +
  '</button>' +
  '<button id="stop">' +
  '<span id="stop-button"></span>' +
  '</button>' +
  '<p id="time">25:00</p>' +
  '</div>'

describe('runTimer', () => {
  jest.useFakeTimers()
  test('The first time the timer starts', () => {
    const callback = jest.fn()
    main.pomoSession.firstStart = true
    main.runTimer(callback)
    jest.advanceTimersByTime(3000)
    expect(main.pomoSession.firstStart).toBe(false)
    expect(setInterval).toBeCalled()
    expect(callback).toHaveBeenCalledTimes(3)
  })

  test('Not the first time the timer starts', () => {
    const callback = jest.fn()
    main.pomoSession.firstStart = false
    main.runTimer(callback)
    jest.advanceTimersByTime(6000)
    expect(main.pomoSession.firstStart).toBe(false)
    expect(setInterval).toBeCalled()
    expect(callback).toHaveBeenCalledTimes(6)
  })
})

describe('updateTimeLen', () => {
  test('In work state', () => {
    main.pomoSession.state = 'work'
    main.pomoSession.pomoLen = 1

    expect(main.updateTimerLen()).toBe(60000)
  })

  test('In short break state', () => {
    main.pomoSession.state = 'shortBreak'
    main.pomoSession.shortBreakLen = 2

    expect(main.updateTimerLen()).toBe(120000)
  })

  test('In long break state', () => {
    main.pomoSession.state = 'longBreak'
    main.pomoSession.longBreakLen = 3

    expect(main.updateTimerLen()).toBe(180000)
  })
})

describe('displayMinSecond', () => {
  test('1 digit minutue and 1 digit second', () => {
    const timerLen = 121000
    main.displayMinSecond(timerLen)
    expect(document.getElementById('time').innerHTML).toBe('02:01')
  })

  test('1 digit minutue and 2 digit second', () => {
    const timerLen = 141000
    main.displayMinSecond(timerLen)
    expect(document.getElementById('time').innerHTML).toBe('02:21')
  })

  test('2 digit minutue and 1 digit second', () => {
    const timerLen = 725000
    console.log()
    main.displayMinSecond(timerLen)
    expect(document.getElementById('time').innerHTML).toBe('12:05')
  })

  test('2 digit minutue and 2 digit second', () => {
    const timerLen = 741000
    main.displayMinSecond(timerLen)
    expect(document.getElementById('time').innerHTML).toBe('12:21')
  })
})

describe('updateTimer', () => {
  test('timerLen greater than 0', () => {
    main.timer.timerLen = 10000
    main.updateTimer()
    expect(clearInterval).not.toBeCalled()
  })

  test('timerLen less than or equal 0', () => {
    main.timer.timerLen = 0
    main.updateTimer()
    expect(clearInterval).toBeCalled()
  })
})

describe('stateChange', () => {
  test('In work state and number of count is less than 4', () => {
    main.pomoSession.state = 'work'
    main.pomoSession.pomoLen = 1
    main.pomoSession.count = 0
    main.stateChange()
    expect(main.pomoSession.state).toBe('shortBreak')
  })

  test('In work state and number of count is 4', () => {
    main.pomoSession.state = 'work'
    main.pomoSession.pomoLen = 2
    main.pomoSession.count = 4
    main.stateChange()
    expect(main.pomoSession.state).toBe('longBreak')
  })

  test('In shortBreak state', () => {
    const playBtn = document.getElementById('play')
    const stopBtn = document.getElementById('stop')
    main.pomoSession.state = 'shortBreak'
    main.pomoSession.pomoLen = 5
    main.pomoSession.count = 0
    main.pomoSession.sets = 1
    main.pomoSession.firstStart = false

    main.stateChange()

    expect(main.pomoSession.state).toBe('work')
    expect(main.pomoSession.count).toBe(1)
    expect(main.pomoSession.firstStart).toBe(true)
    expect(playBtn.style.display).toBe('block')
    expect(stopBtn.style.display).toBe('none')
    expect(document.getElementById('time').innerHTML).toBe('05:00')
  })

  test('In longBreak state', () => {
    const playBtn = document.getElementById('play')
    const stopBtn = document.getElementById('stop')
    main.pomoSession.state = 'longBreak'
    main.pomoSession.pomoLen = 3
    main.pomoSession.count = 4
    main.pomoSession.sets = 1
    main.pomoSession.firstStart = false

    main.stateChange()

    expect(main.pomoSession.state).toBe('work')
    expect(main.pomoSession.count).toBe(0)
    expect(main.pomoSession.sets).toBe(2)
    expect(main.pomoSession.firstStart).toBe(true)
    expect(playBtn.style.display).toBe('block')
    expect(stopBtn.style.display).toBe('none')
    expect(document.getElementById('time').innerHTML).toBe('03:00')
  })
})
