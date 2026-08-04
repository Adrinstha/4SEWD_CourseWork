function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <div className="page-header">
      <div>
        <p className="page-header__eyebrow">{eyebrow}</p>

        <h1>{title}</h1>

        <p className="page-header__description">{description}</p>
      </div>

      {onAction ? (
        <button
          className="button button--primary"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : (
        <a className="button button--primary" href={actionHref}>
          {actionLabel}
        </a>
      )}
    </div>
  );
}

export default PageHeader;
