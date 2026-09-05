import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "../mocks/server";

// បើក MSW Server មុនពេលរត់ Test
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset Handlers និង Cleanup DOM បន្ទាប់ពី Test នីមួយៗ
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// បិទ MSW Server បន្ទាប់ពី Test ចប់
afterAll(() => server.close());