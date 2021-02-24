/* script for modifying the task list via drag-and-drop
 * this file may later absorb all of the task list functionality */

/* TODO:
   create event listeners and functions for each of the buttons here
   modify delfromList to work with new modifications
*/
function tasklist () {
  const masterList = []

  document.getElementById('add-task').addEventListener('click', addToList)

  const list = document.getElementById('tasks')
  const listItems = []
  const delBtns = []
  const dropZones = []
  let curr

  function buildNewTask () {
    const taskInput = document.getElementById('pomo-task')
    const newTask = document.createElement('div')
    newTask.setAttribute('class', 'task-object')

    /* fill task object with it's buttons and text elements */
    const moveButton = document.createElement('button')
    moveButton.setAttribute('class', 'move-task-button')
    moveButton.innerHTML = '<img src="assets/moveTask.svg" alt="move task" id="move-task-icon">'
    newTask.appendChild(moveButton)

    const delButton = document.createElement('button')
    delButton.setAttribute('class', 'delete-task-button')
    delButton.innerHTML = '<img src="assets/minusSign.svg" alt="delete task" id="delete-task-icon">'
    newTask.appendChild(delButton)

    const pomoNum = document.createElement('p')
    pomoNum.setAttribute('class', 'task-pomo-num')
    pomoNum.innerHTML = '0'
    newTask.appendChild(pomoNum)

    const taskText = document.createElement('p')
    taskText.setAttribute('class', 'task-text')
    taskText.innerHTML = taskInput.value
    newTask.appendChild(taskText)

    const compButton = document.createElement('button')
    compButton.setAttribute('class', 'complete-task-button')
    compButton.innerHTML = '<img src="assets/checkTask.svg" alt="complete task" id="complete-task-icon">'
    newTask.appendChild(compButton)

    taskInput.value = ''

    return newTask
  }

  /* this function adds bullet points and drag spaces to our list
     there is a cleaner way to do this, will update next sprint :)
     involves just adding to array then redrawing list, like in the
     functions to remove or rearrange */
  function addToList () {
    const newTask = buildNewTask()
    const tmptask = {
      taskBody: newTask,
      time: 0
    }
    masterList.push(tmptask)

    const dropZone = document.createElement('div')
    dropZone.setAttribute('id', 'drop-zone')

    /* this sets listeners for our drop areas to let us drop tasks into other spots */
    /* dragenter: when mouse enters boundary of drop area
       dragleave: when mouse leaves boundary of drop area
       dragover:  when element is being dragged over another
       drop:      when element is dropped */
    dropZones.push(dropZone)
    for (let i = 0; i < dropZones.length; i++) {
      dropZones[i].addEventListener('dragenter', function () { dragIn(this) })
      dropZones[i].addEventListener('dragleave', function () { dragOut(this) })
      dropZones[i].addEventListener('dragover', function (event) { dragOn(event) })
      dropZones[i].addEventListener('drop', function (event) { dropMove(event, this) })
    }

    /* these are listeners for when we drag a task item */
    /* dragstart: mouse is held and moved
       dragend:   when drag stops (seems similar to drop but follows the element
       being dragged instead of the drop zone) */
    newTask.addEventListener('dragstart', function () { dragTask(this) })
    newTask.addEventListener('dragend', function () { dropEnd() })

    redrawList()
  }

  /* removes an item from our task list */
  // function delFromList () {
  //   /* get rid of the button and bullet from our arrays before deleting it */
  //   listItems.splice(delBtns.indexOf(this), 1)
  //   delBtns.splice(delBtns.indexOf(this), 1)

  //   /* also get rid of the drop zone below the element being deleted */
  //   dropZones.splice(delBtns.indexOf(this), 1)

  //   redrawList()
  // }

  /* highlights valid drop zones when the dragged item moves over them */
  function dragIn (zone) {
    zone.setAttribute('class', 'active')
  }

  /* removes highlight on drop zones when dragged item leaves */
  function dragOut (zone) {
    zone.setAttribute('class', '')
  }

  /* dragover default needs to be overridden for proper dropping */
  function dragOn (event) {
    event.preventDefault()
  }

  /* this just helps us keep track of which bullet point is being moved */
  function dragTask (item) {
    curr = item
  }

  /* rearranges the list when an item is dropped */
  function dropMove (event, item) {
    /* NOTE: there is definitely a more clever way of doing this
       involving the indexOf function
       these weird for loops basically find out where the item
       and dropzone is in their respective arrays */
    let bulletIndex
    let dropIndex
    event.preventDefault()
    for (let i = 0; i < listItems.length; i++) {
      if (curr === listItems[i]) {
        bulletIndex = i
      }
    }

    for (let i = 0; i < dropZones.length; i++) {
      if (item === dropZones[i]) {
        dropIndex = i
      }
    }

    /* then we rearrange their array positions and re-draw the task list */
    movePos(bulletIndex, dropIndex)
    redrawList()

    dropEnd()
  }

  /* this is for manually removing the highlights, similar to dragOut function
     but when we rearrange it only fires a dragend event and not
     a dragleave so the highlight stays haha */
  function dropEnd () {
    for (const i of dropZones) {
      i.setAttribute('class', '')
    }
  }

  /* take our bullet point and drop zone and use them to rewrite the array */
  function movePos (bullet, drop) {
    const tmpB = listItems[bullet]
    const tmpD = delBtns[bullet]

    /* delete old bullet then put it in new spot in array */
    listItems.splice(bullet, 1)
    delBtns.splice(bullet, 1)
    if (drop === 0) {
      listItems.splice(drop, 0, tmpB)
      delBtns.splice(drop, 0, tmpD)
    } else {
      listItems.splice(drop - 1, 0, tmpB)
      delBtns.splice(drop - 1, 0, tmpD)
    }
  }

  /* this deletes all of the children of the task list and repopulates them
     using the arrays that represent their contents */
  function redrawList () {
    while (list.firstChild) {
      list.removeChild(list.firstChild)
    }

    /* this is the first dropZone, then every bullet point also has an
       associated dropZone below it so we have coverage above and below
       every bullet */
    // list.appendChild(dropZones[0])

    /* for (let i = 1; i < dropZones.length; i++) {
       list.appendChild(listItems[i - 1])
       list.appendChild(dropZones[i])
       } */

    for (let i = 0; i < masterList.length; i++) {
      list.appendChild(masterList[i].taskBody)
    }
  }
}

tasklist()
