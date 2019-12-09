function plotter() {
  let TESTER = document.getElementById('tester');

  // collect values and test results
  let data_table = document.getElementById('data_table');
  let values = [], test_results = [];
  for (let i = 1; i < data_table.rows.length; i++) {
    values.push(parseFloat(data_table.rows[i].cells[0].innerHTML));
    test_results.push(parseFloat(data_table.rows[i].cells[1].innerHTML))
  }
  console.log("Values: " + values);
  console.log("Test results: " + test_results);

  // collect thresholds
  let thresholds_table = document.getElementById('thresholds_table');
  let thresholds = [];
  for (let i = 1; i < thresholds_table.rows.length; i++) {
    thresholds.push(parseFloat(thresholds_table.rows[i].cells[0].innerHTML));
  }
  console.log("Thresholds: " + thresholds);

  // TODO: insert proper data
  Plotly.plot( TESTER, [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16] }], {
    margin: { t: 0 } }, {showSendToCloud:true} );
}

function addRow() {
  console.log("Adding a row.");
  let table = document.getElementById('data_table');
  let len = table.rows.length;
  let new_row = table.insertRow(len);
  let value_cell = new_row.insertCell(0);
  let test_result_cell = new_row.insertCell(1);
  value_cell.innerHTML = document.getElementById("value").value;
  test_result_cell.innerHTML = document.getElementById("test_result").value;
}

function addThreshold() {
  console.log("Adding new threshold.");
  let table = document.getElementById('thresholds_table');
  let len = table.rows.length;
  let new_row = table.insertRow(len);
  let threshold_cell = new_row.insertCell(0);
  threshold_cell.innerHTML = document.getElementById("threshold").value;
}

function addListeners() {
  document.getElementById("add_row").addEventListener("click", addRow, false);
  document.getElementById("add_threshold").addEventListener("click", addThreshold, false);
  document.getElementById("plot").addEventListener("click", plotter, false);
}
