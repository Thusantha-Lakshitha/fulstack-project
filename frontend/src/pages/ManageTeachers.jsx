import { Chip } from "@mui/material";
import AdminResourcePanel from "../components/AdminResourcePanel";

function ManageTeachers({ onStatsRefresh }) {
  return (
    <AdminResourcePanel
      title="Teachers"
      resource="teachers"
      statsLabel="teachers"
      onStatsRefresh={onStatsRefresh}
      description="Create and update teacher profiles, including subject expertise, experience, and visibility status."
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "specialization", label: "Specialization" },
        { key: "experienceYears", label: "Experience" },
        {
          key: "status",
          label: "Status",
          render: (row) => <Chip size="small" label={(row.status || "ACTIVE").toUpperCase()} color={row.status === "INACTIVE" ? "default" : "success"} />,
        },
      ]}
      fields={[
        { name: "name", label: "Teacher Name" },
        { name: "email", label: "Email Address", type: "email" },
        { name: "specialization", label: "Specialization" },
        { name: "bio", label: "Biography", type: "textarea", fullWidth: true, rows: 4, required: false },
        { name: "experienceYears", label: "Years of Experience", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
          ],
        },
      ]}
      defaultValues={{ status: "ACTIVE", experienceYears: 0 }}
    />
  );
}

export default ManageTeachers;