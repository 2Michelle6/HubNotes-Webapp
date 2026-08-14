import { useMemo } from "react";
import { getLocalDateKey } from "../data/activity";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_FORMATTER = new Intl.DateTimeFormat(undefined, { month: "short" });

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

function buildWeeks(days) {
  const leadingDays = (days[0].date.getDay() + 6) % 7;
  const slots = [...Array(leadingDays).fill(null), ...days];
  while (slots.length % 7 !== 0) slots.push(null);

  return Array.from({ length: slots.length / 7 }, (_, index) => {
    const week = slots.slice(index * 7, index * 7 + 7);
    const firstDay = week.find(Boolean);
    const monthStart = week.find((day) => day?.date.getDate() === 1);
    const monthLabel =
      monthStart || (index === 0 && firstDay)
        ? MONTH_FORMATTER.format(monthStart?.date || firstDay.date)
        : "";
    return { monthLabel, days: week };
  });
}

export default function ActivityHeatmap({ events }) {
  const days = useMemo(() => buildDays(84), []);
  const weeks = useMemo(() => buildWeeks(days), [days]);
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
      <div className="heatmap-scroll">
        <div
          className="heatmap-layout"
          style={{ "--heatmap-week-count": weeks.length }}
        >
          <div className="heatmap-months" aria-hidden="true">
            {weeks.map((week, index) => (
              <span key={`month-${index}`}>{week.monthLabel}</span>
            ))}
          </div>
          <div className="heatmap-body">
            <div className="heatmap-day-labels" aria-hidden="true">
              {DAY_LABELS.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div
              className="activity-heatmap"
              aria-label="Study activity for the last 84 days"
            >
              {weeks.map((week, weekIndex) => (
                <div className="heatmap-week" key={`week-${weekIndex}`}>
                  {week.days.map((day, dayIndex) => {
                    if (!day) {
                      return (
                        <span
                          aria-hidden="true"
                          className="heatmap-cell heatmap-cell--empty"
                          key={`empty-${dayIndex}`}
                        />
                      );
                    }
                    const count = countsByDate[day.key] || 0;
                    const level =
                      count === 0 ? 0 : Math.ceil((count / maxCount) * 4);
                    return (
                      <span
                        key={day.key}
                        className={`heatmap-cell heatmap-cell--${level}`}
                        title={`${day.key}: ${count} activit${count === 1 ? "y" : "ies"}`}
                        aria-label={`${day.key}: ${count} activities`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
