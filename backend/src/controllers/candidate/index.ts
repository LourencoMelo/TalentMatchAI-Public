import { Candidates } from "../../models/candidate";
import {
  deleteCandidates,
  editCandidate,
  getCandidates,
  postCandidates,
} from "../../services/candidate/index";

const getCandidatesController = async () => {
  try {
    const candidates = await getCandidates();
    return candidates;
  } catch (error) {
    console.error("Error in getCandidatesController:", error);
  }
};

const postCandidatesController = async () => {
  try {
    const result = await postCandidates();
    return result;
  } catch (error) {
    console.error("Error in postCandidatesController:", error);
  }
};

const editCandidateController = async (
  id: string,
  updatedData: Partial<typeof Candidates>
) => {
  try {
    const result = await editCandidate(id, updatedData);
    return result;
  } catch (error) {
    console.error("Error in editCandidateController:", error);
  }
};

const deleteCandidatesController = async (candidates: string[]) => {
  try {
    const result = await deleteCandidates(candidates);
    return result;
  } catch (error) {
    console.error("Error in deleteCandidatesController:", error);
  }
};

const apiIsRunning = () => {
  return "API is running...";
};

export {
  getCandidatesController,
  postCandidatesController,
  editCandidateController,
  deleteCandidatesController,
  apiIsRunning,
};
