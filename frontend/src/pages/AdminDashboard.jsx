import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Book, Users, UserCheck, Clipboard } from "react-feather";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import adminService from "../services/adminService";
import Students from "./Students";
import ManageTeachers from "./ManageTeachers";
import ManageCourses from "./ManageCourses";
import Payments from "./Payments";
import ContactMessages from "./ContactMessages";
import { clearAuthSession } from "../services/userService";
import { useNavigate } from "react-router-dom";

const dashboardTabs = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "teachers", label: "Teachers" },
  { key: "courses", label: "Courses" },
  { key: "enrollments", label: "Enrollments" },
  { key: "support-messages", label: "Support Messages" },
];

const metricCards = [
  { key: "users", label: "Users", icon: <Users size={18} /> },
  { key: "teachers", label: "Teachers", icon: <UserCheck size={18} /> },
  { key: "courses", label: "Courses", icon: <Book size={18} /> },
  { key: "enrollments", label: "Enrollments", icon: <Clipboard size={18} /> },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState({ users: 0, teachers: 0, courses: 0, enrollments: 0 });
  const [dbStatus, setDbStatus] = useState({ connected: false, database: "Education", message: "Checking connection..." });

  const loadStats = useCallback(async () => {
    try {
      const response = await adminService.fetchStats();
      setStats(response.data || { users: 0, teachers: 0, courses: 0, enrollments: 0 });
    } catch (error) {
      console.error("Unable to load dashboard stats", error);
    }
  }, []);

  const loadDbStatus = useCallback(async () => {
    try {
      const response = await adminService.fetchDbStatus();
      setDbStatus(response.data || { connected: false, database: "Education", message: "No response" });
    } catch (error) {
      console.error("Unable to load database status", error);
      setDbStatus({ connected: false, database: "Education", message: "Database connection failed" });
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadDbStatus();
  }, [loadStats, loadDbStatus]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const renderSection = () => {
    if (activeSection === "users") {
      return <Students onStatsRefresh={loadStats} />;
    }

    if (activeSection === "teachers") {
      return <ManageTeachers onStatsRefresh={loadStats} />;
    }

    if (activeSection === "courses") {
      return <ManageCourses onStatsRefresh={loadStats} />;
    }

    if (activeSection === "enrollments") {
      return <Payments onStatsRefresh={loadStats} />;
    }

    if (activeSection === "support-messages") {
      return <ContactMessages onStatsRefresh={loadStats} />;
    }

    return (
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid rgba(148, 163, 184, 0.18)",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.96))",
            color: "#f8fafc",
          }}
        >
          <Stack spacing={2} sx={{ maxWidth: 760 }}>
            <Typography variant="overline" sx={{ letterSpacing: 2, color: "rgba(226, 232, 240, 0.68)" }}>
              Admin Workspace
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
              Manage every part of the LMS from one secure control panel.
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(226, 232, 240, 0.8)", maxWidth: 640 }}>
              Monitor users, teachers, courses, and enrollments with authenticated REST APIs, search, pagination, and role-based access.
            </Typography>

            <Box
              sx={{
                mt: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                alignSelf: "flex-start",
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: dbStatus.connected ? "rgba(16, 185, 129, 0.16)" : "rgba(239, 68, 68, 0.16)",
                color: dbStatus.connected ? "#d1fae5" : "#fee2e2",
                border: `1px solid ${dbStatus.connected ? "rgba(52, 211, 153, 0.35)" : "rgba(248, 113, 113, 0.35)"}`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {dbStatus.connected ? "Connected" : "Disconnected"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {dbStatus.database}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {dbStatus.message}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={2.5}>
          {metricCards.map((card) => (
            <Grid item xs={12} sm={6} lg={3} key={card.key}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.75 }}>
                        {stats[card.key] ?? 0}
                      </Typography>
                    </Box>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "rgba(59, 130, 246, 0.12)", color: "primary.main" }}>
                      {card.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(148, 163, 184, 0.18)" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Payment Status Overview</Typography>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Completed Payments</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "success.main" }}>{stats.completedPayments || 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Pending Payments</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "warning.main" }}>{stats.pendingPayments || 0}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(148, 163, 184, 0.18)" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Enrollments by Method</Typography>
                <Stack spacing={1}>
                  {stats.enrollmentsByPaymentMethod && Object.keys(stats.enrollmentsByPaymentMethod).length > 0 ? (
                    Object.entries(stats.enrollmentsByPaymentMethod).map(([method, count]) => (
                      <Box key={method} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{method}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{count}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No payment data yet.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 30%), radial-gradient(circle at right top, rgba(14, 165, 233, 0.12), transparent 24%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <Sidebar
        open={true}
        mobileOpen={mobileOpen}
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setMobileOpen(false);
        }}
        onLogout={handleLogout}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Topbar
          title="Administrator Dashboard"
          subtitle="Secure overview and management tools"
          onMenuClick={() => setMobileOpen(true)}
        />

        <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 4,
              border: "1px solid rgba(148, 163, 184, 0.18)",
              bgcolor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Tabs
              value={activeSection}
              onChange={(_, value) => setActiveSection(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              {dashboardTabs.map((tab) => (
                <Tab key={tab.key} value={tab.key} label={tab.label} sx={{ textTransform: "none", fontWeight: 700 }} />
              ))}
            </Tabs>
          </Paper>

          {renderSection()}
        </Container>
      </Box>
    </Box>
  );
}

export default AdminDashboard;