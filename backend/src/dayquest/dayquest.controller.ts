import { z } from "zod";
import { Request, Response, Router } from "express";
import { TasksService, createTaskBodySchema } from "@/dayquest/task.service";
import { CategoriesService, createCategoryBodySchema } from "@/dayquest/category.service";
import { db } from "@/db";

export class DayQuestController {
  public readonly router = Router();

  // Constructor initialization of routes
  constructor(
    private readonly taskService: TasksService,
    private readonly categoryService: CategoriesService,
 

    ) {
    this.router.post("/dayquest/category/create", this.createDayQuestCategory.bind(this),);
    this.router.patch("/dayquest/category/update/:category_id",this.updateDayQuestCategory.bind(this),);
    this.router.delete("/dayquest/category/delete/:category_id",this.deleteDayQuestCategory.bind(this),);
    this.router.get("/dayquest/categories",this.getDayQuestCategory.bind(this),);
    this.router.post("/dayquest/task/create",this.createDayQuestTask.bind(this),);
    this.router.delete("/dayquest/task/delete/:task_id",this.deleteDayQuestTask.bind(this),);
    this.router.get("/dayquest/tasks",this.getDayQuestTask.bind(this),);
    
  }

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
      console.error("Validation failed for createDayQuestCategory:", body.error.issues);
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
        const category = await this.categoryService.createCategory(db, {
            creatorId: user.id,
            body: body.data,
        });
        return res.status(201).send({ message: "Category created successfully", category });
    } catch (error) {
        console.error("Error while creating category:", error);
        return res.status(500).send({
            errors: [{ message: "Failed to create category" }],
        });
    }
}

  async updateDayQuestCategory(req: Request, res: Response) {
    if (!req.session.user) {
        return res.status(401).send({
          errors: [{ message: "Not found session" }],
        });
    }

    const user = req.session.user;

    const parsedResult = z.object({
        category_id: z.string().uuid(),
    }).safeParse(req.params);

    if (!parsedResult.success) {
      console.error("Invalid category ID:", parsedResult.error.issues);
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { category_id } = parsedResult.data;
    console.log("updateDayQuestCategory -> category_id", category_id);

    const body = createCategoryBodySchema.safeParse(req.body);

    if (!body.success) {
      console.error("Validation failed for updateDayQuestCategory:", body.error.issues);
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
        const updatedCategory = await this.categoryService.updateCategory(db, {
            creatorId: user.id,
            categoryId: category_id,
            body: body.data,
        });

        return res.status(200).send({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.error("Error while updating category:", error);
        return res.status(500).send({
            errors: [{ message: "Failed to update category" }],
        });
    }
}

  async deleteDayQuestCategory(req: Request, res: Response) {
    if (!req.session.user) {
        return res.status(401).send({
          errors: [{ message: "Not found session" }],
        });
    }

    const user = req.session.user;

    const parsedResult = z.object({
        category_id: z.string().uuid(),
    }).safeParse(req.params);

    if (!parsedResult.success) {
      console.error("Invalid category ID for delete operation:", parsedResult.error.issues);
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { category_id } = parsedResult.data;
    console.log("deleteDayQuestCategory -> category_id", category_id);

    try {
        await this.categoryService.deleteCategory(db, {
            creatorId: user.id,
            categoryId: category_id
        });

      
        return res.status(200).send({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error while deleting category:", error);
        return res.status(500).send({
            errors: [{ message: "Failed to delete category" }],
        });
    }
}


 

  async getDayQuestCategory(req: Request, res: Response) {
    if (!req.session.user) {
        return res.status(401).send({
          errors: [{ message: "Not active found session" }],
        });
    }

    const user = req.session.user;
    console.log("getDayQuestCategory -> user", user.id);

    try{
        const categories = await this.categoryService.getUserCategories(db, user.id);
        console.log("getDayQuestCategory -> categories", categories);
        return res.send(categories);
    }catch(error){
        console.error(error);
        return res.status(500).send({
            errors: [{ message: "Failed to get categories" }],
        });
    }
  }



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
      console.error("Validation failed for createDayQuestTask:", body.error.issues);
      return res.status(400).send({ errors: body.error.issues });
    }

    try {
        const task = await this.taskService.createTask(db, {
            userId: user.id,
            body: body.data,
        });

        return res.status(201).send({ message: "Task created successfully", task });
    } catch (error) {
        console.error("Error while creating task:", error);
        return res.status(500).send({
            errors: [{ message: "Failed to create task" }],
        });
    }
}


  async deleteDayQuestTask(req: Request, res: Response) {
    if (!req.session.user) {
        return res.status(401).send({
          errors: [{ message: "No active session found" }],
        });
    }

    const user = req.session.user;

    const parsedResult = z.object({
        task_id: z.string().uuid(),
    }).safeParse(req.params);

    if (!parsedResult.success) {
      console.error("Invalid task ID for delete operation:", parsedResult.error.issues);
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

  async getDayQuestTask(req: Request, res: Response) {
    if (!req.session.user) {
        return res.status(401).send({
          errors: [{ message: "No active session found" }],
        });
    }

    const user = req.session.user;
    console.log("getDayQuestTask -> user ID:", user.id);

    try {
  
        const tasks = await this.taskService.getUserTasks(db, user.id);

        if (!tasks || tasks.length === 0) {
            console.log("getDayQuestTask -> No tasks found for user:", user.id);
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


}   


