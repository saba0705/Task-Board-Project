let formEl = $('#modal-form');
let taskNameInputEl = $('#task-name');
let taskDescriptionEl = $('#task-description');
let dueDateEl = $('#tast-due-date');

let printtask = function (_name, _description, _dueDate) {
    let formEl = $('<div>').addClass('task');
    let nameEl = $('<h2>').text(_name);
    let descriptionEl = $('<p>').text(_description);
    let dueDateEl = $('<p>').text(_dueDate);
    formEl.append(nameEl, descriptionEl, dueDateEl);
}

let handleFormSubmit = function (event) {
    event.preventDefault();

    let name = taskNameInputEl.val().trim();
    let description = taskDescriptionEl.val().trim();
    let dueDate = dueDateEl.val().trim();

    if (!name || !description || !dueDate) {
        console.log('You need to fill out the form!');
        return;
    }
    printInput(name, description, dueDate);
    taskNameInputEl.val('');
    taskDescriptionEl.val('');
    dueDateEl.val('');
};

formEl.on('submit', handleFormSubmit);


//Add a date picker widget to the due date field
$(function () {
    $("#due-date").datepicker();
});
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return taskList.length > 0 ? Math.max(...taskList.map(task => task.id)) + 1 : 1;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>') .addClass('task-card');
    taskCard.addClass('task-card');
    const cardHeader =$( '<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const carddueDate = $('<p>').addClass('card-text').text(task.dueDate);
    taskCard.draggable = true;
    const deleteButton = $('<button>').addClass('btn btn-danger delete').text('Delete')
    .attr('data-task-id', task.id);
    deleteButton.on('click', handleDeleteTask);

    // Append the task card to the container with the ID "todo-cards"
    if(task.dueDate && task.status !== 'done'){
       const now = dayjs();
       const taskdueDate = dayjs(task.dueDate, "MM-DD-YYYY");
       if (now.isSame (taskdueDate, 'day')) {
         taskCard.addClass('bg-warning text-white');
       } else if (now.isAfter(taskdueDate)){
            taskCard.addClass('bg-danger text-white');
       }
    }
    cardBody.append(cardDescription, carddueDate, deleteButton);
    taskCard.append(cardHeader, cardBody);
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#to-do").empty();
    $("#in-progress").empty();
    $("#done").empty();
    taskList.forEach(task => {
        // Get the corresponding swim lane container based on the task status
        let taskColumn;
        if (task.status === 'to-do') {
            $('#to-do').append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            $('#in-progress').append(createTaskCard(task));
        } else if (task.status === 'done') {
            $('#done').append(createTaskCard(task));
        }
    });

    // ? Use JQuery UI to make task cards draggable
  $('.task-card').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const title = document.getElementById('task-name').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('datepicker').value;

    // Create a new task object with the retrieved details
    const newTask = {
        id: generateTaskId(), // Generate a unique task ID
        title: title,
        description: description,
        dueDate: dueDate,
        status: 'to-do', // Set the initial status of the task to "to-do"
    };



    // Add the new task to the taskList array
    taskList.push(newTask);

    // Update the tasks data stored in localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();

    // Hide the modal after adding the task
    $('#formModal').modal('hide');
}




// Todo: create a function to handle deleting a task
function handleDeleteTask(_event) {
    let taskId = $(this).closest(".task-card").attr("data-task-id");
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(_event, ui) {
    let taskId = ui.draggable.attr("data-task-id");
    let status = $(this).attr("id");
    let task = taskList.find(task => task.id === parseInt(taskId));
    task.status = status;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#task-form").on("submit", handleAddTask);
    $(".delete").on("click", handleDeleteTask);
    $(".lane").droppable({
        drop: handleDrop
    });
    $('#task-due-date').datepicker({
        dateFormat: 'yy-mm-dddd'
    });

});
