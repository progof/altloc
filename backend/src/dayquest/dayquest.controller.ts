import { z } from "zod";
import { Request, Response, Router } from "express";
import { TasksService, createTaskBodySchema } from "@/dayquest/task.service.js";
import {
  CategoriesService,
  createCategoryBodySchema,
} from "@/dayquest/category.service.js";
import {
  CommentsService,
  createCommentBodySchema,
} from "@/dayquest/comment.service.js";
import { db } from "@/db.js";
import { checkCategoriesLimit, checkTasksLimit, checkLevel } from "../middlewares/dayquest.middlewares.js";

export class DayQuestController {
  public readonly router = Router();

  // Constructor initialization of routes
  constructor(
    private readonly taskService: TasksService,
    private readonly categoryService: CategoriesService,
    private readonly commentService: CommentsService
  ) {
    this.router.post(
      "/dayquest/category/create",
      checkCategoriesLimit,
      this.createDayQuestCategory.bind(this)
    );
    this.router.patch(
      "/dayquest/category/update/:category_id",
      this.updateDayQuestCategory.bind(this)
    );
    this.router.delete(
      "/dayquest/category/delete/:category_id",
      this.deleteDayQuestCategory.bind(this)
    );
    this.router.get(
      "/dayquest/categories",
      this.getDayQuestCategory.bind(this)
    );
    this.router.get(
      "/dayquest/category/:category_id",
      this.getDayQuestCategoryById.bind(this)
    );
    this.router.post(
      "/dayquest/task/create",
      checkTasksLimit,
      this.createDayQuestTask.bind(this)
    );
    this.router.delete(
      "/dayquest/task/delete/:task_id",
      this.deleteDayQuestTask.bind(this)
    );
    this.router.get(
      "/dayquest/tasks/:category_id",
      this.getDayQuestTask.bind(this)
    );
    this.router.patch(
      "/dayquest/task/complete/:task_id",
      checkLevel,
      this.completeTask.bind(this)
    );
    this.router.patch(
      "/dayquest/task/uncomplete/:task_id",
      this.UnCompleteTask.bind(this)
    );
    this.router.get("/dayquest/task/:task_id", this.getTaskById.bind(this));
    this.router.post(
      "/dayquest/comment/create",
      this.createDayQuestComment.bind(this)
    );
    this.router.patch(
      "/dayquest/comment/update/:comment_id",
      this.updateDayQuestComment.bind(this)
    );
    this.router.delete(
      "/dayquest/comment/delete/:comment_id",
      this.deleteDayQuestComment.bind(this)
    );
    this.router.get("/dayquest/comments", this.getDayQuestComment.bind(this));
    this.router.get(
      "/dayquest/comment/:comment_id",
      this.getDayQuestCommentById.bind(this)
    );
  }

