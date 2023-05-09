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
  try {
    const reader = new NDEFReader();
    await reader.scan();
    console.log("> Scan started");

    reader.onreading = ({ message, serialNumber }) => {
      console.log(`> Serial number: ${serialNumber}`);
      console.log(`> Records of type: "${message.records[0].recordType}"`);
      console.log(`> Data: "${message.records[0].data}"`);
      return message.records[0].data;
    };

  } catch (error) {
    console.log("Argh! " + error);
  }
}

document.getElementById('readNfc').addEventListener('click', async function() {
  try {
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