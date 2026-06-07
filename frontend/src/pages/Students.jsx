import { Chip } from "@mui/material";
import AdminResourcePanel from "../components/AdminResourcePanel";

function Students({ onStatsRefresh }) {
  return (
    <AdminResourcePanel
      title="Users"
      resource="users"
      statsLabel="users"
      onStatsRefresh={onStatsRefresh}
      description="Manage learner and staff accounts, including role assignment, activation state, and profile details."
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
          key: "role",
          label: "Role",
          render: (row) => <Chip size="small" label={(row.role || "STUDENT").toUpperCase()} color={row.role === "ADMIN" ? "error" : row.role === "TEACHER" ? "primary" : "default"} />,
        },
        {
          key: "enabled",
          label: "Status",
          render: (row) => <Chip size="small" label={row.enabled === false ? "Disabled" : "Active"} color={row.enabled === false ? "default" : "success"} variant={row.enabled === false ? "outlined" : "filled"} />,
        },
      ]}
      fields={[
        { name: "name", label: "Full Name" },
        { name: "email", label: "Email Address", type: "email" },
        { name: "password", label: "Password", type: "password", helperText: "Leave blank when editing to keep the current password", required: false },
        { name: "phone", label: "Phone Number" },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { label: "Student", value: "STUDENT" },
            { label: "Teacher", value: "TEACHER" },
            { label: "Admin", value: "ADMIN" },
          ],
        },
        {
          name: "enabled",
          label: "Enabled",
          type: "select",
          valueType: "boolean",
          options: [
            { label: "Active", value: true },
            { label: "Disabled", value: false },
          ],
        },
      ]}
      defaultValues={{ role: "STUDENT", enabled: true }}
    />
  );
}

export default Students;