// TESTING CONNECTION$(".jumbotron").text("this test text");
// var queryurl=""

// $.ajax({
//     url: queryurl,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
// });


// TESTING SPEECH RECOGNITION AREA
  var recognizing;
  var recognition = new SpeechRecognition();
  recognition.continuous = true;
  reset();
  recognition.onend = reset;

  recognition.onresult = function (event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        textarea.value += event.results[i][0].transcript;
      }
    }
  }

  function reset() {
    recognizing = false;
    button.innerHTML = "Click to Speak";
  }

  function toggleStartStop() {
    if (recognizing) {
      recognition.stop();
      reset();
    } else {
      recognition.start();
      recognizing = true;
      button.innerHTML = "Click to Stop";
    }
  }
