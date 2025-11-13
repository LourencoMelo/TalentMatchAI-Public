import { Candidate } from "@/pages/Overview";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { CloseCircle } from "iconsax-react";
import Button from "../Button";
import { useEffect, useState } from "react";
import { CANDIDATE_API_URL } from "../../utils/constants";
import { toast } from "react-hot-toast";

interface EditCandidateProps {
  open: boolean;
  setEditOpen: (open: boolean) => void;
  candidate: Candidate | null;
  handleRefresh: (showToast: boolean) => void;
}

const basicFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
] as const;

const numericFields1 = [
  { key: "academicEducation", label: "Academic Education", type: "number" },
  { key: "work_experience", label: "Work Experience", type: "number" },
  { key: "technical_skills", label: "Technical Skills", type: "number" },
] as const;

const numericFields2 = [
  { key: "problem_solving", label: "Problem Solving", type: "number" },
  { key: "leadership", label: "Leadership", type: "number" },
  { key: "overall_score", label: "Overall Score", type: "number" },
] as const;

const EditCandidate = ({
  open,
  setEditOpen,
  candidate,
  handleRefresh,
}: EditCandidateProps) => {
  const [formData, setFormData] = useState<Candidate | null>(candidate);

  useEffect(() => {
    setFormData(candidate);
  }, [candidate]);

  const handleChange = <K extends keyof Candidate>(
    key: K,
    value: Candidate[K]
  ) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSaveChanges = async (formData: Candidate | null) => {
    try {
      if (!formData) {
        throw new Error("No candidate data to save");
      }
      const response = await fetch(`${CANDIDATE_API_URL}/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update candidate");
      }
      toast.success("Candidate updated successfully");
      handleRefresh(false);
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast.error("Error updating candidate");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setEditOpen(false)}
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
          Edit Candidate
        </DialogTitle>
        <IconButton
          sx={{ marginLeft: "auto" }}
          onClick={() => setEditOpen(false)}
        >
          <CloseCircle />
        </IconButton>
      </Stack>
      <DialogContent>
        <Stack gap={2} paddingY={2}>
          {[basicFields, numericFields1, numericFields2].map((row, i) => (
            <Stack key={i} direction="row" gap={2}>
              {row.map(({ key, label, type = "text" }) => (
                <TextField
                  key={key}
                  label={label}
                  fullWidth
                  type={type}
                  value={formData?.[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value as any)}
                />
              ))}
            </Stack>
          ))}
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={formData?.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </Stack>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            onClick={() => handleSaveChanges(formData)}
          >
            Save Changes
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditCandidate;
