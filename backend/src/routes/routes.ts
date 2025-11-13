import { Request, Response, Express } from "express";
import {
  apiIsRunning,
  deleteCandidatesController,
  editCandidateController,
  getCandidatesController,
  postCandidatesController,
} from "../controllers/candidate";

export default function routes(app: Express): void {
  app.get("/", (req: Request, res: Response) => {
    res.send(apiIsRunning());
  });

  app.get("/api/candidates", async (req: Request, res: Response) => {
    try {
      const candidates = await getCandidatesController();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Error on GET Candidates." });
    }
  });

  app.post("/api/candidates", async (req: Request, res: Response) => {
    try {
      await postCandidatesController();
      res.json({ message: "Success on POST Candidates" });
    } catch (error) {
      res.status(500).json({ message: "Error on POST Candidates." });
    }
  });

  app.put("/api/candidates/:id", async (req: Request, res: Response) => {
    try {
      const updatedCandidate = await editCandidateController(
        req.params.id,
        req.body
      );
      res.json(updatedCandidate);
    } catch (error) {
      res.status(500).json({ message: "Error on PUT Candidate." });
    }
  });

  app.delete("/api/candidates", async (req: Request, res: Response) => {
    try {
      await deleteCandidatesController(req.body.ids);
      res.json({ message: "Success on DELETE Candidates" });
    } catch (error) {
      res.status(500).json({ message: "Error on DELETE Candidates." });
    }
  });
}
