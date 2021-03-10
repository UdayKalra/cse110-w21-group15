describe('Pomo Timer', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/source/index.html');
  })

  it('First Test', () => {
    expect(true).to.equal(true);
  })

  it('Check Pomo Timer', () => {
    // Go over onboarding slides at the first time
    let loop1 = Array.from({length:6}, (v,k)=>k+1)
    cy.wrap(loop1).each(() => {
      cy.get('#onboarding-button-img').click()
    })

    // Change pomo len to 2 mins, shortbreak len to 1 min
    cy.get('#settings').click()
    cy.get('#pomo-time')
    .invoke('val', 2)
    .trigger('input')
    cy.get('#short-break-time')
    .invoke('val', 1)
    .trigger('input')

    cy.get('#time')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).equal('02:00')
    })

    // Run the timer
    cy.get('#play').click()
    cy.get('#play').should('have.attr', 'style', 'display: none;')
    cy.get('#stop').should('have.attr', 'style', 'display: block;')

    // Check the progress seeds and bar
    // Wait 5s from the beginning
    cy.wait(5000)
    cy.get('#seeds').then($el => {
      expect($el).to.have.attr('src', './assets/seeds-1.svg');
    })
    cy.get('#filler-bar-1-svg')
    .invoke('attr', 'width')
    .then(($width) => {
      const calculatedWidth = 10.375
      const actualWidth = $width
      expect(Math.abs(calculatedWidth - actualWidth)).to.be.below(0.001)
    })
    // Wait 48s from the beginning
    cy.wait(43000)
    cy.get('#seeds').then($el => {
      expect($el).to.have.attr('src', './assets/seeds-10.svg');
    })
    cy.get('#filler-bar-1-svg')
    .invoke('attr', 'width')
    .then(($width) => {
      const calculatedWidth = 99.6
      const actualWidth = $width
      expect(Math.abs(calculatedWidth - actualWidth)).to.be.below(0.001)
    })
    // Wait 120s from the beginning
    cy.wait(72000)
    cy.get('#seeds').then($el => {
      expect($el).to.have.attr('src', './assets/emptySeeds.svg');
    })
    cy.get('#filler-bar-1-svg')
    .invoke('attr', 'width')
    .then(($width) => {
      const calculatedWidth = 249
      const actualWidth = $width
      expect(Math.abs(calculatedWidth - actualWidth)).to.be.below(0.001)
    })
    // The timer changes to shortbreak state
    cy.get('#time')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).equal('01:00')
    })
    // Wait 120s+3s from the beginning
    cy.wait(3000)
    cy.get('#seeds').then($el => {
      expect($el).to.have.attr('src', './assets/seeds-1.svg');
    })
    cy.get('#filler-bar-2-svg')
    .invoke('attr', 'width')
    .then(($width) => {
      const calculatedWidth = 2.7
      const actualWidth = $width
      expect(Math.abs(calculatedWidth - actualWidth)).to.be.below(0.001)
    })
    // Wait 120s+60s from the beginning
    cy.wait(57000)
    cy.get('#seeds').then($el => {
      expect($el).to.have.attr('src', './assets/emptySeeds.svg');
    })
    cy.get('#filler-bar-1-svg')
    .invoke('attr', 'width')
    .then(($width) => {
      const calculatedWidth = 0
      const actualWidth = $width
      expect(Math.abs(calculatedWidth - actualWidth)).to.be.below(0.001)
    })
    cy.get('#filler-bar-2-svg')
    .invoke('attr', 'width')
    .then(($width) => {
      const calculatedWidth = 0
      const actualWidth = $width
      expect(Math.abs(calculatedWidth - actualWidth)).to.be.below(0.001)
    })
    // The timer stop
    cy.get('#time')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).equal('02:00')
    })
    cy.get('#play').should('have.attr', 'style', 'display: block;')
    cy.get('#stop').should('have.attr', 'style', 'display: none;')
  })

  it('Check state change of the timer', () => {
    // Go over onboarding slides at the first time
    let loop1 = Array.from({length:6}, (v,k)=>k+1)
    cy.wrap(loop1).each(() => {
      cy.get('#onboarding-button-img').click()
    })

    // Change pomo length to 1 min, shortbreak length to 1 min, longbreak length to 2 mins
    cy.get('#settings').click()
    cy.get('#pomo-time')
    .invoke('val', 1)
    .trigger('input')
    cy.get('#short-break-time')
    .invoke('val', 1)
    .trigger('input')
    cy.get('#long-break-time')
    .invoke('val', 2)
    .trigger('input')

    let loop2 = Array.from({length:4}, (v,k)=>k+1)
    cy.wrap(loop2).each(() => {
      cy.get('#time')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('01:00')
      })
      cy.get('#progress-bar-background').then($el => {
        expect($el).to.have.attr('src', './assets/backgroundProgressBar.svg');
      })
      cy.get('#play').click()
      cy.get('#play').should('have.attr', 'style', 'display: none;')
      cy.get('#stop').should('have.attr', 'style', 'display: block;')
      // Wait 2 mins
      cy.wait(120000)
      cy.get('#play').should('have.attr', 'style', 'display: block;')
      cy.get('#stop').should('have.attr', 'style', 'display: none;')
    })
    // Long Break state
    cy.get('#progress-bar-background').then($el => {
      expect($el).to.have.attr('src', '/source/assets/progressBarLongBreak.svg');
    })
    cy.get('#play').click()
    cy.wait(60000)
    cy.get('#time')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).equal('02:00')
    })
  })

  it('Check task list', () => {
    // Add Task
    cy.get('#pomo-task')
    .invoke('val', 'Task 1')
    .trigger('input')
    cy.get('#add-task').click()
    cy.get('#pomo-task')
    .invoke('val', 'Task 2')
    .trigger('input')
    cy.get('#add-task').click()
    cy.get('#pomo-task')
    .invoke('val', 'Task 3')
    .trigger('input')
    cy.get('#add-task').click()
    
    cy.get('#tasks').should(($tr) => {
      const $divs = $tr.find('p')
      expect($divs.eq(0)).to.contain('Task 1')
      expect($divs.eq(1)).to.contain('Task 2')
      expect($divs.eq(2)).to.contain('Task 3')
    })

    // Focus task 1
    cy.get('#tasks').should(($tr) => {
      const $divs = $tr.find('button')
      $divs.eq(0).click()
    })
    cy.get('div[class^="focused-task"]').should(($tr) => {
      const $p = $tr.find('p')
      expect($p).to.contain('Task 1')
    })
    // Delete task 2
    cy.get('#tasks').should(($tr) => {
      const $divs = $tr.find('button')
      $divs.eq(1).click()
    })
    cy.get('#tasks').should(($tr) => {
      const $divs = $tr.find('p')
      expect($divs.eq(0)).to.contain('Task 2')
      expect($divs.eq(1)).to.contain('Task 3')
    })
  })
})