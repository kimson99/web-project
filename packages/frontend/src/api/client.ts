import { createClient } from "@repo/api/client";

const client = createClient({ baseUrl: "localhost:8000" });

export default client;
