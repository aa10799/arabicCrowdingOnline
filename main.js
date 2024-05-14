//initialize jspsych
const jsPsych = initJsPsych({
  fullscreen: true,
  //display data at the end of the experiment
  on_finish: function() {
      jsPsych.data.displayData();
      jsPsych.data.get().csv();
  }
});

// Define the total number of stimuli
const totalStimuli = stimuli_variables.length;
const numRandomTrials = 40;
const practiceStimuli = jsPsych.randomization.sampleWithoutReplacement(stimuli_variables, numRandomTrials);
const experimentStimuli = stimuli_variables.filter(stimulus => !practiceStimuli.includes(stimulus));

//create timeline
var timeline = [];


/* Stores info received by Pavlovia */
var pavloviaInfo;

/* init connection with pavlovia.org */
var pavlovia_init = {
type: jsPsychPavlovia,
command: "init",
// Store info received by Pavlovia init into the global variable `pavloviaInfo`
setPavloviaInfo: function (info) {
  console.log(info);
  pavloviaInfo = info;
}
};
timeline.push(pavlovia_init);


//enter fullscreen mode

var enter_fullscreen = {
  type: jsPsychFullscreen,
  stimulus: 'This trial launch in fullscreen mode when you click the button below.',
  choices: ['Continue']
}
timeline.push(enter_fullscreen);

var distance_trial = {
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  resize_units: "none"
};

const randomCode = generateRandomCode(5); // Change to the desired code length

// Add the random code to the subject ID
var subject_id = randomCode;
// This adds a property called 'subject' and a property called 'condition' to every trial
jsPsych.data.addProperties({
subject: subject_id,
});

// Function to generate a random completion code
function generateRandomCode(length) {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let code = '';
for (let i = 0; i < length; i++) {
  code += characters.charAt(Math.floor(Math.random() * characters.length));
}
return code;
}

var welcome = {
  timeline: [
     
      {
          type: jsPsychHtmlKeyboardResponse,
          stimulus:
              "<h2>Welcome to the experiment.</h2>" +
              "<p>" +
              "This experiment should take roughly 50 minutes to complete." +
              "</p>" +
              "<p>" +
              "First, you will fill out a short questionnaire." +
              "</p>" +
              "<p>" +
              "Following this, you will be ready to begin the experiment." +
              "</p>" +
              "<p>" +
              "Press any key to continue." +
              "</p>",
          post_trial_gap: 500 // Add a gap after the welcome screen (in milliseconds)
      },
      {
          type: jsPsychSurveyText,
          questions: [
              { prompt: 'What is your age?', name: 'age', placeholder: '21' },
              { prompt: 'What is your email address?', name: 'email', placeholder: 'aa100@gmail.com'},
              { prompt: 'What is your present country of residence?', name: 'country', placeholder: 'United Arab Emirates'}
          ]
      }
  ]
};


timeline.push(welcome);

var consent = {
  timeline: [
      {
          type: jsPsychHtmlButtonResponse,
          stimulus: consent_trial,
          choices: ['Yes', 'No'],
          required: true,
          post_trial_gap: 500, // Adjust as needed
      }
  ],
  timeline_variables: consent_trial, // Assuming consent_trial contains the 'sentence' property
};

timeline.push(consent);



