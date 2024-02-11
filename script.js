const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    // Append input field for time reminder
    li.innerHTML += '<input type="time" class="reminder">';
    // Append span for countdown timer
    li.innerHTML += '<span class="countdown"></span>';
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.classList.add("cancel"); // Add the class "cancel"
    span.textContent = "×"; // Set the text content to "×"
    li.appendChild(span); // Append the span element to the list item (li)    
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      // Toggle visibility of countdown timer when task is checked/unchecked
      let countdown = e.target.querySelector(".countdown");
      countdown.style.display = e.target.classList.contains("checked")
        ? "none"
        : "block";
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

// Add event listener to set reminders for tasks
listContainer.addEventListener("change", function (e) {
  if (e.target.classList.contains("reminder")) {
    var reminderTime = e.target.value;
    var taskText = e.target.parentNode.innerText;
    if (reminderTime) {
      alert("Reminder set for " + reminderTime + " for task: " + taskText);
      // Here you can implement code to handle the reminder, such as sending notifications or alerts
      startCountdown(e.target.parentNode);
    }
  }
});

function startCountdown(taskItem) {
  var countdownElement = taskItem.querySelector(".countdown");
  var reminderTime = taskItem.querySelector(".reminder").value;
  var [hours, minutes] = reminderTime.split(":").map(Number);
  var endTime = new Date();
  endTime.setHours(hours);
  endTime.setMinutes(minutes);

  function updateCountdown() {
    var now = new Date();
    var timeDiff = endTime - now;
    if (timeDiff > 0) {
      var hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
      var minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      var secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
      countdownElement.textContent = `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
    } else {
      countdownElement.textContent = "Time is up!";
      clearInterval(countdownInterval);
    }
  }

  updateCountdown();
  var countdownInterval = setInterval(updateCountdown, 1000);
}

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
  var reminders = document.querySelectorAll(".reminder");
  reminders.forEach(function (reminder) {
    if (reminder.value) {
      startCountdown(reminder.parentNode);
    }
  });
}

showTask();
