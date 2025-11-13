import { llama3 } from "../..//api/ai/llama3";
import { authorize, gmailAccess } from "../../api/gmail/gmailConnection";
import { deleteTextFromFile } from "../../api/gmail/fileHandler";
import { Candidates } from "../../models/candidate";
import { CandidateArraySchema } from "../../types/candidate";

const flow = async () => {
  const resultAuth = await authorize();
  await gmailAccess(resultAuth);
  const json = await llama3();
  return json;
};

const getCandidates = async () => {
  try {
    const candidates = await Candidates.find();
    return candidates;
  } catch (error) {
    console.error("Error Getting the Candidates:", error);
  }
};

const postCandidates = async () => {
  try {
    let json = await flow();
    let result = CandidateArraySchema.safeParse(json);

    // Implemented recursive validation until the data is correct
    while (!result.success) {
      await deleteTextFromFile();
      json = await flow();
      result = CandidateArraySchema.safeParse(json);
    }
    await Candidates.insertMany(json);
    await deleteTextFromFile();
  } catch (error) {
    console.error("Error while posting Candidates to DB", error);
  }
};

const editCandidate = async (
  id: string,
  updatedData: Partial<typeof Candidates>
) => {
  try {
    const result = await Candidates.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return result;
  } catch (error) {
    console.error("Error while editing Candidate in DB", error);
  }
};

const deleteCandidates = async (candidates: string[]) => {
  try {
    console.log("Deleting candidates with IDs:", candidates);
    const result = await Candidates.deleteMany({ _id: { $in: candidates } });
    return result;
  } catch (error) {
    console.error("Error while deleting Candidates from DB", error);
  }
};

const apiIsRunning = () => {
  return "API is running...";
};

export {
  flow,
  getCandidates,
  postCandidates,
  apiIsRunning,
  editCandidate,
  deleteCandidates,
};
