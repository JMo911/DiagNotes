$(document).ready(function() {
 var queryurl="https://sv443.net/jokeapi/category/Miscellaneous?blacklistFlags=religious,nsfw,political"

 $.ajax({
     url: queryurl,
    method: "GET"
}).then(function (response) {
    // console.log(response);
  
    $("#setup").text(response.setup);
    $("#delivery").text(response.delivery);
    $("#joke").text(response.joke);
  });

 try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

var noteFireKey = localStorage.getItem("currentFireKey");
var keyLength= noteFireKey.length;

var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
// console.log(notes);
renderNotes(notes);


/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
  noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
  recognition.stop();

  if(!noteContent.length) {
    instructions.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    saveNote(new Date().toLocaleString(), noteContent);

    // Reset variables and update UI.
    noteContent = '';
    renderNotes(getAllNotes());
    noteTextarea.val('');
    instructions.text('Note saved successfully.');


  }
  
    
      
})


notesList.on('click', function(e) {
  e.preventDefault();
  var target = $(e.target);

  // Listen to the selected note.
  if(target.hasClass('listen-note')) {
    var content = target.closest('.note').find('.content').text();
    readOutLoud(content);
  }

  // Delete note.
  if(target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();  
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});



/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
  
	window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
  // console.log(notes);
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


function saveNote(dateTime, content) {
  localStorage.setItem(noteFireKey +' note-' + dateTime, content);

}


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);
    // console.log(key);

    if(key.substring(0,keyLength + 6) == noteFireKey +' note-') {
      notes.push({
        date: key.replace('note-',''),
        content: localStorage.getItem(localStorage.key(i))
      });
    } 
  }
  // console.log(notes);
  // console.log(localStorage.length);
  return notes;
}


function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime); 
}

//Event listner for submit button for our medication information form//
$("#submit").click( function(event) {
  event.preventDefault();
  $("#addmedication").empty()
  var newMedication = $("#medication-input").val()
  var addmedication = $("#medication-input").val()
  $("#addmedication").text(addmedication)
  $("#newMedication").text(newMedication)
  clear()
  //declaring variable for api search. This searches for the name of medication.//
  var medicationName = addmedication
  var queryURL = "https://api.fda.gov/drug/label.json?search=" + medicationName + "&api_key=YfbsJ7YnoFpyh1HsPKea9VmisCfwmgFV2lpWKDJC"
  console.log(queryURL)
//ajax call using our queryURL and medication name//
  $.ajax({
    url: queryURL,
    method: "GET"
  })
//This is the response from the call and the info is then displayed on our page//
  .then(function(response) {
    console.log(response.results[0])
    $("#medicationReaction").text(response.results[0].adverse_reactions);
    $("#medicationPurpose").text(response.results[0].purpose);
    $("#medicationIngredients").text(response.results[0].active_ingredient);
    $("#medicationDosage").text(response.results[0].dosage_and_administration);
      
  });

   




$("#notesContainer").append(notes);




});
//This function clears the input value and empties the divs each time new medication is added//
function clear() {
  $('input[type="text"]').val('');
  $('#medication-input').val('');
  $('#medicationReaction').empty();
  $('#medicationPurpose').empty();
  $('#medicationIngredients').empty();
  $('#medicationDosage').empty();
};

//BEGINNING PERSISTENT CONVERSATION WORK - already in local storage (makes sense for this app)
// var noteList=[];


// $("#save-note-btn").on("click", function(){
//   var noteDiv = $("<div>");
//   noteDiv.append()
//   $("#notesContainer").append(noteDiv);

 });

































// var firebaseConfig = {
//   apiKey: "AIzaSyDzhSWIeHaVKr2ipKn4kQYXUI-_d_TnE6I",
//   authDomain: "diagnotes-project-1.firebaseapp.com",
//   databaseURL: "https://diagnotes-project-1.firebaseio.com",
//   projectId: "diagnotes-project-1",
//   storageBucket: "",
//   messagingSenderId: "227854326970",
//   appId: "1:227854326970:web:aab38cfa0ff6ff62"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// var database = firebase.database();

// $("#save-note-btn").on("click", function(event){
//   event.preventDefault();
//   var conv="";
//   conv=$("#note-textarea").val();



// //SETTING UP OBJECT TO PUSH TO FIREBASE
// var conversation = {
//   conversation: conv
// };

// database.ref().push(conversation);

// });
// //END OF FIREBASE STORAGE ON CLICK EVENT
// var dataConv;
// database.ref().on("child_added", function(childSnapshot){
//   // $("#note-textarea").val() = "";
//   dataConv = childSnapshot.val().conversation;
//   $("#note-textarea").append(dataConv);
// });
