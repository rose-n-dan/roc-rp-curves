const { test } = QUnit;

QUnit.test("validate thresholds value", function( assert ) {
    assert.equal(validateThreshold(11), false);
    assert.equal(validateThreshold(1), true);
    assert.equal(validateThreshold(0.66), true);
    assert.equal(validateThreshold(0.8), true);
    assert.equal(validateThreshold(-1), false);
    assert.equal(validateThreshold("abc"), false);
    assert.equal(validateThreshold("0.61"), true);
});

QUnit.test("validate results values", function( assert ) {
    assert.equal(validateResult(1, 0.99), true);
    assert.equal(validateResult("0", "0.65"), true);
    assert.equal(validateResult("1", "1.3"), false);
    assert.equal(validateResult(0.5, 0.5), false);
    assert.equal(validateResult("0", 0.43), true);
    assert.equal(validateResult(-1, 0.55), false);
    assert.equal(validateResult("-1", "-0.55"), false);
});

QUnit.test("validate matrix row constructor (1)", function( assert ) {
    let row1 = new MatrixRow(0.05, 4, 4, 0, 0);

    assert.equal(row1.precision, 0.5, "Precision should equal 0.5. Succeed.");
    assert.equal(row1.recall, 1, "Recall should equal 1. Succeed.");
    assert.equal(row1.specificity, 0, "Specificity should equal 0. Succeed");
});

QUnit.test("validate matrix row constructor (2)", function( assert ) {
    let row2 = new MatrixRow(0.75, 1, 1, 3, 3);

    assert.equal(row2.precision, 0.5, "Precision should equal 0.5. Succeed.");
    assert.equal(row2.recall, 0.25, "Recall should equal 0.25. Succeed.");
    assert.equal(row2.specificity, 0.75, "Specificity should equal 0.75. Succeed");
});
