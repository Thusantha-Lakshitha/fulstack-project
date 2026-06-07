import { Chip } from "@mui/material";
import AdminResourcePanel from "../components/AdminResourcePanel";

function Payments({ onStatsRefresh }) {
  return (
    <AdminResourcePanel
      title="Enrollments"
      resource="enrollments"
      statsLabel="enrollments"
      onStatsRefresh={onStatsRefresh}
      description="Track registrations for every course, including the linked learner, instructor, and enrollment state."
      columns={[
        { key: "studentName", label: "Student" },
        { key: "courseTitle", label: "Course" },
        { key: "teacherName", label: "Teacher" },
        {
          key: "status",
          label: "Status",
          render: (row) => <Chip size="small" label={(row.status || "ENROLLED").toUpperCase()} color={row.status === "CANCELLED" ? "default" : "success"} />,
        },
      ]}
      fields={[
        { name: "studentId", label: "Student ID", required: false },
        { name: "studentName", label: "Student Name" },
        { name: "studentEmail", label: "Student Email", type: "email" },
        { name: "courseId", label: "Course ID", required: false },
        { name: "courseTitle", label: "Course Title" },
        { name: "teacherName", label: "Teacher Name" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Enrolled", value: "ENROLLED" },
            { label: "Pending", value: "PENDING" },
            { label: "Cancelled", value: "CANCELLED" },
            { label: "Completed", value: "COMPLETED" },
          ],
        },
      ]}
      defaultValues={{ status: "ENROLLED" }}
    />
  );
}

export default Payments;