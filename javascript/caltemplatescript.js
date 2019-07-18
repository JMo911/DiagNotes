//SET ALL GLOBAL VARIABLES
var calendar = document.getElementById("calendar-table");
var gridTable = document.getElementById("table-body");
var currentDate = new Date();
var selectedDate = currentDate;
var selectedDayBlock = null;
var globalEventObj = {};

$(document).on("click", ".row > .col", function(){
   $(".row > .col").animate({"backgroundColor":"#FFFFFF"});
   $(this).animate({"backgroundColor":"#8edaa9"});
});

//IMPORT CALENDAR TEMPLATE FROM CODEPEN
function createCalendar(date, side) {
   var currentDate = date;
   var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

   var monthTitle = document.getElementById("month-name");
   var monthName = currentDate.toLocaleString("en-US", {
      month: "long"
   });
   var yearNum = currentDate.toLocaleString("en-US", {
      year: "numeric"
   });
   monthTitle.innerHTML = `${monthName} ${yearNum}`;

   if (side == "left") {
      gridTable.className = "animated fadeOutRight";
   } else {
      gridTable.className = "animated fadeOutLeft";
   }

   setTimeout(() => {
      gridTable.innerHTML = "";

      var newTr = document.createElement("div");
      newTr.className = "row";
      var currentTr = gridTable.appendChild(newTr);

      for (var i = 1; i < startDate.getDay(); i++) {
         var emptyDivCol = document.createElement("div");
         emptyDivCol.className = "col empty-day";
         currentTr.appendChild(emptyDivCol);
      }

      var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      lastDay = lastDay.getDate();

      for (var i = 1; i <= lastDay; i++) {
         if (currentTr.children.length >= 7) {
            currentTr = gridTable.appendChild(addNewRow());
         }
         var currentDay = document.createElement("div");
         currentDay.className = "col";
         if (selectedDayBlock == null && i == currentDate.getDate() || selectedDate.toDateString() == new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString()) {
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

            selectedDayBlock = currentDay;
            setTimeout(() => {
               currentDay.classList.add("blue");
               currentDay.classList.add("lighten-3");
            }, 900);
         }
         currentDay.innerHTML = i;

         //show marks & appt links
         if (globalEventObj[new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString()]) {
            var eventMark = document.createElement("div");
            eventMark.className = "day-mark";
            currentDay.appendChild(eventMark);
            var newApptLink = document.createElement("div");
            newApptLink.className = "appt-link";
            currentDay.appendChild(newApptLink);

         }

         currentTr.appendChild(currentDay);
      }

      for (var i = currentTr.getElementsByTagName("div").length; i < 7; i++) {
         var emptyDivCol = document.createElement("div");
         emptyDivCol.className = "col empty-day";
         currentTr.appendChild(emptyDivCol);
      }

      if (side == "left") {
         gridTable.className = "animated fadeInLeft";
      } else {
         gridTable.className = "animated fadeInRight";
      }

      function addNewRow() {
         var node = document.createElement("div");
         node.className = "row";
         return node;
      }

   }, !side ? 0 : 270);
}

createCalendar(currentDate);

var todayDayName = document.getElementById("todayDayName");
todayDayName.innerHTML = "Today is " + currentDate.toLocaleString("en-US", {
   weekday: "long",
   day: "numeric",
   month: "short"
});

var prevButton = document.getElementById("prev");
var nextButton = document.getElementById("next");

prevButton.onclick = function changeMonthPrev() {
   currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
   createCalendar(currentDate, "left");
}
nextButton.onclick = function changeMonthNext() {
   currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
   createCalendar(currentDate, "right");
}

function addEvent(title, desc) {
   if (!globalEventObj[selectedDate.toDateString()]) {
      globalEventObj[selectedDate.toDateString()] = {};
   }
   globalEventObj[selectedDate.toDateString()][title] = desc;
}

function showEvents() {
   var objWithDate = globalEventObj[selectedDate.toDateString()];

   if (objWithDate) {
      var eventsCount = 0;
      for (key in globalEventObj[selectedDate.toDateString()]) {
         var eventContainer = document.createElement("div");
         eventContainer.className = "eventCard";

         var eventHeader = document.createElement("div");
         eventHeader.className = "eventCard-header";

         var eventDescription = document.createElement("div");
         eventDescription.className = "eventCard-description";

         eventHeader.append(document.createTextNode(key));
         eventContainer.appendChild(eventHeader);

         eventDescription.appendChild(document.createTextNode(objWithDate[key]));
         eventContainer.appendChild(eventDescription);

         var markWrapper = document.createElement("div");
         markWrapper.className = "eventCard-mark-wrapper";
         var mark = document.createElement("div");
         mark.classList = "eventCard-mark";
         markWrapper.appendChild(mark);
         eventContainer.appendChild(markWrapper);
         eventsCount++;
      }
      var emptyFormMessage = document.getElementById("emptyFormTitle");
      emptyFormMessage.innerHTML = `${eventsCount} events now`;
   } else {
      var emptyMessage = document.createElement("div");
      emptyMessage.className = "empty-message";
      emptyMessage.innerHTML = "Sorry, no events to selected date";
      var emptyFormMessage = document.getElementById("emptyFormTitle");
      emptyFormMessage.innerHTML = "No events now";
   }
}

