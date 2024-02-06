
async function salesHandler() {
    const url = "/api/sale";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.ok) {
        let banner = document.getElementById("sales_banner");
        const json = await response.json();
        if (json["active"]) {
            
            banner.innerText = json["message"]
            banner.classList.add("sales_banner_on")
        }
        else {
            banner.classList.remove("sales_banner_on")
        }
    }
}

setInterval(salesHandler,1000)