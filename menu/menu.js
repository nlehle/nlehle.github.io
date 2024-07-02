const video= document.getElementById("videoBackground");
const sound= document.getElementById("sound");
const links= document.querySelectorAll("ul a");
const audioClick = document.getElementById("audioClick");
const audioHover= document.getElementById("audioHover");


sound.addEventListener("click", () => {
    //Toggle icon on click
    sound.classList.toggle("fa-volume-up");
    sound.classList.toggle("fa-volume-mute");
    //Mute/ unmute video sound
    if (video.muted=== false) {
        video.muted = true;
    } else {
        video.muted = false;
    }
    //Add the sound effect
    clickSound();
});

sound.addEventListener("mouseenter", hoverSound);

for (let i= 0; i < links.length; i++) {
    //Add click event Listener on the Links
    links[i].addEventListener("click", clickSound);
    //Add hover event Listener on the Links
    links[i].addEventListener("mouseenter", hoverSound);

}

//Click sound effect
function clickSound() {
    audioClick.play();
}

//Hover sound effect
function hoverSound() {
    audioHover.play();
}

//Logik für die Menu-Optionen
/*document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sound-level-preview').addEventListener('click', toggleSound);
    document.getElementById('sound-tutorial').addEventListener('click', toggleSound);
  }); */

document.getElementById('new-game').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = '../game/index.html';
});

document.getElementById('level-preview').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('menu').style.display = 'none';
    document.getElementById('videoBackground').classList.add('blur'); // Hintergrund unscharf
    document.getElementById('level-preview-container').style.display = 'flex';
    clickSound();
});


document.getElementById('tutorial').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('menu').style.display = 'none';
    document.getElementById('videoBackground').classList.add('blur');
    document.getElementById('tutorial-container').style.display = 'flex';
    clickSound();
});


document.getElementById('back-level-preview').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('level-preview-container').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('videoBackground').classList.remove('blur');  // Hintergrund scharf
    clickSound(); 
});

document.getElementById('back-tutorial').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('tutorial-container').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('videoBackground').classList.remove('blur');
    clickSound(); 
});

document.getElementById('quit').addEventListener('click', function(event) {
    event.preventDefault();
    window.close();
});

/*function toggleSound() {
    sound.classList.toggle("fa-volume-up");
    sound.classList.toggle("fa-volume-mute");
    video.muted = !video.muted;
    clickSound();
} */
