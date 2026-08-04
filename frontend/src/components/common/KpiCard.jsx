function KpiCard({ title, value, subtitle, variant = "default" }) {
  const variantStyles = {
    default: { borderColor: "var(--border)", badgeBg: "#f1f5f9", badgeColor: "#475569" },
    primary: { borderColor: "#c7d2fe", badgeBg: "#e0e7ff", badgeColor: "#3730a3" },
    warning: { borderColor: "#fde68a", badgeBg: "#fef3c7", badgeColor: "#92400e" },
    danger: { borderColor: "#fecdd3", badgeBg: "#ffe4e6", badgeColor: "#9f1239" },
    success: { borderColor: "#99f6e4", badgeBg: "#ccfbf1", badgeColor: "#115e59" },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className="kpi-card"
      style={{ borderLeft: `4px solid ${style.badgeColor}` }}
    >
      <span className="kpi-card__title">{title}</span>
      <div className="kpi-card__value">{value}</div>
      {subtitle && <span className="kpi-card__subtitle">{subtitle}</span>}
    </div>
  );
}

export default KpiCard;
