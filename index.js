///////////////////////////////////////////// Variables /////////////////////////////////////////////////////

// Task list
let taskList = [];


// Setting Local Storage
if (localStorage.getItem("task") === null) {
  localStorage.setItem("task", JSON.stringify(taskList));
} else {
  taskList = JSON.parse(localStorage.getItem("task"));
}


// Title & Subtitle
let mainTitle = document.getElementsByClassName("TodoList_MainTitle");
let subTitle = document.getElementsByClassName("TodoList_SubTitle");
subTitle[0].innerText = `You've got ${taskList.length} task to do today.`;


// Add Task Card Variables
let addTaskCard = document.getElementsByClassName("TodoList_AddTaskCard");
let addTaskInput = document.getElementsByClassName("TodoList_InputField");
let addTaskDesc = document.getElementsByClassName("TodoList_Description");
let addTaskTime = document.getElementsByClassName("TodoList_SetTime");
let addTaskBtn = document.getElementsByClassName("TodoList_AddTaskBtn");


// TodoList Scroll Variables
let scrollComp = document.getElementsByClassName("TodoList_ListScroll");


// Edit Card Variables
let deleteCard = document.getElementsByClassName("TodoList_Finish");
let updateCard = document.getElementsByClassName("TodoList_Update");
let finishCard = document.getElementsByClassName("TodoList_Finish");

let editInput = document.getElementsByClassName("TodoList_EditInputField");
let editDesc = document.getElementsByClassName("TodoList_EditDesc");
let editTime = document.getElementsByClassName("TodoList_EditTime");


// Date Variable
let currentDate = new Date();
let currentHrs = currentDate.getHours();
let currentMins = currentDate.getMinutes();
let cardTimeColor = "";
let cardTime = "";


///////////////////////////////////////////// Event Handlers /////////////////////////////////////////////////////


// Add task to Local Storage List
function onTaskAdded() {

  // Stores Data in local variables
  var title = addTaskInput[0].value;
  var desc = addTaskDesc[0].value;
  var time = addTaskTime[0].value;

  // Current Time variables
  var newHr = parseInt(time.charAt(0) + time.charAt(1));
  var newMin = parseInt(time.charAt(3) + time.charAt(4));

  /* if is executed if below conditon is satisfied:
     1] Give Time is less than current time
     2] If title, description and time are empty
  */
  if (((newHr <= currentHrs && newMin <= currentMins) || time === "00:00" || time === "--:--")  || title === "" || desc === "") {
    addTaskCard[0].style.border = "1px solid red";
    addTaskTime[0].style.border = "1px solid red";
    addTaskDesc[0].style.borderTop = "1px solid red";

    // else is executed
  } else {
    addTaskTime[0].style.border = "1px solid #D1D5DB";

    // stores sorted list in taskList
    taskList = taskSort({
      title,
      desc,
      time,
      completeStatus: false,
      updateStatus: false,
    });

    // Update Local store
    localStorage.setItem("task", JSON.stringify(taskList));

    // Initialize Add Task Card
    addTaskInput[0].value = "";
    addTaskDesc[0].value = "";
    addTaskTime[0].value = "00:00";

    // display list of task
    displayData();
  }
}


// It is called when Task Data Added, to change border color to previous state
function addTaskDataAdded() {
  addTaskDesc[0].style.borderTop = "1px solid #D1D5DB";
  addTaskCard[0].style.border = "1px solid #D1D5DB";
  addTaskTime[0].style.border = "1px solid #D1D5DB";
}


// Deleting Task From List
function onTaskDelete(index) {

  // delete task from specified index
  taskList.splice(index, 1);

  // update the list to local storage
  localStorage.setItem("task", JSON.stringify(taskList));

  // display the task list
  displayData();
}


// Updating Task From List
function onTaskUpdate(index) {
  // change updateStatus to true for specified index
  taskList[index].updateStatus = true;

  // update the list to local storage
  localStorage.setItem("task", JSON.stringify(taskList));

  // display the task list
  displayData();
}


