interface InputData {
  additionalWage: string;
  allocationTypeCode: string;
  calculatorData: string;
  citizenshipTypeCode: string;
  dateOfBirth: string;
  employeeContributionCode: string;
  employerContributionCode: string;
  monthPaid: string;
  ordinaryWage: string;
  yearOfSingaporePermanentResidentCode: string;
}

interface OutputData {
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  employeeRate: number;
  totalRate: number;
}

export type { InputData, OutputData };