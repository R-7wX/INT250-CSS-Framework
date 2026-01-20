function temperature() {
  let c = document.getElementById("celsius").value;
  if (c === "") return;
  document.getElementById("fahrenheit").value = (c * 9/5) + 32;
}

function weight() {
  let k = document.getElementById("kilo").value;
  if (k === "") return;
  document.getElementById("pounds").value = k * 2.2;
}

function distance() {
  let km = document.getElementById("km").value;
  if (km === "") return;
  document.getElementById("miles").value = km * 0.62137;
}
