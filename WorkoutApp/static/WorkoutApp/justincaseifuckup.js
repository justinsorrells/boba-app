class Program 
{
    selectedWeek = -1;
    selectedDay = -1;
    selectedWeekElement = null;
    selectedDayElement = null;
    openState = [];
    workouts = {
        "1": {
            "1": {}
        }
    };
    workout = [];
}

const exerciseForm = document.querySelector("#exerciseForm");
const addToWorkoutButton = document.querySelector("#addToWorkout");
const currentWorkout = document.querySelector("#currentWorkout");
const assignCurrentWorkoutButton = document.querySelector("#assignCurrentWorkout");
const assignProgramButton = document.querySelector("#assignProgram");
const programContainer = document.querySelector("#program");
const addWeekButton = document.querySelector("#addWeek");
const addDayButton = document.querySelector("#addDay");

let selectedWeek = -1;
let selectedDay = -1;
let selectedWeekElement = null;
let selectedDayElement = null;
const openState = [];

const workouts = {
    "1": {
        "1": {}
    }
};
let workout = [];

addDayButton.addEventListener('click', () => {
    if (selectedWeek == -1)
    {
        window.alert("Please select a week to add a day to");
        return;
    }
    let week = document.querySelector(`[data-week="${selectedWeek}"]`);
    if (week === null) return ;
    let lastDayOfWeek = getLastDayOfWeek(week);
    let nextDay = parseInt(lastDayOfWeek) + 1;
    if (nextDay > 7) return;
    workouts[selectedWeek.toString()][nextDay.toString()] = {};
    displayWorkouts();
});

addToWorkoutButton.addEventListener('click', () => {
    let exercise = document.querySelector("#exercise").value;
    let weight = document.querySelector("#weight").value;
    let sets = document.querySelector("#sets").value;
    let reps = document.querySelector("#reps").value;
    workout.push(
        {
            'exercise': exercise,
            'weight': weight, 
            'sets': sets,
            'reps': reps,
        }
    )
    let tempDiv = document.createElement("div");
    let tempText = document.createTextNode(`Exercise: ${exercise}, Weight: ${weight}, Sets: ${sets}, Reps: ${reps}`);
    tempDiv.append(tempText);
    currentWorkout.append(tempDiv);
});

addWeekButton.addEventListener('click', () => {
    let lastWeek = getLastWeekOfProgram();
    let nextWeek = parseInt(lastWeek) + 1;
    workouts[nextWeek.toString()] = {
        "1": {}
    };
    displayWorkouts();
});

assignCurrentWorkoutButton.addEventListener('click', () => {
    if (selectedDay == -1 || selectedWeek == -1) { 
        window.alert("Please select a day and week to assign the workout");
        return;
    }
    let week = document.querySelector(`[data-week="${selectedWeek}"]`);
    let day = week.querySelector(`[data-day="${selectedDay}"]`);
    clearDiv(day);
    workouts[selectedWeek.toString()][selectedDay.toString()] = workout;
    workout = [];
    clearDiv(currentWorkout);
    displayWorkouts();
});

assignProgramButton.addEventListener('click', () => {
    let url = window.location.href;
    let csrf = getCookie('csrftoken');
    fetch(url, 
    {
        method: 'post',
        credentials: "include",
        headers: {
            "Content-Type": 'application/json',
            "X-CSRFToken": csrf,
        },
        body: JSON.stringify(workouts),
    });
})

programContainer.addEventListener('click', (e) => {
    climbProgram(e.target);
});

// Helpers
function climbProgram(node)
{
    if (node === null) { return ;}
    let dayFlag = 0;
    while (node.parentNode && node !== programContainer)
    {
        node = node.parentNode;
        if (node.dataset.day)
        {
            dayFlag = 1;
            unselectDay(selectedDayElement);
            selectDay(node);
        }
        else if (node.dataset.week && node.dataset.week !== selectedWeek)
        {
            if (dayFlag === 0)
                unselectDay(selectedDayElement);
            unselectWeek(selectedWeekElement);
            selectWeek(node);
        }
    }
}

function clearDiv(div)
{
    while (div.firstChild)
    {
        if (div.lastChild.tagName !== "H3" && div.lastChild.tagName !== "H1")
            div.removeChild(div.lastChild);
        else 
            break;
    }
}

function clearProgramContainer()
{
    programContainer.innerHTML = '';
}

function createDay(day)
{
    let tempDay = document.createElement("div");
    tempDay.setAttribute("data-day", day);
    tempDay.setAttribute("data-type", "workout");
    let tempDayH3 = document.createElement("h3");
    let tempDayH3Text = document.createTextNode(`Day ${day}`);
    tempDayH3.append(tempDayH3Text);
    tempDay.append(tempDayH3);
    return tempDay;
}

