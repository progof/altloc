import cron from "node-cron";
import { dayQuestTasksTable } from "@db/schema.js";
import { db } from "@/db.js";
import { eq } from "drizzle-orm";

cron.schedule(
	"5 0 * * *",
	async () => {
		console.log("Running cron job to reset tasks");
		try {
			await db
				.update(dayQuestTasksTable)
				.set({ isCompleted: false })
				.where(eq(dayQuestTasksTable.isCompleted, true))
				.execute();

			console.log("Tasks reset successfully");
		} catch (error) {
			console.error("Error resetting tasks:", error);
		}
	},
	{
		scheduled: true,
		timezone: "Europe/Warsaw",
	}
);