// Is called when task wanted to be updated
function updateTaskToLocalStorage(index) {
  // Stores value of each input fields in below given local variables
  var title = editInput[0].value;
  var desc = editDesc[0].value;
  var time = editTime[0].value;

  // Current Time variables
  var newHr = parseInt(time.charAt(0) + time.charAt(1));
  var newMin = parseInt(time.charAt(3) + time.charAt(4));

  /* if is executed if below conditon is satisfied:
     1] Give Time is less than current time
     2] If title, description and time are empty
  */

  if (title === "" || desc === "" || ((newHr <= currentHrs && newMin <= currentMins) || time === "00:00" || time === "--:--") ) {
    finishCard[0].style.opacity = 1;
  } else {

    // Initially deletes the specified index data
    taskList.splice(index, 1);

    // Sorts the list as per time
    taskList = taskSort({
      title,
      desc,
      time,
      completeStatus: false,
      updateStatus: false,
    });

    // update localstorage value with new list data
    localStorage.setItem("task", JSON.stringify(taskList));

    // display task list on the screen
    displayData();
  }
}


// This function is called when checkbox on the edit card is clicked
function taskCompleted(index) {
  // change value of completeStatus for specified index
  taskList[index].completeStatus = !taskList[index].completeStatus;

  // Update the list to local storage
  localStorage.setItem("task", JSON.stringify(taskList));

  // display the task list on the page
  displayData();
}

// This function clears the local storage
function clearLocalStorage() {
  taskList = [];

  // Update the local storage and clears data in task
  localStorage.setItem("task", JSON.stringify(taskList));

  // display the task list
  displayData();
}

///////////////////////////////////////////// Normal Function /////////////////////////////////////////////////////


// Function for sorting task list
function taskSort(data) {

  var index = -1;
  let newTaskList = [];
  var newHr = parseInt(data.time.charAt(0) + data.time.charAt(1));
  var hr = "";
  var newMin = parseInt(data.time.charAt(3) + data.time.charAt(4));
  var min = "";

  if (taskList.length === 0) {
    newTaskList.push(data);
  } else {
    for (var i = 0; i < taskList.length; i++) {

      hr = parseInt(taskList[i].time.charAt(0) + taskList[i].time.charAt(1));
      min = parseInt(taskList[i].time.charAt(3) + taskList[i].time.charAt(4));

      if (hr > newHr) {

        newTaskList.push(data);
        index = i;
        break;

      } else if(hr < newHr) {

        newTaskList.push(taskList[i]);
        index = -1;
        continue;
      
      }else if(hr == newHr) {

        if (min >= newMin) {
          newTaskList.push(data);
          index = i;
          break;
        } else {
          newTaskList.push(taskList[i]);
          index = -1;
          continue;
        }
      }

      newTaskList.push(taskList[i]);
    }

    if (index === -1) {
      newTaskList.push(data);
    } else {
      for (var i = index; i < taskList.length; i++) {
        newTaskList.push(taskList[i]);
      }
    }
  }

  return newTaskList;
}

// This function returns the task count whose completeStatus is true
function checkTaskCount() {
  var cnt = 0;
  taskList.map((task) => {
    if (!task.completeStatus) cnt++;
  });

  return cnt;
}

// Show Date in AM / PM Format
function displayDate(oldTime) {

  var colorFlag = "black";
  var hrs = parseInt(oldTime.charAt(0) + oldTime.charAt(1));
  var mins = parseInt(oldTime.charAt(3) + oldTime.charAt(4));
  var newTime = "";
  
  if (hrs > 11) {
    if((hrs-12) === 0)
      newTime = 12 + ":" + oldTime.charAt(3) + oldTime.charAt(4) + " PM";
    else
      newTime = hrs - 12 + ":" + oldTime.charAt(3) + oldTime.charAt(4) + " PM";
  } else if (hrs < 9) {
    newTime = "0" + hrs + ":" + oldTime.charAt(3) + oldTime.charAt(4) + " AM";
  } else {
    newTime = hrs + ":" + oldTime.charAt(3) + oldTime.charAt(4) + " AM";
  }

  if(currentHrs > hrs) {
    
    colorFlag = "red"

  } else if(currentHrs == hrs) {
    if(currentMins >= mins) {
      colorFlag = "red"
    }
  }

  cardTimeColor = colorFlag;
  cardTime = newTime;

}