  // Create a new category
  async createDayQuestCategory(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;
    console.log("createDayQuestCategory -> user", user.id);

    const body = createCategoryBodySchema.safeParse(req.body);
    console.log("createDayQuestCategory -> body", body);

    if (!body.success) {
      console.error(
        "Validation failed for createDayQuestCategory:",
        body.error.issues
      );
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
      const category = await this.categoryService.createCategory(db, {
        creatorId: user.id,
        body: body.data,
      });
      return res
        .status(201)
        .send({ message: "Category created successfully", category });
    } catch (error) {
      console.error("Error while creating category:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to create category" }],
      });
    }
  }

  // Get category by ID
  async getDayQuestCategoryById(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        category_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid category ID for get operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { category_id } = parsedResult.data;
    console.log("getDayQuestCategoryById -> category_id", category_id);

    try {
      const category = await this.categoryService.getCategory(db, {
        creatorId: user.id,
        categoryId: category_id,
      });

      if (!category) {
        console.log(
          "getDayQuestCategoryById -> No category found for user:",
          category_id
        );
        return res.status(404).send({ message: "No category found" });
      }

      console.log("getDayQuestCategoryById -> category", category);
      return res.status(200).send({ category });
    } catch (error) {
      console.error("Error while fetching category:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to get category" }],
      });
    }
  }

  // Update category
  async updateDayQuestCategory(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        category_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error("Invalid category ID:", parsedResult.error.issues);
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { category_id } = parsedResult.data;
    console.log("updateDayQuestCategory -> category_id", category_id);

    const body = createCategoryBodySchema.safeParse(req.body);

    if (!body.success) {
      console.error(
        "Validation failed for updateDayQuestCategory:",
        body.error.issues
      );
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
      const updatedCategory = await this.categoryService.updateCategory(db, {
        creatorId: user.id,
        categoryId: category_id,
        body: body.data,
      });

      return res.status(200).send({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      console.error("Error while updating category:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to update category" }],
      });
    }
  }

  // Delete category
  async deleteDayQuestCategory(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        category_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid category ID for delete operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { category_id } = parsedResult.data;
    console.log("deleteDayQuestCategory -> category_id", category_id);

    try {
      await this.categoryService.deleteCategory(db, {
        creatorId: user.id,
        categoryId: category_id,
      });

      return res.status(200).send({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error while deleting category:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to delete category" }],
      });
    }
  }

  // Get all categories
  async getDayQuestCategory(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not active found session" }],
      });
    }

    const user = req.session.user;
    console.log("getDayQuestCategory -> user", user.id);

    try {
      const categories = await this.categoryService.getUserCategories(
        db,
        user.id
      );
      console.log("getDayQuestCategory -> categories", categories);
      return res.send(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Failed to get categories" }],
      });
    }
  }

  // Create a new task
  async createDayQuestTask(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "No active session found" }],
      });
    }

    const user = req.session.user;
    console.log("createDayQuestTask -> user", user.id);

    const body = createTaskBodySchema.safeParse(req.body);
    console.log("createDayQuestTask -> body", JSON.stringify(body, null, 2));

    if (!body.success) {
      console.error(
        "Validation failed for createDayQuestTask:",
        body.error.issues
      );
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
      const task = await this.taskService.createTask(db, {
        userId: user.id,
        body: body.data,
      });

      return res
        .status(201)
        .send({ message: "Task created successfully", task });
    } catch (error) {
      console.error("Error while creating task:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to create task" }],
      });
    }
  }

  // Get task by ID
  async getTaskById(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "No active session found" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        task_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid task ID for get operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { task_id } = parsedResult.data;
    console.log("getTaskById -> task_id", task_id);

    try {
      const task = await this.taskService.getTaskById(db, {
        taskId: task_id,
        userId: user.id,
      });

      console.log("(ME) getTaskById -> task", task);

      if (!task) {
        console.log("getTaskById -> No task found for user:", task_id);
        return res.status(404).send({ message: "No task found" });
      }

      console.log("getTaskById -> task", task);
      return res.status(200).send({ task });
    } catch (error) {
      console.error("Error while fetching task:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to get task" }],
      });
    }
  }


  async completeTask(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "No active session found" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        task_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid task ID for complete operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }
    const { task_id } = parsedResult.data;

    try {
      const task = await this.taskService.completeTask(db, {
        userId: user.id,
        taskId: task_id,
      });
      
      return res
        .status(200)
        .send({ message: "Task completed successfully", task });
    } catch (error) {
      console.error("Error while completing task:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to complete task" }],
      });
    }
  }

  // Uncmplete a task
  async UnCompleteTask(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "No active session found" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        task_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid task ID for complete operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { task_id } = parsedResult.data;
    console.log("UnCompleteTask -> task_id", task_id);

    try {
      const task = await this.taskService.unCompleteTask(db, {
        userId: user.id,
        taskId: task_id,
      });

      console.log("UnCompleteTask -> task", task);
      return res
        .status(200)
        .send({ message: "Task UnCompleted successfully", task });
    } catch (error) {
      console.error("Error while UnCompleting task:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to UnComplete task" }],
      });
    }
  }

  // Delete a task
  async deleteDayQuestTask(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "No active session found" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        task_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid task ID for delete operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { task_id } = parsedResult.data;
    console.log("deleteDayQuestTask -> task_id", task_id);

    try {
      await this.taskService.deleteTask(db, {
        userId: user.id,
        taskId: task_id,
      });

      return res.status(200).send({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error while deleting task:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to delete task" }],
      });
    }
  }

  // Get all tasks by categoryId
  async getDayQuestTask(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "No active session found" }],
      });
    }

    const parsedResult = z
      .object({
        category_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid task ID for get operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { category_id } = parsedResult.data;
    console.log("getDayQuestTask -> category_id", category_id);

    try {
      const tasks = await this.taskService.getUserTasksByCategoryId(
        db,

      category_id,
  
      );

      if (!tasks || tasks.length === 0) {
        console.log("getDayQuestTask -> No tasks found for user:", category_id);
        return res.status(404).send({ message: "No tasks found" });
      }

      console.log("getDayQuestTask -> tasks", tasks);
      return res.status(200).send({ tasks });
    } catch (error) {
      console.error("Error while fetching tasks:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to get tasks" }],
      });
    }
  }

  // Create a new comment
  async createDayQuestComment(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;
    console.log("createDayQuestComment -> user", user.id);

    const body = createCommentBodySchema.safeParse(req.body);
    console.log("createDayQuestComment -> body", body);

    if (!body.success) {
      console.error(
        "Validation failed for createDayQuestComment:",
        body.error.issues
      );
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
      const comment = await this.commentService.createComment(db, {
        userId: user.id,
        body: body.data,
      });
      return res
        .status(201)
        .send({ message: "Comment created successfully", comment });
    } catch (error) {
      console.error("Error while creating comment:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to create comment" }],
      });
    }
  }

  // Update comment

  async updateDayQuestComment(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        comment_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error("Invalid comment ID:", parsedResult.error.issues);
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { comment_id } = parsedResult.data;
    console.log("updateDayQuestComment -> comment_id", comment_id);

    const body = createCommentBodySchema.safeParse(req.body);

    if (!body.success) {
      console.error(
        "Validation failed for updateDayQuestComment:",
        body.error.issues
      );
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
      const updatedComment = await this.commentService.updateComment(db, {
        creatorId: user.id,
        commentId: comment_id,
        body: body.data,
      });

      return res.status(200).send({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } catch (error) {
      console.error("Error while updating comment:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to update comment" }],
      });
    }
  }

  // Delete comment

  async deleteDayQuestComment(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        comment_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid comment ID for delete operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { comment_id } = parsedResult.data;
    console.log("deleteDayQuestComment -> comment_id", comment_id);

    try {
      await this.commentService.deleteComment(db, {
        creatorId: user.id,
        commentId: comment_id,
      });

      return res.status(200).send({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error while deleting comment:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to delete comment" }],
      });
    }
  }

  // Get all comments

  async getDayQuestComment(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not active found session" }],
      });
    }

    const user = req.session.user;
    console.log("getDayQuestComment -> user", user.id);

    try {
      const comments = await this.commentService.getComments(db, {
        userId: user.id,
      });
      console.log("getDayQuestComment -> comments", comments);
      return res.send(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Failed to get comments" }],
      });
    }
  }

  // Get comment by ID
  async getDayQuestCommentById(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    const user = req.session.user;

    const parsedResult = z
      .object({
        comment_id: z.string().uuid(),
      })
      .safeParse(req.params);

    if (!parsedResult.success) {
      console.error(
        "Invalid comment ID for get operation:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { comment_id } = parsedResult.data;
    console.log("getDayQuestCommentById -> comment_id", comment_id);

    try {
      const comment = await this.commentService.getCommentById(db, {
        userId: user.id,
        commentId: comment_id,
      });

      if (!comment) {
        console.log(
          "getDayQuestCommentById -> No comment found for user:",
          comment_id
        );
        return res.status(404).send({ message: "No comment found" });
      }

      console.log("getDayQuestCommentById -> comment", comment);
      return res.status(200).send({ comment });
    } catch (error) {
      console.error("Error while fetching comment:", error);
      return res.status(500).send({
        errors: [{ message: "Failed to get comment" }],
      });
    }
  }
}