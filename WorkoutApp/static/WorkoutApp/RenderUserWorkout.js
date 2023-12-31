let selectedWeek = 0;
let selectedDay = -1;
let selectedWeekElement = null;
let selectedDayElement = null;
let openState = [];
let workouts = {
    "1": {
        "1": {}
    }
};
let workout = [];

const currentWorkout = document.querySelector("#currentWorkout");
const programContainer = document.querySelector("#program");

function initialize()
{
    displayWorkouts();
}

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
    tempDay.classList.add('d-flex');
    tempDay.classList.add('flex-column');
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
            let workoutTable = document.createElement('table');
            workoutTable.classList.add('text-center');
            let headers = document.createElement('thead');
            let headerRow = document.createElement('tr');

            let exerciseHeader = document.createElement('th');
            exerciseHeader.appendChild(document.createTextNode('Exercise'));
            let weightHeader = document.createElement('th');
            weightHeader.appendChild(document.createTextNode('Weight'));
            let setHeader = document.createElement('th');
            setHeader.appendChild(document.createTextNode('Set'));
            let repHeader = document.createElement('th');
            repHeader.appendChild(document.createTextNode('Reps'));

           headerRow.append(exerciseHeader, setHeader, weightHeader, repHeader);
            headers.appendChild(headerRow);

            workoutTable.appendChild(headers);

            if (selectedWeek === week && selectedDay === day)
            {
                selectDay(dayElement);
            }
            
            for (const exercise of Object.keys(workouts[week][day]))
            {
                for (const set of Object.keys(workouts[week][day][exercise])) {
                    let exerciseRow = document.createElement('tr');
                    exerciseRow.setAttribute("data-day", day);
                    exerciseRow.setAttribute('data-week', week);
                    exerciseRow.setAttribute('data-exercise', exercise);

                    let exerciseLabel = document.createElement('th');
                    let exerciseName = document.createTextNode(`${exercise}`);
                    exerciseLabel.appendChild(exerciseName);

                    let setLabel = document.createElement('td');
                    let setText = document.createTextNode(set);
                    setLabel.appendChild(setText);

                    let weightEntry = document.createElement('td');
                    let weightInput = document.createElement('input');
                    weightInput.setAttribute('value', workouts[week][day][exercise][set]['weight']);
                    weightInput.setAttribute("data-day", day);
                    weightInput.setAttribute('data-week', week);
                    weightInput.setAttribute('data-exercise', exercise);
                    weightInput.setAttribute("data-set", set);
                    weightInput.setAttribute('data-info', 'weight');
                    weightEntry.append(weightInput);

                    let repEntry = document.createElement('td');
                    let repInput = document.createElement('input');
                    repInput.setAttribute('value', workouts[week][day][exercise][set]['reps']);
                    repInput.setAttribute("data-day", day);
                    repInput.setAttribute('data-week', week);
                    repInput.setAttribute('data-exercise', exercise);
                    repInput.setAttribute("data-set", set);
                    repInput.setAttribute('data-info', 'reps');
                    repEntry.append(repInput);

                    let removeSet = document.createElement('td');
                    let removeSetText = document.createTextNode('X');
                    removeSet.setAttribute("data-day", day);
                    removeSet.setAttribute("data-week", week);
                    removeSet.setAttribute("data-exercise", exercise);
                    removeSet.setAttribute("data-set", set);
                    removeSet.setAttribute("data-info", "removeSet");
                    removeSet.appendChild(removeSetText);

                    let addSet = document.createElement('td');
                    let addSetText = document.createTextNode('+');
                    addSet.setAttribute("data-day", day);
                    addSet.setAttribute("data-week", week);
                    addSet.setAttribute("data-exercise", exercise);
                    addSet.setAttribute("data-set", set);
                    addSet.setAttribute('data-info', 'addSet');
                    addSet.appendChild(addSetText);

                    exerciseRow.append(exerciseLabel, setLabel, weightEntry, repEntry, addSet, removeSet);
                    workoutTable.append(exerciseRow);
                }
            }
            dayElement.append(workoutTable);
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
    // day.classList.add('bg-secondary');
    selectedDay = day.dataset.day;
    selectedDayElement = day;
}

function selectWeek(week)
{
    selectedWeek = week.dataset.week;
    selectedWeekElement = week;
}

function updateWorkoutRequest() {
    let csrf = getCookie("csrftoken");
    let url = window.location.href;
    let content = JSON.stringify(workouts);
    fetch(url, {
        method: "POST",
        headers: {
            "X-CSRFTOKEN": csrf,
        },
        body: content,
    });
    console.log(content);
}

function updateWorkout(element) {
    let week = element.dataset.week;
    let day = element.dataset.day;
    let exercise = element.dataset.exercise;
    let set = element.dataset.set;
    let info = element.dataset.info;
    workouts[week][day][exercise][set][info] = element.value;
    updateWorkoutRequest();
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
    initialize();
    let programDetails = JSON.parse(document.getElementById("program_details").textContent);
    if (programDetails) {
        workouts = programDetails;
    }
    console.log(workouts);
    displayWorkouts();
    document.querySelector("body").addEventListener("keyup", (e) => {
        updateWorkout(e.target);
    });
})
