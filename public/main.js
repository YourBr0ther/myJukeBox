// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

// Create an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: '', // We start with no video
  });
}

// Function to play a video
function playVideo(videoId) {
  player.loadVideoById(videoId);
}

// Function to read an NFC card
async function readNfc() {
  // Check if the Web NFC API is available
  if (typeof NDEFReader === "undefined") {
    throw new Error("Web NFC is not supported in this browser.");
  }

  return new Promise((resolve, reject) => {
    try {
      const ndef = new NDEFReader();

      // Request permission to use NFC
      ndef.scan().then(() => {
        console.log("Scan started successfully.");
        ndef.onreadingerror = () => {
          console.log("Cannot read data from the NFC tag. Try another one?");
          reject("Cannot read data from the NFC tag. Try another one?");
        };
        ndef.onreading = ({ message }) => {
          for (const record of message.records) {
            if (record.recordType === "text") {
              // Decode the text record
              const textDecoder = new TextDecoder();
              const id = textDecoder.decode(record.data);
              console.log("ID read from NFC card: " + id);
              resolve(id);
            }
          }
        };
      }).catch(error => {
        console.log(`Error! Scan failed to start: ${error}.`);
        reject(error);
      });
    } catch (error) {
      console.log(`Error! Scan failed to start: ${error}.`);
      if (error.name === "NotAllowedError") {
        // The user denied the permission request
        console.log("Permission to access NFC was denied.");
      } else if (error.name === "NotReadableError") {
        // The NFC tag could not be read
        console.log("The NFC tag could not be read.");
      } else {
        // Some other error occurred
        console.log("An unexpected error occurred.");
      }
      reject(error);
    }
  });
}

document.getElementById('readNfc').addEventListener('click', async function() {
  try {
    console.log(`first`)
    // Read the NFC card
    const nfcId = await readNfc();

    // Make a request to your server to get the corresponding YouTube video ID
    const response = await fetch(`http://localhost:3002/playSong/${nfcId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Play the video
    playVideo(data.videoId);

    // Update the current song display
    document.getElementById('currentSong').textContent = 'Playing video: ' + data.videoId;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('currentSong').textContent = 'Error: ' + error.message;
  }
});