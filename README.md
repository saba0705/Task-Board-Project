# Task-Board-Project
User Story

AS A project team member with multiple tasks to organize
I WANT a task board 
SO THAT I can add individual project tasks, manage their state of progress and track overall project progress accordingly
Acceptance Criteria

GIVEN a task board to manage a project
WHEN I open the task board
THEN the list of project tasks is displayed in columns representing the task progress state (Not Yet Started, In Progress, Completed)
WHEN I view the task board for the project
THEN each task is color coded to indicate whether it is nearing the deadline (yellow) or is overdue (red)
WHEN I click on the button to define a new task
THEN I can enter the title, description and deadline date for the new task into a modal dialog
WHEN I click the save button for that task
THEN the properties for that task are saved in localStorage
WHEN I drag a task to a different progress column
THEN the task's progress state is updated accordingly and will stay in the new column after refreshing
WHEN I click the delete button for a task
THEN the task is removed from the task board and will not be added back after refreshing
WHEN I refresh the page
THEN the saved tasks persist

SOLUTION:
To have the form pop up on clicking the 'Add Task' button I added the modal form to facilitate the input of new tasks. The modal contains a form with input fields for the task title, due date, and description. 
Upon opening the task board, the list of project tasks is displayed in columns representing different progress states: Not Yet Started, In Progress, and Completed. Each task is color-coded to indicate its deadline status, with tasks nearing the deadline highlighted in yellow and overdue tasks highlighted in red.
Upon saving, the task's properties are stored in localStorage, ensuring that the task persists even after the page is refreshed.
Tasks cards can be dragged from one progress column to another by adding the #sortables and #draggable properties.
Users can delete tasks by clicking on the delete button associated with each task card.
The $(document).ready(function () { ... }) function is updated in the second script to initialize the page when it loads. It loads the task list from local storage, renders the task list, adds event listeners for form submission and task deletion, makes swim lanes droppable, and initializes the date picker for the task due date field.

