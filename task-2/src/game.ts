/** Some related "constants" which represent the various outcomes a round can have. */
export const OUTCOME_WIN: string = "WIN";
export const OUTCOME_DRAW: string = "DRAW";
export const OUTCOME_LOSS: string = "LOSS";

/** Some related "constants" which represent the possible choices a player can make when playing. */
export const CHOICE_ROCK: string = "ROCK";
export const CHOICE_PAPER: string = "PAPER";
export const CHOICE_SCISSORS: string = "SCISSORS";

/** Should return a randomly selected choice. Either: "ROCK", "PAPER", "SCISSORS" */
export function getRandomComputerMove(): string {
  const choice = Math.trunc(Math.random() * 3);
  switch (choice) {
    case 0:
      return CHOICE_ROCK;
    case 1:
      return CHOICE_PAPER;
    case 2:
      return CHOICE_SCISSORS;
    default:
      throw new Error(`Unsupported choice: ${choice}`);
  }
}

/**
 * Should return either: "ROCK", "PAPER", "SCISSORS" (or null if the user cancelled)
 */
export function getPlayerMove(): string | null {
  while (true) {
    const rawInput = prompt("Enter a move: rock/paper/scissors");
    const userHasCancelled = rawInput === null;

    if (userHasCancelled) {
      return null;
    }

    switch (rawInput.toLowerCase()) {
      case "r":
      case "rock":
        return CHOICE_ROCK;
      case "p":
      case "paper":
        return CHOICE_PAPER;
      case "s":
      case "scissors":
        return CHOICE_SCISSORS;
    }
  }
}

/** Should return an outcome. Either "WIN", "LOSS" or "DRAW" */
export function getOutcomeForRound(playerChoice: string, computerChoice: string): string {
  const playerHasDrawn = playerChoice === computerChoice;

  if (playerHasDrawn) {
    return OUTCOME_DRAW;
  }

  const playerHasWon =
    (playerChoice === CHOICE_PAPER && computerChoice === CHOICE_ROCK) ||
    (playerChoice === CHOICE_SCISSORS && computerChoice === CHOICE_PAPER) ||
    (playerChoice === CHOICE_ROCK && computerChoice === CHOICE_SCISSORS);

  if (playerHasWon) {
    return OUTCOME_WIN;
  }

  return OUTCOME_LOSS;
}

/** Should return an object containing information about the played round. */
export function playOneRound(): { playerMove: string, computerMove: string, outcome: string } | null {
  const playerMove = getPlayerMove();
  if (null === playerMove) {
    return null;
  }

  const computerMove = getRandomComputerMove();
  const outcome = getOutcomeForRound(playerMove, computerMove);

  return {
    playerMove,
    computerMove,
    outcome,
  };
}

/** Should return undefined/void if the loop were to stop. */
export function playGame(): void {
  /** Some basic game state, where things like scores are tracked. */
  let model: { playerScore: number; computerScore: number } = {
    playerScore: 0,
    computerScore: 0,
  };

  while (true) {
    const dataForRound = playOneRound();

    if (null === dataForRound) {
      break;
    }

    model = updateModel(model, dataForRound);
    showProgressInConsole(dataForRound, model);
  }
}

export function updateModel(
  model:  { playerScore: number; computerScore: number },
  dataForRound: { outcome: string }
): { playerScore: number; computerScore: number } {
  
    switch (dataForRound.outcome) {
    case OUTCOME_WIN:
      return { ...model, playerScore: model.playerScore + 1 };
    case OUTCOME_LOSS:
      return { ...model, computerScore: model.computerScore + 1 };
    default:
      return model;
  }
}

export function showProgressInConsole(
  dataForRound: { playerMove: string; computerMove: string; outcome: string },
  model: { playerScore: number; computerScore: number }
): void {
  
    console.table([
    {
      "Your choice": dataForRound.playerMove,
      "Computer choice": dataForRound.computerMove,
      Outcome: dataForRound.outcome,
      "Your score": model.playerScore,
      "Computer score": model.computerScore,
    },
  ]);
}

playGame();
