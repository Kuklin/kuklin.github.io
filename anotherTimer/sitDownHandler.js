var timerRunning = false; //Sets timer state. False is for paused, true is for running.
var numSeconds = new Number; //Sets the milisecond count fot the timer. Will be changed when start function is called.
var totalSitTime = 0; //All times are in seconds.
var sinceLastStand = 0;
const sitTimeDate = new Date(0);
const lastStandDate = new Date(0);
const alarmSound = new Audio();
// alarmSound.src = "https://www.soundjay.com/button/beep-07.wav";
alarmSound.loop = true;

document.getElementById('start-session').addEventListener('click', function() {
    buttonStartPressed();
});

function soundAlarmGetFocus() {
    // alarmSound.play();
    window.focus();
    document.getElementById('lap-counter').style.animation = "alarmBlinking 1500ms infinite";
    console.log("Alarm function is being executed.");
};

function endAlarm() {
    document.getElementById('lap-counter').style.animation = "none";
}

function buttonStartPressed() {
    console.log('timerStart has been called');

    //timerStart function specific UI changes.
    document.getElementById('start-session').hidden = true;
    document.getElementById('pause-session').hidden = false;
    document.getElementById('end-session').hidden = false;

    timerRunning = true;
    var radioButtonValues = document.getElementsByName('timer-select'); //Gets all radio buttons, then iterates through them.

    function setTimerDuration() { //Makes timer duration easily repeatable.
        for (let n = 0; n < radioButtonValues.length; n++) {
            if (radioButtonValues[n].checked) { //Determines if the button is checked and then sets the milisecond value.
                numSeconds = radioButtonValues[n].value * 60000;
            };
        };
    };
    setTimerDuration();

    console.log('Variable numMiliseconds has been changed and has a value of: ', numSeconds);
    console.log("Starting to hide radio buttons.");


    function hideRadioButtons() { //Hide buttons with a repeatable function.
        for (var n=0, countLen=radioButtonValues.length; n<countLen; n++) { //Iterates through all radio buttons and hides them.
            radioButtonValues[n].disabled = true;
        };
    };
    hideRadioButtons();

    function unhideRadioButtons() { //Unhide buttons with a repeatable function.
        for (var n=0, countLen=radioButtonValues.length; n<countLen; n++) { //Iterates through all radio buttons and hides them.
            radioButtonValues[n].disabled = false;
        };
    };

    document.getElementById('end-session').addEventListener('click', function() {//Resets Form. This should parse the record to a DB.
        timerRunning = false;
        sinceLastStand = 0;
        totalSitTime = 0;
        unhideRadioButtons();
        endAlarm();
        document.getElementById('lap-counter').innerHTML = "--:--:--";
        document.getElementById('total-counter').innerHTML = "--:--:--";
        document.getElementById('start-session').hidden = false;
        document.getElementById('pause-session').hidden = true;
        document.getElementById('end-session').hidden = true;
        document.getElementById('resume-session').hidden = true;
    });

    document.getElementById('pause-session').addEventListener('click', function() {//Listens to click on pause button.
        timerRunning = false;
        console.log("Paused.");
        document.getElementById('pause-session').hidden = true;
        document.getElementById('resume-session').hidden = false;
        sinceLastStand = 0;
        unhideRadioButtons();
        endAlarm();
    });
    console.log("Pause should be functioning.");

    document.getElementById('resume-session').addEventListener('click', function() {//Listens to click on resume button.
        timerRunning = true;
        setTimerDuration();
        hideRadioButtons();
        startTimer();
        console.log("Timer resumed");
        document.getElementById('pause-session').hidden = false;
        document.getElementById('resume-session').hidden = true;
    });
    console.log("Resume should be functioning.");

    function startTimer() {
        console.log("startTimer has been called.");
        if (timerRunning == true && numSeconds > 0) {
            numSeconds -= 1000;
            totalSitTime += 1000;
            sinceLastStand += 1000;
            sitTimeDate.setTime(totalSitTime);
            lastStandDate.setTime(sinceLastStand);
            console.log("MS remaining: ", numSeconds, "Total sit time: ", totalSitTime, "Current sitting: ", sinceLastStand);
            document.getElementById('lap-counter').innerHTML = lastStandDate.toUTCString().split(' ')[4];
            document.getElementById('total-counter').innerHTML = sitTimeDate.toUTCString().split(' ')[4];
            setTimeout(startTimer, 1000);
        } else if (timerRunning == true && numSeconds == 0 && totalSitTime < 57600000) {
                soundAlarmGetFocus();
                console.log("Alarm function has been called.");
                totalSitTime += 1000;
                sitTimeDate.setTime(totalSitTime);
                document.getElementById('total-counter').innerHTML = sitTimeDate.toUTCString().split(' ')[4];
                setTimeout(startTimer, 1000);
            };
    };
    startTimer();
};
//There is a bug. When double clicking on "Stand Up", the timer starts jumping multiple seconds at once.