function createWeek(week)
{
    // <button type="button" class="btn-close" aria-label="Close"></button>

    let tempWeek = document.createElement("div");
    tempWeek.setAttribute("data-week", week);

    let headerDiv = document.createElement("div");
    headerDiv.classList.add("w-100");
    headerDiv.classList.add("d-flex");
    headerDiv.classList.add("justify-content-between");
    headerDiv.classList.add("align-items-center");
    let tempTextDiv = document.createElement("div");
    let tempWeekH1 = document.createElement("h1");
    let tempWeekH1Text = document.createTextNode(`Week ${week}`);
    tempWeekH1.append(tempWeekH1Text);
    tempTextDiv.append(tempWeekH1);
    tempTextDiv.classList.add("d-flex");
    tempTextDiv.classList.add("align-items-center");
    tempTextDiv.classList.add("justify-content-around");
    let arrowIcon = document.createElement("i");
    arrowIcon.classList.add("fa-solid");
    arrowIcon.classList.add("fa-arrow-down");
    arrowIcon.classList.add("mx-2");
    tempTextDiv.append(arrowIcon);
    headerDiv.append(tempTextDiv);

    let closeButton = document.createElement("button");
    closeButton.classList.add("btn-close");
    closeButton.setAttribute("type", "button");
    closeButton.addEventListener('click', () =>
    {
        delete workouts[week];
        for (let i = parseInt(week); i < openState.length-1; i++)
        {
            openState[i] = openState[i + 1];
        }
        openState.pop();
        displayWorkouts();
    })
    headerDiv.append(closeButton);

    tempWeek.append(headerDiv);
    let hr = document.createElement("hr");
    tempWeek.append(hr);
    let workoutBox = document.createElement("div");
    workoutBox.classList.add('bg-body');
    workoutBox.style.overflow = "hidden";
    workoutBox.style.maxHeight = '0px';
    tempWeek.append(workoutBox);
    tempWeek.classList.add('bg-body');
    let intWeek = parseInt(week);
    if (openState[intWeek] == undefined)
    {
        openState[intWeek] = 0;
        arrowIcon.classList.add("fa-rotate-270");
    }
    else if (openState[intWeek])
        workoutBox.style.maxHeight = "600px";
    else
        arrowIcon.classList.add("fa-rotate-270");
    arrowIcon.addEventListener('click', () =>
    {
        let state = openState[intWeek];
        console.log(state);
        if (!state)
        {
            arrowIcon.classList.remove("fa-rotate-270");
            workoutBox.style.maxHeight = "600px";
            openState[intWeek] = 1;
        }
        else
        {
            arrowIcon.classList.add("fa-rotate-270");
            workoutBox.style.maxHeight = "0px";
            openState[intWeek] = 0;
        }
    })
    return tempWeek;
}
function displayWorkouts()
{
    clearProgramContainer();
    let weekIndex = 1;
    for (let week of Object.keys(workouts))
    {
        if (weekIndex != week)
        {
            workouts[weekIndex.toString()] = workouts[week];
            delete workouts[week];
            week = weekIndex.toString();
        }
        let weekElement = createWeek(week);
        if (selectedWeek === week)
        {
            selectWeek(weekElement);
        }
        for (const day of Object.keys(workouts[week]))
        {
            let dayElement = createDay(day);
            if (selectedWeek === week && selectedDay === day)
            {
                selectDay(dayElement);
            }
            for (let i = 0; i < workouts[week][day].length; i++)
            {
                let textDiv = document.createElement('div');
                let textNode = document.createTextNode(`Exercise: ${workouts[week][day][i]['exercise']}, Weight: ${workouts[week][day][i]['weight']}, Sets: ${workouts[week][day][i]['sets']}, Reps: ${workouts[week][day][i]['reps']}`);
                textDiv.append(textNode);
                dayElement.append(textDiv);
            }
            weekElement.querySelector('.bg-body').append(dayElement);
        }
        programContainer.append(weekElement);
        weekIndex++;
    } 
}

function getCookie(name)
{
    let cookies = document.cookie;
    cookies = cookies.split('=');
    for (let i = 0; i < cookies.length; i++)
    {
        if (cookies[i] === name) return cookies[i+1];
    }
    return null;
}

function getLastDayOfWeek(week)
{
    let days = week.querySelectorAll("[data-day]");
    let lastDay = days[days.length-1].dataset.day ? days[days.length-1].dataset.day : 0;
    return lastDay;
}

function getLastWeekOfProgram()
{
    let len = Object.keys(workouts).length;
    let output = len > 0 ? len : 0;
    return output;
}

function selectDay(day)
{
    if (day === null) return;
    day.classList.add('bg-secondary');
    selectedDay = day.dataset.day;
    selectedDayElement = day;
}

function selectWeek(week)
{
    selectedWeek = week.dataset.week;
    selectedWeekElement = week;
}

function unselectDay(day)
{
    if (day === null) return;
    day.classList.remove('bg-secondary');
    selectedDayElement = null;
    selectedDay = -1;
}

function unselectWeek(week)
{
    if (week === null) return;
    selectedWeekElement = null;
    selectedWeek = -1;
}

window.addEventListener('load', () => {
    displayWorkouts();
})