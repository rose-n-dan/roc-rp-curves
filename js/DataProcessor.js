function processRows(values, test_results, thresholds) {
    let processedRows = [];
    for (let i = 0; i < thresholds.length; i++) {
        let TP = 0;
        let FP = 0;
        let TN = 0;
        let FN = 0;
        for (let j = 0; j < values.length; j++) {
            if (values[j] == 1) {
                if (test_results[j] >= thresholds[i]) TP++;
                else FN++;
            } else {
                if (test_results[j] >= thresholds[i]) FP++;
                else TN++;
            }
        }
        processedRows.push(new ProcessedRow(thresholds[i], TP, FP, TN, FN));
    }
    return (processedRows);
}

class ProcessedRow {
    constructor(threshold, TP, FP, TN, FN) {
        this.threshold = parseFloat(threshold);
        this.TP = TP;
        this.FP = FP;
        this.TN = TN;
        this.FN = FN;
        this.recall = TP / (TP + FN);
        this.specifity = TN / (TN + FP);
        this.precision = TP / (TP + FP);
        this.accuracy = (TP + TN) / (TP + TN + FP + FN);
        this.error = 1 - this.accuracy;
        this.F1 = 2 * this.precision * this.recall / (this.precision + this.recall);
    }
}
