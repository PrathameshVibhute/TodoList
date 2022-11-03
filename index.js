///////////////////////////////////////////// Variables /////////////////////////////////////////////////////

// Task list
let taskList = [];


// Setting Local Storage
if (localStorage.getItem("task") === null) {

  localStorage.setItem("task", JSON.stringify(taskList));

} else if (JSON.parse(localStorage.getItem("task")).length !== 0) {
  
  taskList = JSON.parse(localStorage.getItem("task"));

} else {
  
  localStorage.setItem("task", JSON.stringify(taskList));

}


 

// Title & Subtitle
let mainTitle = document.getElementsByClassName("TodoList_MainTitle");
let subTitle = document.getElementsByClassName("TodoList_SubTitle");
subTitle[0].innerText = `You've got ${taskList.length} task to do today.`

// Add Task Card Variables
let addTaskCard = document.getElementsByClassName("TodoList_AddTaskCard");
let addTaskInput = document.getElementsByClassName("TodoList_InputField");
let addTaskDesc = document.getElementsByClassName("TodoList_Description");
let addTaskTime = document.getElementsByClassName("TodoList_SetTime");
let addTaskBtn = document.getElementsByClassName("TodoList_AddTaskBtn");

// Local storage Variable
console.log("Local Storage:", localStorage);

// TodoList Scroll Variables
let scrollComp = document.getElementsByClassName("TodoList_ListScroll");

// Edit Card Variables
let deleteCard = document.getElementsByClassName("TodoList_Finish");
let updateCard = document.getElementsByClassName("TodoList_Update");
let finishCard = document.getElementsByClassName("TodoList_Finish");

let editInput = document.getElementsByClassName("TodoList_EditInputField");
let editDesc = document.getElementsByClassName("TodoList_EditDesc");
let editTime = document.getElementsByClassName("TodoList_EditTime");




///////////////////////////////////////////// Event Handlers /////////////////////////////////////////////////////

// Add task to Local Storage List
function onTaskAdded() {

  // Stores Data in local variables
  var title = addTaskInput[0].value;
  var desc = addTaskDesc[0].value;
  var time = addTaskTime[0].value;

  // if is executed if below conditon is satisfied
  if (time === "00:00" || title === "" || desc === "") {

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


// It is called when Task Data Added
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

  if(title === "" || desc === "" || time === "00:00") {
    
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
  localStorage.setItem('task', JSON.stringify(taskList));

  // display the task list
  displayData();
}


///////////////////////////////////////////// Normal Function /////////////////////////////////////////////////////

// Function for sorting task list
function taskSort(data) {

  var index = -1;
  let newTaskList = [];
  var hr1 = parseInt(data.time.charAt(0) + data.time.charAt(1));
  var hr2 = "";

  if(taskList.length === 0) {
    newTaskList.push(data);
  } else {
    for(var i = 0; i < taskList.length; i++){

      console.log(taskList[i])
      hr2 =  parseInt(taskList[i].time.charAt(0) + taskList[i].time.charAt(1));
      min2 = parseInt(taskList[i].time.charAt(3) + taskList[i].time.charAt(4));

      if(hr2 > hr1) {
        newTaskList.push(data);
        index = i;
        break;
      }  

      newTaskList.push(taskList[i]);
    }

    if(index === -1) {
    
      newTaskList.push(data);
    } else {

      for(var i = index; i < taskList.length; i++) {
        console.log(taskList[i]);
        newTaskList.push(taskList[i]);
      }
    }
  } 

  return newTaskList;
}

// Function for Displaying Task List
function displayData() {

  var hr = new Date().getHours();

  if(hr >= 1 && hr < 12) {
    mainTitle[0].innerText = "Good Morning Prathamesh,"; 
  } else if (hr >= 13 && hr <= 16) {
    mainTitle[0].innerText = "Good After Noon Prathamesh,";
  } else if(hr >= 17 && hr <= 22) {
    mainTitle[0].innerText = "Good Evening Prathamesh,";
  } else {
    mainTitle[0].innerText = "Good Night Prathamesh,";
  }

   // Update the subtitle of the page
   subTitle[0].innerText = `You've got ${taskList.length} task to do today.`

  if (taskList.length !== 0) {
    scrollComp[0].innerHTML = "";

    taskList.map((task,index) => {
      if (task.updateStatus === false) {
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
                      <p class="TodoList_FixTime">From: ${
                        task.time
                      } Today</p>

                      <div class="TodoList_EditCardBtnBlock">
                        <ill
                          type="button"
                          class="btn btn-success TodoList_Update"
                          onclick="onTaskUpdate(${index})"
                        >
                          Update Task
                        </ill always look like this unsorted. First by button>
                        <button
                          type="button"
                          class="btn btn-danger TodoList_Finish"
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
                <div class="TodoList_AddTaskCard">
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
    })

    // if local storage is empty else is executed which prints No task for today
  } else {
    scrollComp[0].innerHTML = `<div class="TodoList_EditSubTitle">No task for today</div>`;
  }
}


// Initially display the task list
displayData();
