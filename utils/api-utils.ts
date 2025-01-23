import { userAgents } from "./constants";
import { CPF_API_URL } from "./constants";
import type { InputData, OutputData } from "./types";
import data from "../cpf-rates.json";

const fetchCPFData = async (inputData: InputData): Promise<any> => {
  try {
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  const response = await fetch(CPF_API_URL, {
    method: "POST",
    headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-GB,en;q=0.6",
        "CSRF-Token": "undefined",
        "Content-Type": "application/json",
        Origin: "https://www.cpf.gov.sg",
        Referer: "https://www.cpf.gov.sg/employer/tools-and-services/calculators/cpf-contribution-calculator",
        "User-Agent": randomUserAgent,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(inputData),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch CPF data: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result[0].payload.contributionPayableResponseData;
} catch (error) {
  console.error("Error fetching CPF data:", error);
}
}


const updateCPFRates = async (interval: "daily" | "weekly" | "monthly") => {
  let intervalInSeconds = 0;
  switch (interval) {
  case "daily": 
    intervalInSeconds = 86400;
    break;
    case "weekly": 
    intervalInSeconds = 604800;
    break;
    case "monthly": 
    intervalInSeconds = 2629746;
    break;
  }

  const allRates = {
    "lastUpdated": "",
    "3rdYearSPR": {
      "totalRate": "",
      "employeeRate": "",
      "wageCeiling": ""
    },
    "1stYearSPR": {
      "GG": {
        "totalRate": "",
        "employeeRate": "",
        "wageCeiling": ""
      },
      "FG": {
        "totalRate": "",
        "employeeRate": "",
        "wageCeiling": ""
      },
      "FF": {
        "totalRate": "",
        "employeeRate": "",
        "wageCeiling": ""
      }
    },
    "2ndYearSPR": {
      "GG": {
        "totalRate": "",
        "employeeRate": "",
        "wageCeiling": ""
      },
      "FG": {
        "totalRate": "",
        "employeeRate": "",
        "wageCeiling": ""
      },
      "FF": {
        "totalRate": "",
        "employeeRate": "",
        "wageCeiling": ""
      }
    }
  }

  const requests = [
    // 3rd Year SPR
    fetchCPFData({
      "monthPaid": "2025-01",
      "dateOfBirth": "1999-09-01",
      "allocationTypeCode": "PTE",
      "employerContributionCode": "",
      "employeeContributionCode": "",
      "citizenshipTypeCode": "CTZ", 
      "yearOfSingaporePermanentResidentCode": "",
      "ordinaryWage": "10000",
      "additionalWage": "100",
      "calculatorData": "contributionCalculatorPayable"
    }),

    // 1st Year SPR GG
    fetchCPFData({
      "monthPaid": "2025-01",
      "dateOfBirth": "1999-09-01",
      "allocationTypeCode": "PTE",
      "employerContributionCode": "G",
      "employeeContributionCode": "G",
      "citizenshipTypeCode": "SPR", 
      "yearOfSingaporePermanentResidentCode": "1",
      "ordinaryWage": "10000",
      "additionalWage": "100",
      "calculatorData": "contributionCalculatorPayable"
    }),

    // 1st Year SPR FG
    fetchCPFData({
      "monthPaid": "2025-01",
      "dateOfBirth": "1999-09-01",
      "allocationTypeCode": "PTE",
      "employerContributionCode": "F",
      "employeeContributionCode": "G",
      "citizenshipTypeCode": "SPR", 
      "yearOfSingaporePermanentResidentCode": "1",
      "ordinaryWage": "10000",
      "additionalWage": "100",
      "calculatorData": "contributionCalculatorPayable"
    }),

    // 1st Year SPR FF
    fetchCPFData({
      "monthPaid": "2025-01",
      "dateOfBirth": "1999-09-01",
      "allocationTypeCode": "PTE",
      "employerContributionCode": "F",
      "employeeContributionCode": "F",
      "citizenshipTypeCode": "SPR", 
      "yearOfSingaporePermanentResidentCode": "1",
      "ordinaryWage": "10000",
      "additionalWage": "100",
      "calculatorData": "contributionCalculatorPayable"
    }),

    // 2nd Year SPR GG
    fetchCPFData({
      "monthPaid": "2025-01",
      "dateOfBirth": "1999-09-01",
      "allocationTypeCode": "PTE",
      "employerContributionCode": "G",
      "employeeContributionCode": "G",
      "citizenshipTypeCode": "SPR", 
      "yearOfSingaporePermanentResidentCode": "2",
      "ordinaryWage": "10000",
      "additionalWage": "100",
      "calculatorData": "contributionCalculatorPayable"
    }),

    // 2nd Year SPR FG
    fetchCPFData({
      "monthPaid": "2025-01",
      "dateOfBirth": "1999-09-01",
      "allocationTypeCode": "PTE",
      "employerContributionCode": "F",
      "employeeContributionCode": "G",
      "citizenshipTypeCode": "SPR", 
      "yearOfSingaporePermanentResidentCode": "2",
      "ordinaryWage": "10000",
      "additionalWage": "100",
      "calculatorData": "contributionCalculatorPayable"
    }),

    // 2nd Year SPR FF
    fetchCPFData({
      "monthPaid": "2025-01",
      "dateOfBirth": "1999-09-01",
      "allocationTypeCode": "PTE",
      "employerContributionCode": "F",
      "employeeContributionCode": "F",
      "citizenshipTypeCode": "SPR", 
      "yearOfSingaporePermanentResidentCode": "2",
      "ordinaryWage": "10000",
      "additionalWage": "100",
      "calculatorData": "contributionCalculatorPayable"
    })
  ];

  const updateRates = async () => { 
    const [
      rates3rdYearSPR,
      rates1stYearSPRGG,
      rates1stYearSPRFG,
      rates1stYearSPRFF,
      rates2ndYearSPRGG,
      rates2ndYearSPRFG,
      rates2ndYearSPRFF
    ] = await Promise.all(requests);


    // Update allRates object
    allRates["3rdYearSPR"] = {
      totalRate: rates3rdYearSPR.npaaTotalRateFactor1,
      employeeRate: rates3rdYearSPR.npaaEmployeeRateFactor1,
      wageCeiling: rates3rdYearSPR.employeeOrdinaryWageCeiling
    };

    allRates["1stYearSPR"] = {
      GG: {
        totalRate: rates1stYearSPRGG.npaaTotalRateFactor1,
        employeeRate: rates1stYearSPRGG.npaaEmployeeRateFactor1,
        wageCeiling: rates1stYearSPRGG.employeeOrdinaryWageCeiling
      },
      FG: {
        totalRate: rates1stYearSPRFG.npaaTotalRateFactor1,
        employeeRate: rates1stYearSPRFG.npaaEmployeeRateFactor1,
        wageCeiling: rates1stYearSPRFG.employeeOrdinaryWageCeiling
      },
      FF: {
        totalRate: rates1stYearSPRFF.npaaTotalRateFactor1,
        employeeRate: rates1stYearSPRFF.npaaEmployeeRateFactor1,
        wageCeiling: rates1stYearSPRFF.employeeOrdinaryWageCeiling
      }
    };

    allRates["2ndYearSPR"] = {
      GG: {
        totalRate: rates2ndYearSPRGG.npaaTotalRateFactor1,
        employeeRate: rates2ndYearSPRGG.npaaEmployeeRateFactor1,
        wageCeiling: rates2ndYearSPRGG.employeeOrdinaryWageCeiling
      },
      FG: {
        totalRate: rates2ndYearSPRFG.npaaTotalRateFactor1,
        employeeRate: rates2ndYearSPRFG.npaaEmployeeRateFactor1,
        wageCeiling: rates2ndYearSPRFG.employeeOrdinaryWageCeiling
      },
      FF: {
        totalRate: rates2ndYearSPRFF.npaaTotalRateFactor1,
        employeeRate: rates2ndYearSPRFF.npaaEmployeeRateFactor1,
        wageCeiling: rates2ndYearSPRFF.employeeOrdinaryWageCeiling
      }
    };

    allRates["lastUpdated"] = new Date().toISOString();

    console.log('updating cpf-rates.json', interval);
    // In a production environment, we should use a lightweight database like Redis to store the rates
    Bun.write("cpf-rates.json", JSON.stringify(allRates, null, 2));
  }

  // run for the first time
  await updateRates();

  // run every interval
  setInterval(updateRates, intervalInSeconds * 1000);
}

const calculateCPF = (input: InputData): OutputData => {
  let EMPLOYEE_RATE, TOTAL_RATE, WAGE_CEILING;

  // order is important as the employer code is the first character and the employee code is the second character
  const employerEmployeeContributionCode = input.employerContributionCode + input.employeeContributionCode as "GG" | "FG" | "FF";

  if(input.yearOfSingaporePermanentResidentCode === "1") {
    
    EMPLOYEE_RATE = data["1stYearSPR"][employerEmployeeContributionCode].employeeRate;
    TOTAL_RATE = data["1stYearSPR"][employerEmployeeContributionCode].totalRate;
    WAGE_CEILING = data["1stYearSPR"][employerEmployeeContributionCode].wageCeiling;
  } else if(input.yearOfSingaporePermanentResidentCode === "2") {
    EMPLOYEE_RATE = data["2ndYearSPR"][employerEmployeeContributionCode].employeeRate;
    TOTAL_RATE = data["2ndYearSPR"][employerEmployeeContributionCode].totalRate;
    WAGE_CEILING = data["2ndYearSPR"][employerEmployeeContributionCode].wageCeiling;
  } else {
    EMPLOYEE_RATE = data["3rdYearSPR"].employeeRate;
    TOTAL_RATE = data["3rdYearSPR"].totalRate;
    WAGE_CEILING = data["3rdYearSPR"].wageCeiling;
  }

  /* 
  * Need more clarification on the effect of age on the rates, becuase in the calculator, it is not based on age.
  * Calculator used - https://www.cpf.gov.sg/employer/tools-and-services/calculators/cpf-contribution-calculator
  */
  // const birthDate = new Date(input.dateOfBirth);
  // const paidDate = new Date(input.monthPaid);
  // const age =
  //   paidDate.getFullYear() -
  //   birthDate.getFullYear() -
  //   (paidDate.getMonth() < birthDate.getMonth() ? 1 : 0);

  const ordinaryWage = Math.min(Number(input.ordinaryWage), Number(WAGE_CEILING));

  const totalWages = ordinaryWage + Number(input.additionalWage);

  const employeeShare = Number(EMPLOYEE_RATE) / 100 * totalWages;
  const totalContribution = Number(TOTAL_RATE) / 100 * totalWages;
  
  const employerShare = totalContribution - employeeShare;

  return {
    employeeContribution: parseFloat(employeeShare.toFixed(2)),
    employerContribution: parseFloat(employerShare.toFixed(2)),
    totalContribution: parseFloat(totalContribution.toFixed(2)),
    employeeRate: Number(EMPLOYEE_RATE),
    totalRate: Number(TOTAL_RATE),
  };
}
export { fetchCPFData, updateCPFRates, calculateCPF };