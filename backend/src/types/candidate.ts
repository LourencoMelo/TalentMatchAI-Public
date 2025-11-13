import { z } from 'zod';

const CandidateSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  academicEducation: z.number(),
  work_experience: z.number(),
  technical_skills: z.number(),
  cultural_fit: z.number(),
  problem_solving: z.number(),
  leadership: z.number(),
  overall_score: z.number(),
  notes: z.string(),
});

export const CandidateArraySchema = z.array(CandidateSchema);