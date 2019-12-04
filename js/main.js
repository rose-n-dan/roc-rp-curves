function plotter() {
  TESTER = document.getElementById('tester');

  Plotly.plot( TESTER, [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16] }], {
    margin: { t: 0 } }, {showSendToCloud:true} );
}

function saveParams() {
  console.log("I'm inside saveParams.");
  let param1 = document.getElementById("param1").value;
  let param2 = document.getElementById("param2").value;
  console.log("Param1 = " + param1);
  console.log("param2 = " + param2);
}

function addListeners() {
  document.getElementById("save_button").addEventListener("click", saveParams, false);
}
