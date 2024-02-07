document.addEventListener("DOMContentLoaded", function () {
    let Events_Array = [];

    // Load events from local storage
    const storedEvents = JSON.parse(localStorage.getItem("events"));
    if (storedEvents) {
        Events_Array = storedEvents;
        Events_Array.forEach((event) => {
            event.intervalId = setInterval(updateTime, 1000);
        });
        renderEvents();
    }

    function updateTime() {
        const event_list = document.getElementById("event-container");
        event_list.innerHTML = "";

        Events_Array.forEach((event) => {
            const target_time = new Date(event.Time_value).getTime();
            const curr_time = new Date().getTime();
            const remaining = Math.max(
                Math.floor((target_time - curr_time) / 1000),
                0
            );
            if (remaining === 0) {
                window.alert(`${event.title} is over`);
                clearInterval(event.intervalId);
                Events_Array = Events_Array.filter((e) => e.id !== event.id);
                localStorage.setItem("events", JSON.stringify(Events_Array));
            } else {
                event.Remaining_Time = remaining;
            }
            render(event);
        });
    }

    function addEvent(e) {
        e.preventDefault();
        const Title = document.getElementById("title").value;
        const Category = document.getElementById("event-type").value;
        const Time = document.getElementById("timer").value;
        if (!Title || !Category || !Time) return;
        const Time_value = new Date(Time).getTime();
        const newEvent = {
            id: Events_Array.length + 1,
            category: Category,
            Time_value,
            Remaining_Time: Remaining_Time(Time_value),
            Running: true,
            title: Title,
        };
        newEvent.intervalId = setInterval(updateTime, 1000);
        Events_Array.push(newEvent);

        // Store Events_Array in local storage
        localStorage.setItem("events", JSON.stringify(Events_Array));

        render(newEvent);
        document.getElementById("title").value = "";
        document.getElementById("event-type").value = "";
        document.getElementById("timer").value = "";
    }

    function render(event) {
        const event_list = document.getElementById("event-container");
        const event_colors = {
            Meeting: "#ffe3e8",
            Birthday: "#88b7ea",
            Anniversary: "yellow",
            Reminder: "#ffa500",
        };
        const Event_time = Time_Format(event.Remaining_Time);
        const Event_element = document.createElement("div");
        Event_element.classList.add("Event");
        Event_element.style.background = event_colors[event.category];
        Event_element.style.border = "1px solid wheat";
        Event_element.style.color = "black";
        Event_element.innerHTML = `
        <h3 id="Title_event">${event.title}</h3>
        <h4 id="Category_event"><strong>${event.category}</h4>
        <div class="body">
            ${
                Event_time.days > 0
                    ? `<div id="count_value"><strong>${Event_time.days}</strong><p>Days</p></div>`
                    : ""
            }
            <div id="count_value"><strong>${
                Event_time.hours
            }</strong><p>hours</p></div>
            <div id="count_value"><strong>${
                Event_time.minutes
            }</strong><p>minutes</p></div>
            <div id="count_value"><strong>${
                Event_time.seconds
            }</strong><p>seconds</p></div>
        </div>
        <div id="action-btn">
            <button onclick="removeEvent(${event.id})" ${
            event.Remaining_Time <= 0 ? "disabled" : ""
        }>Remove Event</button>
        </div>
        `;
        event_list.appendChild(Event_element);
    }

    function Remaining_Time(Target_time) {
        const Curr_time = new Date().getTime();
        const diff = Target_time - Curr_time;
        const seconds = Math.max(Math.floor(diff / 1000));
        return seconds;
    }

    function Time_Format(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remaining_seconds = seconds % 60;
        return {
            days,
            hours,
            minutes,
            seconds: remaining_seconds,
        };
    }

    function removeEvent(Event_id) {
        Events_Array = Events_Array.filter((event) => event.id !== Event_id);
        const removedEvent = Events_Array.find(
            (event) => event.id === Event_id
        );
        if (removedEvent) {
            clearInterval(removedEvent.intervalId);
        }

        localStorage.setItem("events", JSON.stringify(Events_Array));
        renderEvents();
    }

    function renderEvents() {
        const event_list = document.getElementById("event-container");
        event_list.innerHTML = "";
        Events_Array.forEach((event) => {
            render(event);
        });
    }

    const add = document.getElementById("addEvent");
    add.addEventListener("click", addEvent);
    window.removeEvent = removeEvent;
});
