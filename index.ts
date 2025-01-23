import { serve } from "bun";
import { cpfHandler } from "./handlers/calculate-cpf";
import { updateCPFRates } from "./utils/api-utils";

// Create a Map to store route handlers
const routes = new Map<string, (req: Request) => Promise<Response>>();

export function registerRoute(path: string, handler: (req: Request) => Promise<Response>) {
  const BASE_PATH = '/api';
  routes.set(BASE_PATH + path, handler);
}

registerRoute('/', async (req: Request) => {
  return new Response("Please use /api/cpf to calculate CPF", { status: 200 });
});

registerRoute('/cpf', cpfHandler);

updateCPFRates("daily");

serve({
  fetch: async (req: Request) => {
    const url = new URL(req.url);
    const handler = routes.get(url.pathname);
    
    if (handler) {
      return handler(req);
    }

    return new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

console.log("Server is running on port 3000");