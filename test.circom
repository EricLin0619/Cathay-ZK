pragma circom 2.0.0;
include "node_modules/circomlib/circuits/comparators.circom";

template circuit1 () {
    // 宣告輸入信號
    signal input credit_score;
    signal input age;

    // 宣告中間變數和比較結果
    // 比較 credit_score > 700
    signal comp0_out;
    component comp0 = GreaterThan(32);
    comp0.in[0] <== credit_score;
    comp0.in[1] <== 700;
    comp0_out <== comp0.out;

    // 計算 or 運算結果
    signal intermediate0;
    intermediate0 <== comp0_out;

    // 比較 age > 18
    signal comp1_out;
    component comp1 = GreaterThan(32);
    comp1.in[0] <== age;
    comp1.in[1] <== 18;
    comp1_out <== comp1.out;

    // 計算 or 運算結果
    signal intermediate1;
    intermediate1 <== comp1_out;

    // 計算 or 運算結果
    signal intermediate2;
    intermediate2 <== intermediate0 + intermediate1 - (intermediate0 * intermediate1);


    // 宣告輸出信號
    signal output result;
    result <== intermediate2;
}

component main = circuit1();