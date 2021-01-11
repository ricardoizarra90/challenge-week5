var tasks = {};
const BEFORE = 0;
const AFTER = 1;
const OPENHOUR = 9;
const CLOSEHOUR = 17;
var backgroundFlag = BEFORE;
var operationHours = 8;
var openingHour = 9;
var hoursIncrement = 1;
var closingHour = 17;


function getOperatingHours(hours) {
    var result;
    if (hours < 12) {
        result = hours.toString() + "AM";
    }
    else if (hours === 12 ){
        result = hours.toString() + "PM";
    }
    else {
        result = (hours-12).toString() + "PM";
    }
    return result;
};

function taskSheet(hours) {
    var content = $( 
        "<div class='row'>" +
            "<div class='col-1 hour'>" + 
                hours +
            "</div>" +
            "<div class='col-10'>" +
                "<p class='description'></p>"+
            "</div>" +
            "<div class='col-1 saveBtn'>" +
                "<i class = 'oi oi-task'></i>" +
            "</div>" +
        "</div>"
    );
    content.appendTo(".container");
};


function createTaskSheet (){
    for (openingHour; openingHour <= closingHour; openingHour++) {
        taskSheet(getOperatingHours(openingHour));
    }
};

createTaskSheet();


function runTime() {
    $("#currentDay").text(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    setInterval(function () {
        $("#currentDay").text(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }, 1000);
};
runTime();


function str2IntHour(strHour) {
    var AM_PM = strHour.slice(-2);
    var iNum = strHour.slice(0, -2);
    var result;
    if (strHour === "12PM") {
        result = 12;
    } 
    else if (AM_PM === "PM") {
        result = parseInt(iNum) + 12;
    }
    else {
        result = parseInt(iNum);
    }
    return result;
};
function getCurrentTimeEvent() {
    var currentTime = moment().format("hA");
    var iCurTemp = str2IntHour(currentTime);
    
    $(".hour").each(function( i ) {
        var evalTime = $( this ).text().trim();

        if (iCurTemp < OPENHOUR) {
            $( this ).next().addClass("future").removeClass("present").removeClass("past");
        }
        else if (iCurTemp > CLOSEHOUR ) {
            $( this ).next().addClass("past").removeClass("present").removeClass("future");
        }
        else {    
            if (evalTime === currentTime) {
                $( this ).next().addClass("present").removeClass("past").removeClass("future")
                backgroundFlag = AFTER;    
            }
            else {
                switch(backgroundFlag) {
                    case BEFORE:
                        $( this ).next().addClass("future").removeClass("present").removeClass("past");
                        break;
                    case AFTER:
                        $( this ).next().addClass("past").removeClass("present").removeClass("future");
                        break;
                    default:
                        break;
                }
            }
        }
    });    
};
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    
    if (!tasks) {
        tasks = {};
    }

    if(tasks) {
        $(".description").each(function( index ) {
            if(tasks[index]) {
                $( this ).text(tasks[index]);
            }
        });
    }
};
loadTasks();
    
$(".row").on("click", ".col-10", function() {
    var text = $(this).children(".description").text();
    var textInput =$("<textarea>").addClass("form-control").val(text);
    $(this).children(".description").replaceWith(textInput);

    textInput.trigger("focus");
});

$(".saveBtn").on("click", "i", function() {
    var pos =$(this).parent().prev().children(".form-control")
    var sText = pos.val();
    var sIndex = pos.closest(".row").index();
    tasks[sIndex] = sText;
    saveTasks();

    var taskP = $("<p>").text(sText);

    pos.closest(".form-control").replaceWith(taskP);
});


getCurrentTimeEvent();