var demographics = {
timeline: [
  { 
    type: jsPsychSurveyMultiChoice,
    questions: [
      {
        prompt: "What is your biological sex?", 
        name: 'BiologicalSex', 
        options: ['Male', 'Female', 'Other'], 
        required: true
      }, 
      {
        prompt: "Do you have dyslexia?",
        name: 'Dyslexia',
        options: ['Yes', 'No'],
        required: true
      },
      {
          prompt: "Do you wear corrective lenses?",
          name: 'Lens',
          options: ['Yes, eyeglasses', 'Yes, contact lenses', 'No', 'Unsure'],
          required: true
        },
      {
        prompt: "Which is your dominant hand?", 
        name: 'DomHand', 
        options: ['Left', 'Right'], 
        required: true
      },
      {
        prompt: "Were you born and raised in a multilingual environment?",
        name: 'MultEnv',
        options: ['Yes', 'No'],
        required: false
      },
      {
        prompt: "Is Arabic your first language?",
        name: 'ArabFirst',
        options: ['Yes', 'No'],
        required: true
      },
      {
        prompt: "Which dialect of Arabic is your native dialect?",
        name: 'ArabicDialect',
        options: ['Egyptian', 'Levantine (Palestine, Syria, Lebanon, Jordan)', 'Iraqi', 'North African (Morocco, Algeria, Tunisia, Libya)', 'Sudanese', 'Gulf/Khaliji (UAE, Saudi Arabia, Kuwait, Bahrain, Qatar, Oman, Yemen)', 'Other'],
        required: true
      }
    ],
  }
]
};
timeline.push(demographics);


//define instructions & add 2 second gap afterwards
var instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
      <p><b>Instructions:</b></p>
      <p>Focus on the fixation cross at the center of the screen. The cross will turn <span style="color: red;">red</span> to signal the start of each trial.</p>
      <p>Shortly after, a word will briefly appear in one of five positions near the fixation: left, right, top, bottom, or center.</p>
      <p>Once the word disappears, the cross will turn <span style="color: green;">green</span>. At this moment, you need to respond whether the item displayed was a word or not.</p>
      <p>Press <b><kbd>A</kbd></b> if it was a word.</p> 
      <p>Press <b><kbd>L</kbd></b> if it was not a word.</p>
      <p>Respond as quickly and accurately as possible. Press <b><kbd>A</kbd></b> to begin the practice round.</p>`,
  post_trial_gap: 2000,
  choices: ["a", "l"],
};
timeline.push(instructions);

//define fixation
var fixation = {
          type: jsPsychHtmlKeyboardResponse,
          stimulus: '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: red; font-size: 40px;">+</div>',
          choices: 'NO_KEYS',
          trial_duration: 800,
          task: 'fixation',
      };
      
//define trial stimuli array for timeline variables 
     
var test = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var image = jsPsych.timelineVariable('ImageName', true);
    var position = jsPsych.timelineVariable('Position');
    var fixationCrossHtml = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px;">+</div>';
    var imgHtml = '';
    var offset = 7; // This sets a uniform distance from the center for all images

    switch(position) {
      case 'Center':
        // Display image at the center, no fixation cross needed
        imgHtml = `<img src="${image}" class="imageStyle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">`;
        return imgHtml; // Return just the image HTML if position is center
      case 'Left':
        imgHtml = `<img src="${image}" class="imageStyle" style="position: absolute; top: 50%; left: ${50 - offset}%; transform: translateX(-50%) translateY(-50%);">`;
        break;
      case 'Right':
        imgHtml = `<img src="${image}" class="imageStyle" style="position: absolute; top: 50%; left: ${50 + offset}%; transform: translateX(-50%) translateY(-50%);">`;
        break;
      case 'Top':
        imgHtml = `<img src="${image}" class="imageStyle" style="position: absolute; top: ${50 - offset}%; left: 50%; transform: translateX(-50%) translateY(-50%);">`;
        break;
      case 'Bottom':
        imgHtml = `<img src="${image}" class="imageStyle" style="position: absolute; top: ${50 + offset}%; left: 50%; transform: translateX(-50%) translateY(-50%);">`;
        break;
    }
    return fixationCrossHtml + imgHtml; // Include fixation cross with image for all positions other than center
  },
  choices: "NO_KEYS",
  trial_duration: 250 // This sets the duration of the trial to 250 milliseconds
};


// Define the backward mask (same as the forward mask)
var backwards_mask = {
  type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px;">+</div>',
    trial_duration: 600, // Immediate display
       };

var response_trial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
  <div style="position: absolute; bottom: 20%; left: 20%; font-size: 32px;">
    <span style="font-weight: bold;"><kbd>A:</kbd></span> Word
  </div>
  <div style="position: absolute; bottom: 20%; right: 20%; font-size: 32px;">
    <span style="font-weight: bold;"><kbd>L:</kbd></span> Non-word
  </div>
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: green; font-size: 40px;">
    +
  </div>`,
        choices: ["a", "l"],
        trial_duration: 2000,
        data: {
            task: 'response',
            position: jsPsych.timelineVariable('Position'),
            wordStim: jsPsych.timelineVariable('ImageName'),
            preview: jsPsych.timelineVariable('Preview'),
            correct_response: jsPsych.timelineVariable('Type'),
            nonjoiningletters:  jsPsych.timelineVariable('NonjoiningLetters'),
            nonjoiningmiddle: jsPsych.timelineVariable('NonjoiningMiddle'),
            letter_spacing: jsPsych.timelineVariable('Spacing'),
            trial_num: jsPsych.timelineVariable('Trial')
        },
        on_finish: function(data) {
            var correctResponse = data.correct_response;
            var responseKey = data.response;
    
            // Corrected logic for determining if the response is correct
            data.correct = ((correctResponse === "Nonword" || correctResponse === "Mirror" || correctResponse === "Pseudoword") && responseKey === 'l') ||
                           (correctResponse === 'Word' && responseKey === 'a');
        },
    };
