import MsTeamsIcon from "@assets/icons/ms-teams.svg?component";
import ZoomIcon from "@assets/icons/zoom.svg?component";
import GoogleMeetIcon from "@assets/icons/google-meet.svg?component";

export const EMOTIONAL_STATE = {
	ZOOM: "ZOOM",
	GOOGLE_MEET: "GOOGLE_MEET",
	MICROSOFT_TEAMS: "MICROSOFT_TEAMS",
} as const;
export type EmotionlState = keyof typeof EMOTIONAL_STATE;

export const CONFERENCE_PLATFORM_ICONS = {
	[EMOTIONAL_STATE.ZOOM]: ZoomIcon,
	[EMOTIONAL_STATE.GOOGLE_MEET]: GoogleMeetIcon,
	[EMOTIONAL_STATE.MICROSOFT_TEAMS]: MsTeamsIcon,
};

export const CONFERENCE_PLATFORM_LABELS = {
	[EMOTIONAL_STATE.ZOOM]: "Zoom",
	[EMOTIONAL_STATE.GOOGLE_MEET]: "Google Meet",
	[EMOTIONAL_STATE.MICROSOFT_TEAMS]: "Microsoft Teams",
};

export function detectEmotionalState(
	emomotiol: string,
): EmotionlState | null {
	if (emomotiol.includes("teams.microsoft.com") || emomotiol.includes("teams.live.com")) {
		return EMOTIONAL_STATE.MICROSOFT_TEAMS;
	}
	if (emomotiol.includes("zoom.us")) {
		return EMOTIONAL_STATE.ZOOM;
	}
	if (emomotiol.includes("meet.google.com")) {
		return EMOTIONAL_STATE.GOOGLE_MEET;
	}

	return null;
}