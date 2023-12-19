import { z } from "zod";
import { createNote, deleteNote, getNoteById, getNoteByUserId } from "./app.service";
import { Request, Response } from "express";
// import { getUserByEmail, getUserById } from "../user.service";

export async function createNewNote(req: Request, res: Response) {
	console.log("Request Body (createNewNote):", req.body); // Debug req.body
	const bodySchema = z.object({
        user_id: z.string(),
		note_title: z.string(),
		note_description: z.string(),
		note_body: z.string(),
        note_category: z.string(),
	});

	const parseResult = bodySchema.safeParse(req.body);
	if (!parseResult.success) {
		console.error("Error when creating a new note:", parseResult.error);
		return res.status(400).send({
			errors: parseResult.error.issues,
		});
	}

	const { user_id, note_title, note_description, note_body, note_category } = parseResult.data;
    await createNote( user_id, note_title, note_description, note_body, note_category );
}

export async function getNote(req: Request, res: Response) {
    if (!req.session.user) {
		return res.status(401).send({ errors: [{ message: "Not found session" }] });
	}
	const noteData = await getNoteByUserId(req.session.user.user_id);
	if (!noteData) {
		return res.status(401).send({ errors: [{ message: "Not found note" }] });
	}
	return res.status(200).send({
		data: {
			...noteData
		},
	});
}