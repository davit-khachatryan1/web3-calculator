import * as math from 'mathjs';
export const data = {
    "Y4": 20, // leverage, should be 10, 20 or 30. By default it is 20
    "A242": 0, // balance
    "D244": 0, // initialBalance
    "E242": 0, // coinQuantity
    "B4": 0, // longEntryPrice
    "C4": 0, // shortEntryPrice
    "D4": 0, // longSize
    "E4": 0, // shortSize
    "G4": 0, // marketPrice
    "N4": 0, // closeLongInCorridor
    "O4": 0, // closeShortInCorridor 
    "P4": 0, // openLongInCorridor 
    "P5": 0, // openShortInCorridor
};


export function calculateFormula(formula, data) {
    // Define variables based on the data object
    const variables = { ...data };

    // Implement IF function logic
    const evaluateIfFunction = (condition, valueIfTrue, valueIfFalse,) => {
        // console.log(condition, valueIfTrue, valueIfFalse,'>>>>>>>>>>>>>>>>>>>>>>');
        return condition ? valueIfTrue : valueIfFalse;
    };

    // Add IF function to the variables
    variables["IF"] = evaluateIfFunction;
console.log(variables["IF"], 'OOOOOOOOOkkkkkkkkkkkkkkkkkk');
    // Calculate additional variables needed for the formula
    variables["B5"] = data["B4"]; // Long entry price (pac)
    variables["C5"] = data["C4"]; // Short entry price (pac)
    variables["D5"] = data["D4"]-data["N4"]; // Long size (pac)
    variables["E5"] = data["E4"] - data["O4"] // Short size(pac)
    variables["B6"] = (data["P4"] * data["G4"] + data["D4"] * data["B4"]) / (data["D4"] + data["P4"]); // Long Entry price (pao)
    variables["C6"] = (data["P5"] * data["G4"] + data["E4"] * data["C4"]) / (data["E4"] + data["P5"]); // Short entry price 
    variables["D6"] = data["D4"] + data["P4"]; // Long Size (pao)
    variables["E6"] = data["E4"] + data["P5"]; // short size (pao)

    variables["Z4"] = (data["C4"] - data["B4"]) * 100 / data["B4"]; // minimal tokos
    variables["AI4"] = ((data["D4"] + data["E4"]) * data["B4"]) / data["Y4"]; // corridor max margin
    variables["BO4"] = (data["E4"] * data["B4"] / data["Y4"]) * (variables["Z4"] * data["Y4"] / 100); // mijancqi verevi minus
    variables["AJ4"] = ((data["D4"] + data["E4"]) * data["C4"]) / data["Y4"]; // coridor min margin
    variables["AC4"] = (data["C4"] - data["B4"]) * 100 / data["C4"]; // maxmial tokos
    variables["BF4"] = (data["D4"] * data["C4"] / data["Y4"]) * (variables["AC4"] * data["Y4"] / 100); // mijancqi nerqevi minus
    variables["U4"] = (data["G4"] - data["B4"]) * 100 / data["G4"]; // longi tokos
    variables["V4"] = (data["D4"] * data["G4"] / data["Y4"]) * variables["U4"] * data["Y4"] / 100; // Long Pnl
    variables["W4"] = (data["C4"] - data["G4"]) * 100 / data["G4"]; // shorti tokos
    variables["X4"] = (data["E4"] * data["G4"] / data["Y4"]) * variables["W4"] * data["Y4"] / 100; // Shorti Pnl
    variables["BE4"] = variables["V4"] + variables["X4"]; // Unreailzed Pnl
    variables["BE242"] = variables["BE4"];// added by me
    variables["C244"] = (variables["BE242"] > data["D244"]) ? (data["A242"] - variables["BE242"]) : (data["A242"] - data["D244"]); // avelcuk
    variables["L6"] = variables["C244"]/data["E242"];
    variables["AF4"] = (data["G4"]*data["D4"])/data["Y4"];
    variables["AG4"] = (data["G4"]*data["E4"])/data["Y4"];
    variables["AH4"] = variables["AF4"]+variables["AG4"]
    variables["CG4"] = (data["D4"] > data["E4"]) ? 1 : 0; //position is long
    variables["CH4"] = (data["D4"] < data["E4"]) ? 1 : 0; // position is  short
    /// Calculating IF open Long Coefficient
    variables["AD4"] = (data["C4"] - variables["B6"]) * 100 / data["C4"];
    variables["BG4"] = variables["D6"] * data["C4"] / data["Y4"] * variables["AD4"] * data["Y4"] / 100; 
    variables["AA4"] = (data["C4"] - variables["B6"]) * 100 / variables["B6"]; 
    variables["BP4"] = (data["E4"] * variables["B6"] / data["Y4"]) * variables["AA4"] * data["Y4"] / 100; 
    variables["K8"] = (variables["BG4"] < variables["BP4"]) ? (variables["BG4"] / variables["D6"]) : (variables["BP4"] / variables["E6"]); 
    variables["K6"] = (variables["BF4"] < variables["BO4"]) ? (variables["BF4"] / data["D4"]) : (variables["BO4"] / data["E4"]);
    variables["K9"] = variables["K6"] / variables["K8"]; 
    variables["G6"] = variables["L6"]/(data["D4"] + data["E4"]); ///
    variables["F6"] = variables["L6"] / (variables["D6"] + variables["E6"]); 
    variables["G9"] = variables["G6"] / variables["F6"]; 
    //// Calculating IF open Short Coefficient
    variables["AE4"] = (variables["C6"] - data["B4"]) * 100 / variables["C6"]; 
    variables["BI4"] = data["D4"] * variables["C6"] / data["Y4"] * variables["AE4"] * data["Y4"] / 100; 
    variables["AB4"] = (variables["C6"] - data["B4"]) * 100 / data["B4"]; 
    variables["BR4"] = variables["E6"] * data["B4"] / data["Y4"] * variables["AB4"] * data["Y4"] / 100;
    variables["L8"] = (variables["BI4"] < variables["BR4"]) ? (variables["BI4"] / variables["D6"]) : (variables["BR4"] / variables["E6"]); 
    variables["L9"] = variables["K6"] / variables["L8"]; 
    ////Calculating Close Long Coefficient
    variables["I6"] = variables["V4"] / data["D4"]; ///longi
    variables["E8"] = (variables["L6"] - Math.abs(data["N4"] * variables["I6"])) / (variables["D5"] + data["E4"]); 
    variables["E9"] = variables["G6"] / variables["E8"]; 
    variables["BH4"] = variables["D5"] * data["C4"] / data["Y4"] * variables["AC4"] * data["Y4"] / 100; 
    variables["BQ4"] = data["E4"] * variables["B5"] / data["Y4"] * variables["Z4"] * data["Y4"] / 100; 
    variables["I8"] = (variables["BH4"] < variables["BQ4"]) ? (variables["BH4"] / variables["D5"]) : (variables["BQ4"] / variables["E5"]);
    variables["I9"] = variables["K6"] / variables["I8"];
    //// Calculating Close Short Coefficient
    variables["J6"] = variables["X4"] / variables["E4"];
    variables["F8"] = (variables["L6"] - Math.abs(data["O4"] * variables["J6"])) / (data["D4"] + variables["E5"]);
    variables["F9"] = variables["G6"] / variables["F8"];
    variables["BJ4"] = data["D4"] * variables["C5"] / data["Y4"] * variables["AC4"] * data["Y4"] / 100;
    variables["BS4"] = variables["E5"] * data["B4"] / data["Y4"] * variables["Z4"] * data["Y4"] / 100;
    variables["J8"] = (variables["BJ4"] < variables["BS4"]) ? (variables["BJ4"] / variables["D5"]) : (variables["BS4"] / variables["E5"]);
    variables["J9"] = variables["K6"] / variables["J8"];
    //// ayrum
    variables["F4"] = (data["G4"] > data["C4"] + (data["B4"] - data["C4"]) / 2) ? (variables["AI4"] - variables["BO4"]) : (variables["AJ4"] - variables["BF4"]);
    variables["AY4"] = (variables["AH4"] - variables["BE4"] > variables["BE4"]) ? Math.abs((variables["F4"] - variables["AH4"] + data["E4"] * data["G4"] * variables["W4"] / 100) / (data["G4"] * variables["W4"] / 100 - 2 * data["G4"] / data["Y4"])) : 0;
    variables["AU4"] = Math.abs((data["D4"] * data["G4"] + data["G4"] * data["E4"] - data["Y4"] * data["D4"] * data["G4"] + data["Y4"] * data["D4"] * data["B4"] - variables["F4"] * data["Y4"]) / (2 * data["G4"] - (data["D4"] - data["E4"]) * data["G4"] / data["D4"] - data["Y4"] * data["G4"] + data["Y4"] * data["B4"]));
    variables["BA4"] = Math.abs((variables["F4"] - variables["AH4"] + data["D4"] * data["G4"] * variables["U4"] / 100) / (data["G4"] * variables["U4"] / 100 - 2 * data["G4"] / data["Y4"]));
    variables["AW4"] = Math.abs((data["E4"] * data["G4"] + data["D4"] * data["G4"] - data["E4"] * data["C4"] * data["Y4"] + data["E4"] * data["G4"] * data["Y4"] - variables["F4"] * data["Y4"]) / (2 * data["G4"] - (data["E4"] - data["D4"]) * data["G4"] / data["E4"] - data["C4"] * data["Y4"] + data["G4"] * data["Y4"]));
    //// bacvogh qanak
    variables["J6"] = data["D4"] - variables["AY4"];
    variables["AV4"] = data["D4"] - variables["AU4"] - ((data["D4"] - data["E4"]) - (data["D4"] - data["E4"]) * variables["AU4"] / data["D4"]);
    variables["BB4"] = data["E4"] - variables["BA4"];
    variables["AX4"] = data["E4"] - variables["AW4"] - ((data["E4"] - data["D4"]) - (data["E4"] - data["D4"]) * variables["AW4"] / data["E4"]);
    variables["AZ4"] = data["D4"] - variables["AY4"];

    variables["B242"] = data["A242"] + variables["BE242"];//added by me
    
console.log(variables, 'OOOOOOOOOOOOOOOOOOO');
    try {
        const result = math.evaluate(formula, variables);           
        console.log(result, '65555555');
        return result;
    } catch (error) {
        console.error(`Error evaluating formula: ${error.message}`);
        return null;
    }
}


