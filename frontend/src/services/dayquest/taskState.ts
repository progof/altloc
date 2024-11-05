export const TASK_PRIORITY = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
} as const;

export const TASK_DIFFICULTY = {
	EASY: "EASY",
	MEDIUM: "MEDIUM",
	HARD: "HARD",
} as const;

export function getTaskPriorityColor(priority: string) {
    switch (priority) {
      case TASK_PRIORITY.HIGH:
        return "red";
      case TASK_PRIORITY.MEDIUM:
        return "yellow";
      case TASK_PRIORITY.LOW:
        return "green";
      default:
        return "black";
    }
  }

export function getTaskDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case TASK_DIFFICULTY.HARD:
        return "red";
      case TASK_DIFFICULTY.MEDIUM:
        return "yellow";
      case TASK_DIFFICULTY.EASY:
        return "green";
      default:
        return "black";
    }
  }