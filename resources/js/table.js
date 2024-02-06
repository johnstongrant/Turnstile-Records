
// Citation for adding a global click function listener: https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/


document.addEventListener("click", async function(event) {
    if(event.target.matches(".delete")){
        let rows = document.getElementsByTagName("tr");
        let toDelete = event.target.id
        const url = "/api/contact";
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"id": toDelete})
        });
        if (response.ok){
            let rowToDelete;
            for(i = 0; i < rows.length; i++) {
                if(rows[i].id === toDelete) {
                    rowToDelete = i;
                }
            }
            document.getElementById("myTable").deleteRow(rowToDelete);
        }
    }
    else if (event.target.matches(".set_sale")) {
        const url = "/api/sale"
        const message = document.getElementById("sales_message").value
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"message": message})
        })

    }

    else if (event.target.matches(".end_sale")) {
        const url = "/api/sale"
        const message = document.getElementById("sales_message").value
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }
})

setInterval(addTimeUntil,1000)
  
// loop through our rows grabbing the appt date and current date every second.
// Calculate the amount of milliseconds between the dates and then convert to seconds
// preform multiple calculations by grabbing days, hours, minutes, seconds and shaving down the total time.
// This code was sourced from: https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates
// And has been approved by Daniel Kluver for usage.
function addTimeUntil() {
    let rows = document.getElementsByTagName("tr");
    for(i = 1; i < rows.length; i++) {
        let oldDate = rows[i].children[2].textContent;
        let apptDate = new Date(oldDate)
        let today = new Date()
        let total = (apptDate - today) / 1000; // convert milliseconds to seconds
        
        if( total < 0 ) {
            rows[i].children[3].textContent = "PAST";
        }
        else {
            //flooring each value to maintain whole number
            let days = Math.floor(total / 86400);
            total -= days * 86400;
            let hours = Math.floor(total / 3600) % 24;
            total -= hours * 3600;
            let minutes = Math.floor(total / 60) % 60;
            total -= minutes * 60;
            let seconds = Math.floor(total % 60);
            const fDate = days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds left";
            rows[i].children[3].textContent = fDate;
        }
    }
}
