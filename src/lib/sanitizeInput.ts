const sanitizeSearchTerm = (input: string) => input.replace(/[<>;]/g, "");

export { sanitizeSearchTerm };
