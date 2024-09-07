window.addEventListener('load', () => {
  speechSynthesis.cancel();
});

let isSpeaking = false;
let voices = [];
const speech = new SpeechSynthesisUtterance();

function populateVoiceList() {
  voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voiceOptions");

  voiceSelect.innerHTML = "";
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    voiceSelect.appendChild(option);
  });

  loadSettings();
}

speechSynthesis.onvoiceschanged = populateVoiceList;

function speakInputText() {
  const textInput = document.getElementById("textInput").value;
  if (!textInput.trim()) {
    alert("Please enter some text.");
    return;
  }

  isSpeaking = true;
  speech.text = textInput;
  speechSynthesis.speak(speech);
}

function pauseSpeech() {
  const pauseButton = document.getElementById("pauseButton");

  if (isSpeaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    pauseButton.innerHTML = `Resume<img class="icon-link-small" src="./assets/icons/resumeIcon.svg">`;
  } else if (speechSynthesis.paused) {
    speechSynthesis.resume();
    pauseButton.innerHTML = `Pause<img class="icon-link-small" src="./assets/icons/pauseIcon.svg">`;
  }
}

function stopSpeech() {
  isSpeaking = false;
  speechSynthesis.cancel();
  document.getElementById("pauseButton").innerHTML = `Pause<img class="icon-link-small" src="./assets/icons/pauseIcon.svg">`;
}

function changeVoice(index) {
  speech.voice = voices[index];
  saveSettings();
}

function changeVoiceSpeed(rate) {
  speech.rate = parseFloat(rate);
  saveSettings();
}

function usePredefinedText(text) {
  document.getElementById("textInput").value = text;
}

function saveSettings() {
  localStorage.setItem("selectedVoice", document.getElementById("voiceOptions").value);
  localStorage.setItem("selectedSpeed", document.getElementById("speedOptions").value);
}

function loadSettings() {
  const savedVoice = localStorage.getItem("selectedVoice");
  const savedSpeed = localStorage.getItem("selectedSpeed");

  if (savedVoice !== null && voices.length > 0) {
    document.getElementById("voiceOptions").value = savedVoice;
    changeVoice(savedVoice);
  }

  if (savedSpeed !== null) {
    document.getElementById("speedOptions").value = savedSpeed;
    changeVoiceSpeed(savedSpeed);
  }
}

document.getElementById("textInput").addEventListener("input", function() {
  const speakButton = document.getElementById("speakTextButton");
  speakButton.disabled = this.value.trim() === "";
});

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("textInput").value.trim() === "") {
    document.getElementById("speakTextButton").disabled = true;
  }
});