export function callAll(data) {
    calculationResults.result_BE4 = calculateFormula("BE4", data);
    calculationResults.result_B5 = calculateFormula("B4", data);
    calculationResults.result_C5 = calculateFormula("C4", data);
    calculationResults.result_D5 = calculateFormula("D4 - N4", data);
    calculationResults.result_E5 = calculateFormula("E4 - O4", data);
    calculationResults.result_B6 = calculateFormula("(P4*G4+D4*B4)/(D4+P4)", data);
    calculationResults.result_C6 = calculateFormula("(P5*G4+E4*C4)/(E4+P5)", data);
    calculationResults.result_D6 = calculateFormula("D4+P4", data);
    calculationResults.result_E6 = calculateFormula("E4+P5", data);
    calculationResults.result_F4 = calculateFormula("IF(G4>C4+(B4-C4)/2,AI4-BO4,AJ4-BF4)", data);
    calculationResults.result_C244 = calculateFormula("IF(BE242>D244,A242-BE242,A242-D244)", data);
    calculationResults.result_L6 = calculateFormula("C244/E242", data);
    calculationResults.result_G6 = calculateFormula("L6 / (D4 + E4)", data);
    calculationResults.result_T4 = calculateFormula("AF4-AG4", data);
    calculationResults.result_L2 = calculateFormula("IF(D4>E4,(0.9*D5-0.6*D5)*(1-(B5-G4)/(B5-C5))+0.6*D5-E5,(0.9*E5-0.65*E5)*((B5-G4)/(B5-C5))+0.65*E5-D5)", data);
    calculationResults.result_L4 = calculateFormula("IF(D4>E4,(0.9*D6-0.6*D6)*(1-(B6-G4)/(B6-C6))+0.6*D6-E6,(0.9*E6-0.65*E6)*((B6-G4)/(B6-C6))+0.65*E6-D6)", data);
    calculationResults.result_H3 = calculateFormula("K9/G9", data);
    calculationResults.result_I3 = calculateFormula("L9/G9", data);
    calculationResults.result_J3 = calculateFormula("I9/E9", data);
    calculationResults.result_K3 = calculateFormula("J9/F9", data);
    calculationResults.result_M4 = calculateFormula("IF(D4 > E4, IF(G4 > B4, AY4, IF(G4 < C4, AU4, 0)), IF(G4 < C4, IF(D4 < E4, BA4, 0), IF(G4 > B4, AW4, 0)))", data);
    calculationResults.result_Q4 = calculateFormula("IF(D4 > E4, IF(G4 > B4, AZ4, IF(G4 < C4, AV4, 0)), IF(G4 < C4, IF(D4 < E4, BB4, 0), IF(G4 > B4, AX4, 0)))", data);
    calculationResults.accumulatedBalance = calculateFormula("IF(B242>D244,A242-B242,A242-D244)", data);

    console.log("All calculationResults:", calculationResults);
    return calculationResults;
}


export const calculationResults = {
    result_BE4: 0,
    result_B5: 0,
    result_C5: 0,
    result_D5: 0,
    result_E5: 0,
    result_B6: 0,
    result_C6: 0,
    result_D6: 0,
    result_E6: 0,
    result_F4: 0,
    result_C244: 0,
    result_L6: 0,
    result_G6: 0,
    result_T4: 0,
    result_L2: 0,
    result_L4: 0,
    result_H3: 0,
    result_I3: 0,
    result_J3: 0,
    result_K3: 0,
    result_M4: 0,
    result_Q4: 0,
    accumulatedBalance: 0
};

export const calculationResult = {
    result_BE4: 0,
    result_B5: 0,
    result_C5: 0,
    result_D5: 0,
    result_E5: 0,
    result_B6: 0,
    result_C6: 0,
    result_D6: 0,
    result_E6: 0,
    result_F4: 0,
    result_C244: 0,
    result_L6: 0,
    result_G6: 0,
    result_T4: 0,
    result_L2: 0,
    result_L4: 0,
    result_H3: 0,
    result_I3: 0,
    result_J3: 0,
    result_K3: 0,
    result_M4: 0,
    result_Q4: 0,
    accumulatedBalance: 0
};