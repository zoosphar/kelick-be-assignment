import { updateCPFRates } from "../utils/api-utils";

const interval = "daily";
console.log(`Updating CPF rates ${interval}...`);
updateCPFRates(interval);
