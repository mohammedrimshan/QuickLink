import { Request, Response } from "express";

export interface IUrlController {
  redirect(req: Request, res: Response): Promise<void>;
  createUrl(req: Request, res: Response): Promise<void>;
  getUrls(req: Request, res: Response): Promise<void>;
  getAnalytics(req: Request, res: Response): Promise<void>;
  getMe(req: Request, res: Response): Promise<void>;
  searchUrls(req: Request, res: Response): Promise<void>;
}
