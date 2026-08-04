function EmptyState({ title, message, actionLabel, actionHref, onAction }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{message}</p>

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

export default EmptyState;
