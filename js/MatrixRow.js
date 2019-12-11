/*
* Function for creating rows for error matrix
* calculates numbers of TP, FP, TN, FN
* and creates a row
*/
function MatrixRowCreator(values, test_results, thresholds) {
    let MatrixRows = [];
    for (let i = 0; i < thresholds.length; i++) {
        let TruePositives = 0;
        let FalsePositives = 0;
        let TrueNegatives = 0;
        let FalseNegatives = 0;
        for (let j = 0; j < values.length; j++) {
            if (values[j] == 1) {
                if (test_results[j] >= thresholds[i]) {
                    TruePositives++;
                }
                else {
                    FalseNegatives++;
                }
            }
            else {
                if (test_results[j] >= thresholds[i]) {
                    FalsePositives++;
                }
                else {
                    TrueNegatives++;
                }
            }
        }
        MatrixRows.push(new MatrixRow(thresholds[i], TruePositives, FalsePositives, TrueNegatives, FalseNegatives));
    }
    return (MatrixRows);
}

/*
* Class for representing error matrix row
* consists of number of TP, FP, TN, FN
* and values of recall, specificity, precision and threshold
*/
class MatrixRow {
    constructor(threshold, TP, FP, TN, FN) {
        this.TP = TP;
        this.FP = FP;
        this.TN = TN;
        this.FN = FN;
        this.precision = TP / (TP + FP);
        this.recall = TP / (TP + FN);
        this.specificity = TN / (TN + FP);
        this.threshold = threshold;
    }
}
