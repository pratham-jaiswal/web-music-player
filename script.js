console.log("Welcome to Spotify");

//Initializing variables
let songIndex = 0;
let audioElement = new Audio('Songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    {songName: "Lovely - Fly By Midnight", filePath: "Songs/1.mp3", cover: "Covers/1.jpg"},
    {songName: "Lost - Faime", filePath: "Songs/2.mp3", cover: "Covers/2.jpg"},
    {songName: "Rain - Faime", filePath: "Songs/3.mp3", cover: "Covers/3.jpg"},
    {songName: "Believers - Alan Walker", filePath: "Songs/4.mp3", cover: "Covers/4.jpg"},
    {songName: "Stereo Hearts - Gym Class Heroes", filePath: "Songs/5.mp3", cover: "Covers/5.jpg"}
]

songItems.forEach((element, i)=>{
    element.getElementsByTagName("img")[0].src = songs[i].cover;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
})
//audioElement.play();

//Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        songItemPlayFn(songIndex);
    }
    else{
        songItemPauseFn(songIndex);
    }
})

//Listen to events
audioElement.addEventListener('timeupdate', ()=>{
    //update seekbar
    progress = parseInt((audioElement.currentTime/audioElement.duration)*100);
    myProgressBar.value = progress;
    if (progress>=100){
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
        nextSong();
    }
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = (myProgressBar.value*audioElement.duration)/100;
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName("songItemPlay")).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle')
    })
}

Array.from(document.getElementsByClassName("songItemPlay")).forEach((element)=>{
    element.addEventListener('click', (e)=>{
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        songItemPlayFn(songIndex);
    })
})

function songItemPlayFn(songIndex){
    let songItemPlay = document.getElementById(songIndex);
    songItemPlay.classList.remove('fa-play-circle');
    songItemPlay.classList.add('fa-pause-circle');
    if((!(audioElement.paused)) || (myProgressBar.value>=100)){
        audioElement.src = `Songs/${songIndex+1}.mp3`;
    }
    gif.style.opacity = 1;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
}

function songItemPauseFn(songIndex){
    let songItemPause = document.getElementById(songIndex);
    songItemPause.classList.remove('fa-pause-circle');
    songItemPause.classList.add('fa-play-circle');
    gif.style.opacity = 0;
    audioElement.pause();
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
}

document.getElementById("next").addEventListener("click", ()=>{
    nextSong();
})

document.getElementById("previous").addEventListener("click", ()=>{
    makeAllPlays();
    if(songIndex<=0){
        songIndex = 4;
    }
    else{
        songIndex -= 1;
    }
    songItemPlayFn(songIndex);
})

function nextSong(){
    makeAllPlays();
    if(songIndex>=4){
        songIndex = 0;
    }
    else{
        songIndex += 1;
    }
    songItemPlayFn(songIndex);
}