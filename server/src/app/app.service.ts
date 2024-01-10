import { pool } from "../database";


// CREATE TABLE IF NOT EXISTS user_notes (
//     note_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id uuid NOT NULL,
//     note_title VARCHAR(200) NOT NULL,
//     note_description VARCHAR(200) NOT NULL,
//     note_body VARCHAR(200) NOT NULL,
//     note_category VARCHAR(200) NOT NULL,
//     note_status VARCHAR(200) NOT NULL,
//     created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
// );

export const createNote = async (userId: string, note_title: string, note_description: string, note_body: string, note_category: string) => {
	const result = await pool.query(
		`INSERT INTO user_notes (user_id, note_title, note_description, note_body, note_category) VALUES ($1, $2, $3, $4, $5) RETURNING note_id;`,
		[userId, note_title, note_description, note_body, note_category]
	);
	return result.rows[0] as { note_id: string };
};
export const deleteNote = async (noteId: string) => {
	await pool.query(`DELETE FROM user_notes WHERE note_id = $1;`, [
		noteId,
	]);
};

export const getNoteById = async (noteId: string) => {
	const result = await pool.query(
		`SELECT * from user_notes WHERE note_id = $1;`,
		[noteId]
	);
	return result.rows[0] as { note_id: string; user_id: string; note_title: string; note_description: string; note_body: string; note_category: string;};
};

// export const getNoteById = async (noteId: string) => {
// 	try {
// 	  const result = await pool.query(
// 		'SELECT * FROM user_notes WHERE note_id = $1;',
// 		[noteId]
// 	  );
  
// 	  // Проверка, были ли возвращены какие-либо строки
// 	  if (result.rows.length > 0) {
// 		return result.rows[0] as {
// 		  note_id: string;
// 		  user_id: string;
// 		  note_title: string;
// 		  note_description: string;
// 		  note_body: string;
// 		  note_category: string;
// 		};
// 	  } else {
// 		// Если ничего не найдено, вернуть undefined или бросить ошибку
// 		return undefined;
// 		// или бросить ошибку:
// 		// throw new Error(`Note not found with id: ${noteId}`);
// 	  }
// 	} catch (error) {
// 	  // Обработка ошибок выполнения запроса
// 	  console.error('Error in getNoteById:', error);
// 	  throw new Error('Error retrieving note by id');
// 	}
//   };
  

export const getNoteByUserId = async (userId: string) => {
	const result = await pool.query(
		`SELECT * from user_notes WHERE user_id = $1;`,
		[userId]
	);
	return result.rows as Array<{
		note_id: string;
		user_id: string;
		note_title: string;
		note_description: string;
		note_body: string;
		note_category: string;
		created_at: string;
	}>;
};
