import { useMemo } from "react";
import { getLocalDateKey } from "../data/activity";

const DAY_LABELS = ["Mon", "Wed", "Fri"];

function buildDays(totalDays) {
  const today = new Date();
  const days = [];
  for (let offset = totalDays - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    days.push({ date, key: getLocalDateKey(date) });
  }
  return days;
}

export default function ActivityHeatmap({ events }) {
  const days = useMemo(() => buildDays(84), []);
  const countsByDate = useMemo(
    () =>
      events.reduce((counts, event) => {
        const date = event.date || getLocalDateKey(new Date(event.occurredAt));
        counts[date] = (counts[date] || 0) + 1;
        return counts;
      }, {}),
    [events],
  );
  const maxCount = Math.max(1, ...Object.values(countsByDate));

  return (
    <section className="activity-card">
      <div className="activity-card-heading">
        <div>
          <h2>Study activity</h2>
          <p>
            Every square reflects activity recorded from your courses and games.
          </p>
        </div>
        <span>{events.length} total events</span>
      </div>
      <div className="heatmap-wrap">
        <div className="heatmap-day-labels">
          {DAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div
          className="activity-heatmap"
          aria-label="Study activity for the last 84 days"
        >
          {days.map(({ key }) => {
            const count = countsByDate[key] || 0;
            const level = count === 0 ? 0 : Math.ceil((count / maxCount) * 4);
            return (
              <span
                key={key}
                className={`heatmap-cell heatmap-cell--${level}`}
                title={`${key}: ${count} activit${count === 1 ? "y" : "ies"}`}
                aria-label={`${key}: ${count} activities`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
