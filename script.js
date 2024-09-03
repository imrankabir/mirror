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

let deferredPrompt;
const installButton = document.querySelector('#install-button');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', e => {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(error => console.log('Service Worker registration failed:', error));
    });
}

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.classList.add('show');
});

installButton.addEventListener('click', e => {
    installButton.classList.remove('show');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});

window.addEventListener('appinstalled', e => {
    installButton.style.display = 'none';
    console.log('PWA was installed');
});
