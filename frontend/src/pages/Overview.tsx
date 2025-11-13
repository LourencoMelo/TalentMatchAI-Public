import React, { useEffect, useState } from "react";
import { Box, IconButton, Slide, Stack } from "@mui/material";
import TalentTable from "../components/TalentTable";
import {
  ArrowCircleLeft2,
  Edit,
  Profile2User,
  Refresh,
  Trash,
} from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { LOGO_URL, CANDIDATE_API_URL } from "../utils/constants";
import Button from "../components/Button";
import { toast } from "react-hot-toast";
import EditCandidate from "../components/EditCandidate";
import CompareCandidates from "../components/CompareCandidates";

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone: string;
  academicEducation: string;
  work_experience: string;
  technical_skills: string;
  problem_solving: string;
  leadership: string;
  overall_score: string;
  notes?: string;
}

const Overview: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  );

  const disabledEdit = selectedIds.length !== 1;
  const disabledCompare = selectedIds.length !== 2;

  const navigate = useNavigate();

  const handleEditClick = () => {
    setEditOpen(true);
  };

  const handleCompareClick = () => {
    setCompareOpen(true);
  };

  useEffect(() => {
    if (selectedIds.length === 1) {
      const candidate = candidates.find((c) => c._id === selectedIds[0]);
      setCurrentCandidate(candidate || null);
    } else {
      setCurrentCandidate(null);
    }
  }, [selectedIds, candidates]);

  useEffect(() => {
    handleRefresh(false);
  }, []);

  const handleRefresh = async (showToast = true) => {
    try {
      const response = await fetch(CANDIDATE_API_URL, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error fetching candidates");
      }
      const resCandidates: Candidate[] = await response.json();
      setCandidates(resCandidates);
      if (showToast) {
        toast.success("Candidates fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Error fetching candidates");
    }
  };

  const handleGenerateCandidates = async () => {
    try {
      const response = await fetch(CANDIDATE_API_URL, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error generating candidates");
      }
      const resCandidates: Candidate[] = await response.json();
      handleRefresh();
      console.log(resCandidates);
      toast.success("Candidates generated successfully");
    } catch (error) {
      console.error("Error generating candidates:", error);
      toast.error("Error generating candidates");
    }
  };

  const handleDeleteCandidates = async () => {
    try {
      const response = await fetch(CANDIDATE_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!response.ok) {
        throw new Error("Error deleting candidates");
      }
      handleRefresh();
      toast.success("Candidates deleted successfully");
    } catch (error) {
      toast.error("Error deleting candidates");
      console.error("Error deleting candidates:", error);
    }
  };

  console.log("Selected IDs:", selectedIds);

  return (
    <Box>
      <Stack direction={"row"} justifyContent="space-between" width="100%">
        <IconButton onClick={() => navigate("/")} sx={{ ml: 3, mt: 2 }}>
          <ArrowCircleLeft2 size="32" color="white" variant="Bold" />
        </IconButton>
        <IconButton onClick={() => handleRefresh()} sx={{ mr: 3, mt: 2 }}>
          <Refresh size="32" color="white" variant="Bold" />
        </IconButton>
      </Stack>

      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        paddingBottom={5}
      >
        <img
          src={LOGO_URL}
          style={{ width: "60%", maxWidth: 200, height: "auto" }}
          alt="TalentMatchAI Logo"
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: { xs: "60vh", sm: "70vh" },
        }}
      >
        <TalentTable
          candidates={candidates}
          onSelectionChange={(ids) => setSelectedIds(ids)}
        />
      </Box>

      <Stack flexDirection="row" justifyContent="right" gap={2} mt={2} mr={4}>
        <Button onClick={handleGenerateCandidates}>Generate Candidates</Button>
      </Stack>
      {selectedIds.length > 0 && (
        <Stack
          direction="row"
          position="fixed"
          bottom={20}
          left="50%"
          gap={2}
          sx={{
            transform: "translateX(-50%)",
          }}
        >
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <div>
              <IconButton
                sx={{
                  backgroundColor: disabledEdit ? "lightgray" : "green",
                  "&:hover": {
                    backgroundColor: "#2e7d32",
                  },
                  color: "white",
                }}
                disabled={disabledEdit}
                onClick={handleEditClick}
              >
                <Edit />
              </IconButton>
            </div>
          </Slide>
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <div>
              <IconButton
                sx={{
                  backgroundColor: "red",
                  "&:hover": { backgroundColor: "#c62828" },
                  color: "white",
                }}
                onClick={handleDeleteCandidates}
              >
                <Trash />
              </IconButton>
            </div>
          </Slide>
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <div>
              <IconButton
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                  color: "white",
                }}
                disabled={disabledCompare}
                onClick={handleCompareClick}
              >
                <Profile2User />
              </IconButton>
            </div>
          </Slide>
        </Stack>
      )}
      <EditCandidate
        open={editOpen}
        setEditOpen={setEditOpen}
        candidate={currentCandidate}
        handleRefresh={handleRefresh}
      />
      <CompareCandidates
        openCompare={compareOpen}
        setOpenCompare={setCompareOpen}
        candidates={candidates}
      />
    </Box>
  );
};

export default Overview;
