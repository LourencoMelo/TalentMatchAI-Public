import React from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { dataGridStyles, hoverClickableTextColor } from "./styles";

interface Candidate {
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

interface TalentTableProps {
  candidates: Candidate[];
  onSelectionChange?: (ids: GridRowSelectionModel) => void;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 150 },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    renderCell: (params) => (
      <a
        href={`mailto:${params.value}`}
        style={{ color: hoverClickableTextColor, textDecoration: "underline" }}
      >
        {params.value}
      </a>
    ),
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 130,
    renderCell: (params) => (
      <a
        href={`tel:${params.value}`}
        style={{ color: hoverClickableTextColor, textDecoration: "underline" }}
      >
        {params.value}
      </a>
    ),
  },
  { field: "academicEducation", headerName: "Academic Education", width: 150 },
  { field: "work_experience", headerName: "Work Experience Fit", width: 100 },
  { field: "technical_skills", headerName: "Technical Skills", width: 120 },
  { field: "problem_solving", headerName: "Problem Solving", width: 150 },
  { field: "leadership", headerName: "Leadership", width: 120 },
  { field: "overall_score", headerName: "Overall Score", width: 120 },
  { field: "notes", headerName: "Notes", width: 200 },
];

const TalentTable: React.FC<TalentTableProps> = ({
  candidates,
  onSelectionChange,
}) => {
  return (
    <Box sx={{ height: 500, mx: 4 }}>
      <DataGrid
        rows={candidates}
        columns={columns}
        pageSizeOptions={[7]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowId={(row) => row._id}
        onRowSelectionModelChange={(newSelection) => {
          if (onSelectionChange) {
            onSelectionChange(newSelection);
          }
        }}
        sx={dataGridStyles}
      />
    </Box>
  );
};

export default TalentTable;
