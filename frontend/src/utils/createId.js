function createId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  const randomPart = Math.random().toString(16).slice(2);

  return `${prefix}-${Date.now()}-${randomPart}`;
}

export default createId;
