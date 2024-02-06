let cashPayment = document.getElementById("cf").addEventListener("change", calculateHandler);

let selectOption = document.getElementById("choice").addEventListener("change", calculateHandler);


/* Function that will calculate if the user is:
    * Buying: If user is buying they will get a $15 coupon
    * Selling: If user is selling they will get a $5 coupon
    * Trading: If user is trading they will receive a $10 coupon
    * Visiting: If user is visiting they will receive a $5 coupon
    * 
    * Paying with cash: This will be the second calculation. If the user is paying with cash they will receive a .25 multiplier
    *   to their rewards.*/
function calculateHandler() {
    let option1 = document.getElementById("choice").value;
    result = 0;
    switch(option1) {
        case "":
            break;

        case "buying":
            result = 15;
            break;

        case "selling":
            result = 5;
            break;

        case "trading":
            result = 10;
            break;

        case "visiting":
            result = 5;
            break;
    }

    let cash = document.getElementById("cf").checked;
    if (cash) {
        result += result*.25;
    }
    document.getElementById("result").innerText = "Congratulations you are receiving $" + result + " coupon!";


}