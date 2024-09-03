const app = 'Mirror';
const VISITS_KEY = 'mirror-visits';

document.addEventListener('DOMContentLoaded', e => {
    const video = document.querySelector('#video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            })
            .catch(error => {
                console.error('Error accessing the camera: ', error);
            });
    } else {
        console.error('getUserMedia not supported by this browser.');
    }
});

const download = e => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `image-${new Date().getTime()}.png`;
    a.click();
};

document.querySelector('.download-btn').addEventListener('click', download);
document.addEventListener('keydown', e => {
  switch (e.which) {
    case 40:
    case 68:
      download();
      break;
  }
});

// trackVisitor();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;

  // Update UI to notify the user they can add to home screen
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt = null;
    });
  });
});

window.addEventListener('appinstalled', () => {
  // Hide the install button or take other actions when the app is installed
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'none';
  console.log('PWA was installed');
});
