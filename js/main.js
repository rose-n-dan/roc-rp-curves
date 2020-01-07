function plotter() {
  // clear table from previous data
  clearTable();

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
  let MatrixRows = MatrixRowCreator(values, test_results, thresholds);
  for (let i = 0; i < MatrixRows.length; i++) {
    let matrix = document.getElementById('error_matrix');
    let len = matrix.rows.length;
    let new_row = matrix.insertRow(len);
    let threshold_cell = new_row.insertCell(0);
    let TP_cell = new_row.insertCell(1);
    let FP_cell = new_row.insertCell(2);
    let TN_cell = new_row.insertCell(3);
    let FN_cell = new_row.insertCell(4);
    threshold_cell.innerHTML = MatrixRows[i].threshold;
    TP_cell.innerHTML = MatrixRows[i].TP;
    FP_cell.innerHTML = MatrixRows[i].FP;
    TN_cell.innerHTML = MatrixRows[i].TN;
    FN_cell.innerHTML = MatrixRows[i].FN;
  }

  // prepare data for ROC curve
  let TPR = [];
  let FPR = [];
  let PPV = [];
  for (let i = 0; i < MatrixRows.length; i++) {
    TPR.push(parseFloat(MatrixRows[i].recall));
    FPR.push(parseFloat(1 - MatrixRows[i].specificity));
    PPV.push(parseFloat(MatrixRows[i].precision));
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
        text: 'False Positive Rate',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: 'True Positive Rate',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      }
    }
  };

  let rocStyle = document.getElementById('rocPlot').style;
  rocStyle.width = "100%";
  rocStyle.height = "600px";
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
        text: 'Recall',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Precision',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      }
    }
  };

  document.getElementById('rcPlot').style = rocStyle;
  Plotly.newPlot('rcPlot', data_rp, layout_rp, {showSendToCloud: true});
}

function addRow(value, test_result) {
    value = parseInt(value);
    test_result = parseFloat(test_result);
    console.log("Adding a row: " + value + " " + test_result);
    if(validateResultWithAlert(value, test_result)) {
        let table = document.getElementById('data_table').getElementsByTagName('tbody')[0];
        let new_row = table.insertRow(table.rows.length);
        let value_cell = new_row.insertCell(0);
        let test_result_cell = new_row.insertCell(1);
        value_cell.innerHTML = value;
        test_result_cell.innerHTML = test_result.toFixed(2);
    }
    document.getElementById("resultForm").reset();
}

function addRowFromCells() {
    addRow(document.getElementById("value").value,
           document.getElementById("test_result").value);
}

function insertData() {
    let values = [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1];
    let test_results = [0.41, 0.3, 0.56, 0.67, 0.8, 0.33, 0.66, 0.9, 0.58, 0.42, 0.34];

    let table = document.getElementById('data_table');
    for (let i = 1; i < table.rows.length;)
    {
        table.deleteRow(i);
    }
    for (let j = 0; j < values.length; j++)
    {
        addRow(values[j], test_results[j]);
    }
}

function addThreshold(threshold) {
    threshold = parseFloat(threshold);
    if(validateThresholdWithAlert(threshold)) {
        console.log("Adding new threshold: " + threshold);
        let table = document.getElementById('thresholds_table').getElementsByTagName('tbody')[0];
        let len = table.rows.length;
        let new_row = table.insertRow(len);
        let threshold_cell = new_row.insertCell(0);
        threshold_cell.innerHTML = threshold.toFixed(2);
    } else {
        console.log("Not adding new threshold, '" + threshold + "' is not a float type.");
    }
    document.getElementById("thresholdForm").reset();
}

function addThresholdFromCell() {
    addThreshold(document.getElementById('threshold').value);
}

function insertThresholds() {
    let table = document.getElementById('thresholds_table');
    for (let i = 1; i < table.rows.length;)
    {
        table.deleteRow(i);
    }
    for (let j = 0.05; j < 1; j += 0.1)
    {
        addThreshold(j);
    }
}

function validateResult(pvalue, ptest_value) {
    let value = pvalue;
    let test_prob = ptest_value;
    let valueREGEX = /^1|0$/;
    let test_probREGEX = /^0[.][0-9]+$|^1$|^0$/;
    let valueResult = valueREGEX.test(value);
    let test_probResult = test_probREGEX.test(test_prob);
    return (valueResult === true && test_probResult === true);
}

function validateResultWithAlert(pvalue, ptest_value) {
  if(!validateResult(pvalue, ptest_value)) {
	document.getElementById("result_validation").innerHTML =
        "Podaj poprawną wartość prawdziwą (0-1) oraz wynik testu (0 lub 1)";
    return false;
  }
  else {
    document.getElementById("result_validation").innerHTML = "";
    return true;
  }
}

function validateThreshold(pthreshold) {
    let threshold = pthreshold;
    let thresholdREGEX = /^0[.][0-9]+$|^1$|^0$/;
    return thresholdREGEX.test(threshold);
}

function validateThresholdWithAlert(pthreshold) {
  if(!validateThreshold(pthreshold)) {
    document.getElementById("threshold_validation").innerHTML = "Podaj poprawną wartość progu (0-1)";
    return false;
  }
  else {
    document.getElementById("threshold_validation").innerHTML = "";
    return true;
  }
}

function clearTable() {
    let table = document.getElementById("error_matrix");
    table.getElementsByTagName("tbody")[0].innerHTML = "<tr></tr>";
}

function addListeners() {
  document.getElementById("add_row").addEventListener("click", addRowFromCells, false);
  document.getElementById("insert_exemplary_data").addEventListener("click", insertData, false);
  document.getElementById("add_threshold").addEventListener("click", addThresholdFromCell, false);
  document.getElementById("insert_exemplary_thresholds").addEventListener("click", insertThresholds, false);
  document.getElementById("plot").addEventListener("click", plotter, false);
}
