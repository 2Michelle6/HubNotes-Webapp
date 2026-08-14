export const ACTIVITY_STORAGE_KEY = "hubnotes-activity";
export const MAX_ACTIVITY_EVENTS = 1000;

export const ACTIVITY_TYPES = {
  COURSE_VISIT: "course_visit",
  DECK_VISIT: "deck_visit",
  CARD_CREATED: "card_created",
  CARD_ANSWERED: "card_answered",
  GAME_STARTED: "game_started",
  GAME_COMPLETED: "game_completed",
  DECK_COMPLETED: "deck_completed",
};

export const POINT_VALUES = {
  CARD_CREATED: 1,
  CORRECT_ANSWER: 3,
  DECK_COMPLETED: 10,
};

export const POINTS_PER_LEVEL = 20;

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getEventPoints(type, details = {}) {
  if (type === ACTIVITY_TYPES.CARD_CREATED) return POINT_VALUES.CARD_CREATED;
  if (type === ACTIVITY_TYPES.CARD_ANSWERED && details.correct) {
    return POINT_VALUES.CORRECT_ANSWER;
  }
  if (type === ACTIVITY_TYPES.DECK_COMPLETED) {
    return POINT_VALUES.DECK_COMPLETED;
  }
  return 0;
}

export function readActivity() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY));
    if (!stored || !Array.isArray(stored.events)) return { events: [] };

    return {
      events: stored.events.filter(
        (event) =>
          event &&
          typeof event.id === "string" &&
          typeof event.type === "string" &&
          typeof event.occurredAt === "string",
      ),
    };
  } catch {
    return { events: [] };
  }
}
