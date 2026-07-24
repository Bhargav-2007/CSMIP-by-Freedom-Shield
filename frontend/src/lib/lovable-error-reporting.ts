type ErrorContext = Record<string, unknown>;

export function reportLovableError(error: Error, context: ErrorContext = {}) {
  if (import.meta.env.DEV) {
    console.error("Captured route error", { error, context });
  }
}