var feedback = {
      type: jsPsychHtmlKeyboardResponse,
      trial_duration: 800,
      stimulus: function(){
        // Check if the response is null
        var last_trial_response = jsPsych.data.get().last(1).values()[0].response;
        if(last_trial_response === null){
          return "<p>No response entered</p>";
        }
    
        // Check the accuracy of the last response
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
        if(last_trial_correct){
          return "<span style='color: green;'>Correct</span>"; // Corrected the quotes around color: green
        } else {
          return "<span style='color: red;'>Incorrect</span>"; // Corrected the quotes around color: red
        }
      }
    }
       
// Debrief block
var debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var trials = jsPsych.data.get().filter({ task: 'response' });
    var correct_count = trials.filter({ correct: true }).count();
    var accuracy = Math.round((correct_count / trials.count()) * 100);
    var rt = Math.round(trials.select('rt').mean());

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
            <p>Your average response time was ${rt}ms.</p>
            <p>Press any key to continue.</p>`;}
};
timeline.push(debrief_block);

// Debrief block after the practice block
var practice_debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
      // Get all trials with a "response" task from the practice block
      var practice_trials = jsPsych.data.get().filter({ task: 'response' }); // Adjust the timeline index if needed

      // Calculate accuracy by comparing participants' responses with the correct responses
      var practice_correct_responses = practice_trials.select('correct_response');
      var participant_responses = practice_trials.select('response');
      var correct_count = 0;

      for (var i = 0; i < practice_trials.count(); i++) {
          var correct = practice_trials.select('correct').values[i];
          // Check if the participant's response was correct
          if (correct) {
              correct_count++;
          }
      }

      var prac_accuracy = Math.round((correct_count / practice_trials.count()) * 100);

      // Calculate average response time for all practice trials
 var prac_rt = Math.round(practice_trials.select('rt').mean());

      return `<p>You responded correctly on ${prac_accuracy}% of the practice trials.</p>
      <p>Your average response time was ${prac_rt}ms.</p>
      <p>Press <b><kbd>L</kbd></b> to continue.</p>`;
  },
  choices: ["l"],
}

var preload_trial = {
  type: jsPsychPreload,
  auto_preload: true,
  show_progress_bar: false // hide progress bar
}

// Combine the endPracticeMessage and practice_procedure in a single timeline
var practice_timeline =  {
  timeline: [preload_trial, fixation, test, backwards_mask, response_trial, feedback],
  timeline_variables: practiceStimuli,
  randomize_order: true,
  repetitions: 1,
};

var separatorMessage = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<p>Now, it's time for the main experiment.</p>
      <p>You will go through a total of 6 blocks with short breaks in between. You will not receive feedback following trials.</p>
      <p>Press <b><kbd>A</kbd></b> to begin the main experiment.</p>`,
   choices: ["a"],

};

