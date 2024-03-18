import { z } from "zod";
import { PostsService } from "./posts.service";
import { Request, Response, Router } from "express";
import { blockNotVerifedUser } from "../middlewares/auth.middlewares";

export class PostsController {
  public readonly router = Router();

  constructor(
    private readonly postsService: PostsService,
  ) {
    this.router.use("/posts", blockNotVerifedUser);
    this.router.post("/posts", this.createPost.bind(this));
    this.router.patch("/posts/:userId/:postId", this.updatePost.bind(this));
    this.router.get("/posts", this.getPosts.bind(this));
    this.router.get("/all-posts", this.getAllPosts.bind(this));
    this.router.get("/count-posts/:userId", this.getCountPosts.bind(this));
    this.router.get("/user-posts/:userId", this.getPostsForUserId.bind(this));
    this.router.get("/posts/:postId", this.getPost.bind(this));
    this.router.delete("/posts/:postId", this.deletePost.bind(this));
  }

  async createPost(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;
    const bodySchema = z.object({
      title: z.string(),
      content: z.string(),
    });
  
    const content = bodySchema.safeParse(req.body);
    if (!content.success) {
      return res.status(400).send({
        errors: content.error.issues,
      });
    }

    console.log("Content data from user:", content.data);

    try {
      const post = await this.postsService.createPost(userId, content.data);
      return res.status(201).send({ data: post });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async updatePost(req: Request, res: Response) {
    const paramsSchema = z.object({
      postId: z.string().uuid(),
      userId: z.string().uuid(),
    });

    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }
    const bodySchema = z.object({
      title: z.string(),
      content: z.string(),
    });

    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }

    console.log("Data from client:", body)

    try {
      const post = await this.postsService.updatePost(params.data.postId, params.data.userId, body.data);
      return res.status(201).send({ data: post });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getPosts(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    try {
      const posts = await this.postsService.getPostsForUser(
        req.session.user.user_id,
      );
      console.log("DEBUG getPosts()",posts);
      return res.status(200).send({
        data: posts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getCountPosts(req: Request, res: Response) {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    try {
      const post = await this.postsService.getCountPostsByUserId(params.data.userId);
      return res.status(200).send({
        data: post,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getPostsForUserId(req: Request, res: Response) {

    const paramsSchema = z.object({
      userId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    try {
      const post = await this.postsService.getPostsForUser(params.data.userId);
      console.log("DEBUG (getPostsForUserId->post):", post);
      return res.status(200).send({
        data: post,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getPost(req: Request, res: Response) {
    const paramsSchema = z.object({
      postId: z.string(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }
    console.log("getPost.postId", params.data.postId);
    try {
      const post = await this.postsService.getPostById(params.data.postId);
      console.log("getPost.post", post);
      return res.status(200).send({
        data: post,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getAllPosts(req: Request, res: Response) {
    // const note = await this.notesService.getAllNotes();
    //   console.log("getAllNotes() data: ", note);
    try {
      const post = await this.postsService.getAllPosts();
      console.log("getAllPosts() data: ", post);
      return res.status(200).send({
        data: post,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async deletePost(req: Request, res: Response) {
    const paramsSchema = z.object({
      postId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }

    try {
      await this.postsService.deletePostById(params.data.postId);
      return res.status(200).send();
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }
}