// Function for Displaying Task List
function displayData() {

  if (currentHrs >= 1 && currentHrs < 12) {
    mainTitle[0].innerText = "Good Morning Prathamesh,";
  } else if (currentHrs >= 13 && currentHrs <= 16) {
    mainTitle[0].innerText = "Good After Noon Prathamesh,";
  } else if (currentHrs >= 17 && currentHrs <= 22) {
    mainTitle[0].innerText = "Good Evening Prathamesh,";
  } else {
    mainTitle[0].innerText = "Good Night Prathamesh,";
  }

  // Update the subtitle of the page
  subTitle[0].innerText = `You've got ${checkTaskCount()} task to do today.`;

  if (taskList.length !== 0) {
    scrollComp[0].innerHTML = "";

    taskList.map((task, index) => {
      if (!task.updateStatus) {
        
        displayDate(task.time);

        scrollComp[0].innerHTML += `
                  <div class= ${
                    !task.completeStatus  
                      ? "TodoList_EditCard"
                      : "TodoList_Completed"
                  }>
                    <div class="TodoList_TitleCheckBox">
                      <p class="TodoList_EditCardTitle">${task.title}</p>
                      ${
                        !task.completeStatus
                          ? `<input class="TodoList_EditCheckBox" type="checkbox" onclick="taskCompleted(${index})"/>`
                          : `<input class="TodoList_EditCheckBox" checked type="checkbox" onclick="taskCompleted(${index})"/>`
                      }
                    </div>

                    <div class="TodoList_MiddleLine1"></div>

                    <div class="TodoList_EditDescripion">
                      ${task.desc}
                    </div>

                    <div class="TodoList_EditButtonBlock">
                      <p class="TodoList_FixTime ${cardTimeColor}">From: ${cardTime} </p>

                      <div class="TodoList_EditCardBtnBlock">
                        <ill
                          type="button"
                          class= "${
                            task.completeStatus
                              ? "unClickEffect btn btn-success TodoList_Update"
                              : "btn btn-success TodoList_Update"
                          }"
                          onclick="onTaskUpdate(${index})"
                        >
                          Update Task
                        </ill always look like this unsorted. First by button>
                        <button
                          type="button"
                          class= "${
                            task.completeStatus
                              ? "unClickEffect btn btn-danger TodoList_Finish"
                              : "btn btn-danger TodoList_Finish"
                          }"
                          onclick="onTaskDelete(${index})"
                        >
                          Delete Task
                        </button>
                      </div>
                    </div>
                  </div>
              `;
      } else {
        scrollComp[0].innerHTML += `
                <div class="TodoList_AddTaskCard TodoList_AddTaskCard1">
                  <input
                    class="TodoList_EditInputField"
                    placeholder="Add Task Here ..."
                    value = "${task.title}"
                  />
                  <textarea
                    class="TodoList_EditDesc"
                    placeholder="Description"
                    rows="3"
                  >${task.desc}</textarea>

                  <div class="TodoList_ButtonBlock">
                    <input
                      type="time"
                      class="TodoList_EditTime"
                      edge
                      value="${task.time}"
                      timeformat="12h"
                    />
                    <button
                      type="button"
                      class="btn btn-success TodoList_Finish"
                      onclick={updateTaskToLocalStorage(${index})}
                    >
                      Finish
                    </button>
                  </div>
                </div>
              `;
      }
    });

    // if local storage is empty else is executed which prints No task for today
  } else {
    scrollComp[0].innerHTML = `<div class="TodoList_EditSubTitle">No task for today</div>`;
  }
}


displayData();

// Initially display the task list
setInterval(() => {

  currentDate = new Date();
  currentHrs = currentDate.getHours();
  currentMins = currentDate.getMinutes();

  displayData();
}, 100000);