var endMessage = {
type: jsPsychHtmlKeyboardResponse,
stimulus: `<p>You're done with the experiment.</p>
      <p>Press any key to exit.</p>`,
  trial_duration: 3000,
};

var chunk_debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
      // Get all trials with a "response" task from the current chunk
      var chunk_trials = jsPsych.data.get().filter({ task: 'response' }).last(100); // Adjust the timeline index if needed

      // Calculate accuracy by comparing participants' responses with the correct responses
      var chunk_correct_responses = chunk_trials.select('correct_response');
      var participant_responses = chunk_trials.select('response');
      var correct_count = 0;

      for (var i = 0; i < chunk_trials.count(); i++) {
          var correct = chunk_trials.select('correct').values[i];
          // Check if the participant's response was correct
          if (correct) {
              correct_count++;
          }
      }
      var chunk_accuracy = Math.round((correct_count / chunk_trials.count()) * 100);

      // Calculate average response time for all trials in the current chunk
      var chunk_rt = Math.round(chunk_trials.select('rt').mean());

      // Get the block number, considering the practice trials
      var block_number = (Math.ceil(jsPsych.data.get().filter({ task: 'response' }).count() / 100));

      return `<p><b>Block ${block_number} accuracy:</b> ${chunk_accuracy}%.</p>
              <p><b>Average response time for the last 100 trials:</b> ${chunk_rt}ms.</p>
              <p>Press <b><kbd>A</kbd></b> to continue.</p>`;
  },
choices:["a"],
};

// Create a timeline with a single trial displaying the completion code
// Create a timeline with a single trial displaying the completion code
const completionCodeTrial = {
type: jsPsychHtmlKeyboardResponse,
stimulus: function () {
  return `<p>Your completion code is: <b>${randomCode}</b>.</p> Please copy and enter the completion code in this survey to receive your payment. When you're done, press 'Enter' to exit.</p><a href="https://nyu.qualtrics.com/jfe/form/SV_6QdM3m1mA0YBlH0" target="_blank">Survey</a>`;
},
choices: ['Enter'],
response_ends_trial: true,
trial_duration: 60000
};

const doneWitIt = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    return `<p>You are done with the experiment. Thank you for participating. Please check your email for your participation voucher.</p>`;
  },
  response_ends_trial: true,
  trial_duration: 6000
};

var main_procedure = {
  timeline: [
    preload_trial,
      fixation, 
      test, 
      backwards_mask, 
      response_trial,
      { 
        conditional_function: function () {
              return jsPsych.data.get().filter({ task: 'response' }).count() % 100 === 0;
          },
          timeline: [chunk_debrief_block],
      }
  ],
  timeline_variables: experimentStimuli,
  randomize_order: true,
  repetitions: 1, // Run through all  trials once
};
/* finish connection with pavlovia.org */
var pavlovia_finish = {
  type: jsPsychPavlovia,
  command: "finish",
  participantId: subject_id,
  // Modify the dataFilter function to get CSV data
  dataFilter: function(data) {
      // Printing the data received from jsPsych.data.get().csv(); a CSV data structure
      var csvData = jsPsych.data.get().csv();
      console.log(csvData);
      
      // Return the CSV data
      return csvData;
  },
  // Thomas Pronk; call this function when we're done with the experiment and data reception has been confirmed by Pavlovia
  completedCallback: function() {
      alert('data successfully submitted!');
  }
};

timeline.push(pavlovia_finish);



// Define the full timeline
var experimentTimeline = [
pavlovia_init,
consent,
welcome,
demographics,
enter_fullscreen,
distance_trial,
  instructions,
  practice_timeline,  // Include the practice timeline
  practice_debrief_block,
  separatorMessage,
  main_procedure,
  debrief_block,
  doneWitIt,
  pavlovia_finish];

var version = jsPsych.version();
console.log(version);

// Start the experiment
jsPsych.run(experimentTimeline);
