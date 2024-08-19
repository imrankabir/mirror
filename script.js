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

trackVisitor();
