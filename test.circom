pragma circom 2.0.0;
include "node_modules/circomlib/circuits/comparators.circom";

template circuit1 () {
    // 宣告輸入信號
    signal input a;
    signal input b;
    signal input c;
    signal input d;
    signal input e;
    signal input f;
    signal input g;
    signal input h;

    // 宣告中間變數和比較結果
    // 比較 a >= 100
    signal comp0_out;
    component comp0 = GreaterEqThan(32);
    comp0.in[0] <== a;
    comp0.in[1] <== 100;
    comp0_out <== comp0.out;

    // 比較 b > 200
    signal comp1_out;
    component comp1 = GreaterThan(32);
    comp1.in[0] <== b;
    comp1.in[1] <== 200;
    comp1_out <== comp1.out;

    // 計算 or 運算結果
    signal intermediate0;
    intermediate0 <== comp0_out + comp1_out - (comp0_out * comp1_out);

    // 比較 c > 300
    signal comp2_out;
    component comp2 = GreaterThan(32);
    comp2.in[0] <== c;
    comp2.in[1] <== 300;
    comp2_out <== comp2.out;

    // 比較 d = 400
    signal comp3_out;
    comp3_out <== comp3.out;

    // 計算 or 運算結果
    signal intermediate1;
    intermediate1 <== comp2_out + comp3_out - (comp2_out * comp3_out);

    // 計算 and 運算結果
    signal intermediate2;
    intermediate2 <== intermediate0 * intermediate1;

    // 比較 e >= 500
    signal comp4_out;
    component comp4 = GreaterEqThan(32);
    comp4.in[0] <== e;
    comp4.in[1] <== 500;
    comp4_out <== comp4.out;

    // 比較 f >= 600
    signal comp5_out;
    component comp5 = GreaterEqThan(32);
    comp5.in[0] <== f;
    comp5.in[1] <== 600;
    comp5_out <== comp5.out;

    // 計算 and 運算結果
    signal intermediate3;
    intermediate3 <== comp4_out * comp5_out;

    // 計算 or 運算結果
    signal intermediate4;
    intermediate4 <== intermediate2 + intermediate3 - (intermediate2 * intermediate3);

    // 比較 g > 700
    signal comp6_out;
    component comp6 = GreaterThan(32);
    comp6.in[0] <== g;
    comp6.in[1] <== 700;
    comp6_out <== comp6.out;

    // 比較 h = 800
    signal comp7_out;
    comp7_out <== comp7.out;

    // 計算 or 運算結果
    signal intermediate5;
    intermediate5 <== comp6_out + comp7_out - (comp6_out * comp7_out);

    // 計算 or 運算結果
    signal intermediate6;
    intermediate6 <== intermediate4 + intermediate5 - (intermediate4 * intermediate5);


    // 宣告輸出信號
    signal output result;
    result <== intermediate6;
}

component main = circuit1();