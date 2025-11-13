import mongoose from "mongoose";
import { Schema } from "mongoose";

const CandidateSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  academicEducation: Number,
  work_experience: Number,
  technical_skills: Number,
  cultural_fit: Number,
  problem_solving: Number,
  leadership: Number,
  overall_score: Number,
  notes: String,
});

export const Candidates = mongoose.model("candidate", CandidateSchema);