gridTable.onclick = function (e) {

   if (!e.target.classList.contains("col") || e.target.classList.contains("empty-day")) {
      return;
   }

   if (selectedDayBlock) {
      if (selectedDayBlock.classList.contains("blue") && selectedDayBlock.classList.contains("lighten-3")) {
         selectedDayBlock.classList.remove("blue");
         selectedDayBlock.classList.remove("lighten-3");
      }
   }
   selectedDayBlock = e.target;
   selectedDayBlock.classList.add("blue");
   selectedDayBlock.classList.add("lighten-3");
   selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(e.target.innerHTML));

   showEvents();
}

var changeFormButton = document.getElementById("changeFormButton");
var addForm = document.getElementById("addForm");
changeFormButton.onclick = function (e) {
   addForm.style.top = 0;
}

var cancelAdd = document.getElementById("cancelAdd");
cancelAdd.onclick = function (e) {
   addForm.style.top = "100%";
   var inputs = addForm.getElementsByTagName("input");
   for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
   }
   var labels = addForm.getElementsByTagName("label");
   for (var i = 0; i < labels.length; i++) {
      labels[i].className = "";
   }
}

//FIREBASE CONFIG
var firebaseConfig = {
   apiKey: "AIzaSyDzhSWIeHaVKr2ipKn4kQYXUI-_d_TnE6I",
   authDomain: "diagnotes-project-1.firebaseapp.com",
   databaseURL: "https://diagnotes-project-1.firebaseio.com",
   projectId: "diagnotes-project-1",
   storageBucket: "",
   messagingSenderId: "227854326970",
   appId: "1:227854326970:web:aab38cfa0ff6ff62"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 var database = firebase.database();


//STORE PATIENT NAME, APPOINTMENT DESCRIPTION, AND APPOINTMENT DATE IN FIREBASE
//EVERY TIME AN APPOINTMENT IS SCHEDULED
var globalObjectCopy;
$("#addEventButton").on("click", function(event){
   event.preventDefault();
   var patientName=$("#patientNameInput").val().trim();
   var apptDescrip=$("#eventDescInput").val().trim();
   globalObjectCopy = globalEventObj;
   var apptDate = selectedDate.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
   });


//SETTING UP OBJECT TO PUSH TO FIREBASE
var apptDetails = {
      patientName: patientName,
      apptDescrip: apptDescrip,
      apptDate: apptDate
   };

   database.ref().push(apptDetails);
   addForm.style.top = "100%";
});
//END OF FIREBASE STORAGE ON CLICK EVENT


//RENDER APPOINTMENTS STORED IN FIREBASE ON THE PAGE W/ UNIQUE IDENTIFIERS
var firepName;
var fireDescrip;
var fireDate;
var newApptLink;
database.ref().on("child_added", function(childSnapshot){
   firepName = childSnapshot.val().patientName;
   fireDescrip = childSnapshot.val().apptDescrip;
   fireDate = childSnapshot.val().apptDate;
   newApptLink = $("<a>");
   newApptLink.attr({"href": "appoinment.html",
      "data-fireChildKey": childSnapshot.key,
      "data-patientName": childSnapshot.val().patientName,
      "data-apptDate": childSnapshot.val().apptDate,
      "class": "list-group-item list-group-item-action"
      });
   newApptLink.append("<p>" + firepName + ": " + fireDate + " - " + fireDescrip + "</p>");
   $("#apptList").prepend(newApptLink);
});








var addEventButton = document.getElementById("addEventButton");
addEventButton.onclick = function (e) {
   
   var title = firepName;
   var desc = fireDescrip;

   if (!title || !desc) {
      document.getElementById("patientNameInput").value = "";
      document.getElementById("eventDescInput").value = "";
      var labels = addForm.getElementsByTagName("label");
      for (var i = 0; i < labels.length; i++) {
         labels[i].className = "";
      }
      return;
   }

   addEvent(title, desc);
   showEvents();

   if (!selectedDayBlock.querySelector(".day-mark")) {
      selectedDayBlock.appendChild(document.createElement("div")).className = "day-mark";
      $(".lighten-3").on("click", function(event){
         event.preventDefault();
      });
   }

   var inputs = addForm.getElementsByTagName("input");
   for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
   }
   var labels = addForm.getElementsByTagName("label");
   for (var i = 0; i < labels.length; i++) {
      labels[i].className = "";
   }
}

$(document).on("click", ".list-group > a", function(){
   var currentFireKey = $(this).attr("data-fireChildKey");
   localStorage.setItem("currentFireKey", currentFireKey);

   var currentPatientName = $(this).attr("data-patientName");
   localStorage.setItem("currentPatientName", currentPatientName);

   var currentApptDate = $(this).attr("data-apptDate");
   localStorage.setItem("currentApptDate", currentApptDate);

});