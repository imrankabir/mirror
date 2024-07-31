document.addEventListener('DOMContentLoaded', e => {
    const video = document.querySelector('#video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error("Error accessing the camera: ", err);
            });
    } else {
        console.error("getUserMedia not supported by this browser.");
    }
});
