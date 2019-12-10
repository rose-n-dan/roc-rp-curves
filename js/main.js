function plotter() {
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

  // parse data as error matrix rows
  let processedRows = processRows(values, test_results, thresholds);
  for (let i = 0; i < processedRows.length; i++) {
    let matrix = document.getElementById('error_matrix');
    let len = matrix.rows.length;
    let new_row = matrix.insertRow(len);
    let threshold_cell = new_row.insertCell(0);
    let TP_cell = new_row.insertCell(1);
    let FP_cell = new_row.insertCell(2);
    let TN_cell = new_row.insertCell(3);
    let FN_cell = new_row.insertCell(4);
    threshold_cell.innerHTML = processedRows[i].threshold;
    TP_cell.innerHTML = processedRows[i].TP;
    FP_cell.innerHTML = processedRows[i].FP;
    TN_cell.innerHTML = processedRows[i].TN;
    FN_cell.innerHTML = processedRows[i].FN;
  }

  // prepare data for ROC curve
  let TPR = [];
  let FPR = [];
  let PPV = [];
  for (let i = 0; i < processedRows.length; i++) {
    TPR.push(parseFloat(processedRows[i].recall));
    FPR.push(parseFloat(1 - processedRows[i].specifity));
    PPV.push(parseFloat(processedRows[i].precision));

  }

  // draw ROC curve
  let roc = {
    x: FPR,
    y: TPR,
    type: 'scatter'
  };
  let data_roc = [roc];
  let layout_roc = {
    title: {
      text:'Receiver Operating Characteristic Curve',
      font: {
        family: 'Courier New, monospace',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      title: {
        text: 'False Positive Probability',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: 'True Positive Probability',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      }
    }
  };

  Plotly.newPlot('rocPlot', data_roc, layout_roc, {showSendToCloud: true});

  // draw RP curve
  let rp = {
    x: TPR,
    y: PPV,
    type: 'scatter'
  };
  let data_rp = [rp];
  let layout_rp = {
    title: {
      text:'Recall Precision Curve',
      font: {
        family: 'Courier New, monospace',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      title: {
        text: 'True Positive Probability',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Positive Predictive Probability',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      }
    }
  };

  Plotly.newPlot('rcPlot', data_rp, layout_rp, {showSendToCloud: true});
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
  document.getElementById("resultForm").reset();
}

function addThreshold() {
  let threshold = document.getElementById('threshold').value;
  if(validateThreshold(threshold) == true) {
    console.log("Adding new threshold.");
    let table = document.getElementById('thresholds_table');
    let len = table.rows.length;
    let new_row = table.insertRow(len);
    let threshold_cell = new_row.insertCell(0);
    threshold_cell.innerHTML = document.getElementById("threshold").value;
  }
  document.getElementById("thresholdForm").reset();
}

function validateThreshold(input) {
  let threshold = input;
  let thresholdREGEX = /^0[.][0-9]+$|^1$|^0$/;
  let thresholdResult = thresholdREGEX.test(threshold);
  if(thresholdResult == false) {
    alert('Please enter a valid threshold');
    return false;
  }
  return true;
}

function validateResult(input) {
  let threshold = input;
  let thresholdREGEX = /^0[.][0-9]+$|^1$|^0$/;
  let thresholdResult = thresholdREGEX.test(threshold);
  if(thresholdResult == false) {
    alert('Please enter a valid test result');
    return false;
  }
  return true;
}

function addListeners() {
  document.getElementById("add_row").addEventListener("click", addRow, false);
  document.getElementById("add_threshold").addEventListener("click", addThreshold, false);
  document.getElementById("plot").addEventListener("click", plotter, false);
}
