export function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(409).json({
      message: "Cannot delete or update record because associated items exist.",
    });
  }
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.reduce((acc, current) => {
      acc[current.path] = current.message;
      return acc;
    }, {});
    return res.status(400).json({ message: "Validation error.", errors });
  }
  return res.status(err.status || 500).json({
    message: err.message || "Internal server error.",
  });
}

export default errorHandler;
