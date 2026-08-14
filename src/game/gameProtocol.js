export const GAME_PROTOCOL = "hubnotes-game";
export const GAME_PROTOCOL_VERSION = 1;

export function createGameStartMessage({ sessionId, course, deck }) {
  return {
    protocol: GAME_PROTOCOL,
    version: GAME_PROTOCOL_VERSION,
    type: "game.start",
    sessionId,
    course: {
      id: course.id,
      title: course.title,
      code: course.code,
    },
    deck: {
      id: deck.id,
      title: deck.title,
    },
    cards: deck.cards.map((card) => ({
      id: card.id,
      question: card.question,
      answer: card.answer,
    })),
    settings: {
      cardOrder: "sequential",
      answerMatching: "trim-case-insensitive",
    },
  };
}

export function parseGameMessage(rawMessage) {
  if (typeof rawMessage !== "string") return null;

  try {
    const message = JSON.parse(rawMessage);
    if (
      message?.protocol !== GAME_PROTOCOL ||
      message.version !== GAME_PROTOCOL_VERSION ||
      typeof message.type !== "string"
    ) {
      return null;
    }
    return message;
  } catch {
    return null;
  }
}
