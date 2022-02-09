/* This section is responsible for updating points on header page. */
let br = document.querySelector(".br"),
ls = document.querySelector(".ls"),
play = document.querySelector(".play"),
bestScore = localStorage.getItem("record"),
lastScore = localStorage.getItem("last");

if (bestScore === null) {
    br.innerHTML = "Best result: 0";
} else {
    br.innerHTML = `Best result: ${bestScore}`;
}

if (lastScore === null) {
    ls.innerHTML = "Last result: 0";
} else {
    ls.innerHTML = `Last result: ${lastScore}`;
}