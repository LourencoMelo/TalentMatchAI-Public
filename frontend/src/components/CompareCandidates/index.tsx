import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { Candidate } from "../../pages/Overview";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { FONT } from "../../utils/constants";
import { CloseCircle } from "iconsax-react";

interface CompareCandidatesProps {
  openCompare: boolean;
  setOpenCompare: (open: boolean) => void;
  candidates: Candidate[];
}

interface RadarData {
  subject: string;
  candidateA: number;
  candidateB: number;
}

const CompareCandidates = ({
  openCompare,
  setOpenCompare,
  candidates,
}: CompareCandidatesProps) => {
  if (candidates.length < 2) {
    return null;
  }

  const [candidateA, candidateB] = candidates;

  const data: RadarData[] = [
    {
      subject: "Academic Education",
      candidateA: Number(candidateA.academicEducation),
      candidateB: Number(candidateB.academicEducation),
    },
    {
      subject: "Work Experience",
      candidateA: Number(candidateA.work_experience),
      candidateB: Number(candidateB.work_experience),
    },
    {
      subject: "Technical Skills",
      candidateA: Number(candidateA.technical_skills),
      candidateB: Number(candidateB.technical_skills),
    },
    {
      subject: "Problem Solving",
      candidateA: Number(candidateA.problem_solving),
      candidateB: Number(candidateB.problem_solving),
    },
    {
      subject: "Leadership",
      candidateA: Number(candidateA.leadership),
      candidateB: Number(candidateB.leadership),
    },
    {
      subject: "Overall Score",
      candidateA: Number(candidateA.overall_score),
      candidateB: Number(candidateB.overall_score),
    },
  ];

  return (
    <Dialog
      open={openCompare}
      onClose={() => setOpenCompare(false)}
      maxWidth="md"
      fullWidth
    >
      <Stack
        direction="row"
        alignItems="center"
        position="relative"
        padding={2}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Compare Candidates
        </DialogTitle>

        <IconButton
          sx={{ marginLeft: "auto" }}
          onClick={() => setOpenCompare(false)}
        >
          <CloseCircle />
        </IconButton>
      </Stack>
      <DialogContent sx={{ pb: 10 }}>
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <RadarChart data={data} outerRadius={90} width={400} height={300}>
            <PolarGrid />
            {/* @ts-ignore */}
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fontSize: 12,
                fontFamily: FONT,
                fontWeight: "bold",
                fill: "#000000ff",
              }}
            />
            {/* @ts-ignore */}
            <PolarRadiusAxis
              tick={{
                fontSize: 14,
                fontFamily: FONT,
                fontWeight: "bold",
                fill: "#000000ff",
              }}
            />
            <Radar
              name={candidateA.name}
              dataKey="candidateA"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.6}
            />
            <Radar
              name={candidateB.name}
              dataKey="candidateB"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                fontFamily: FONT,
                fontWeight: "bold",
                fontSize: 14,
                color: "#555",
              }}
            />
          </RadarChart>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CompareCandidates;
