import { calculateCPF, fetchCPFData } from "../utils/api-utils";
import type { InputData, OutputData } from "../utils/types";

const cpfHandler = async (req: Request) => {
  if (req && req.method === "POST") {
    try {
      const input: InputData[] = await req.json();
      const results = input.map(calculateCPF);

      console.log(results);
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to calculate CPF: ${errorMessage}`);
    }
  } else {
    return new Response("Method not allowed", { status: 405 });
  }
}

export { cpfHandler };