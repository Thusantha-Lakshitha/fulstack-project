import {
  BookOpen,
  LogOut,
  PieChart,
  RefreshCw,
  Users,
  UserCheck,
  Book,
  Clipboard,
} from "react-feather";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const navigation = [
  { key: "overview", label: "Overview", icon: <PieChart size={18} /> },
  { key: "users", label: "Users", icon: <Users size={18} /> },
  { key: "teachers", label: "Teachers", icon: <UserCheck size={18} /> },
  { key: "courses", label: "Courses", icon: <Book size={18} /> },
  { key: "enrollments", label: "Enrollments", icon: <Clipboard size={18} /> },
];

function Sidebar({ open, activeSection, onSectionChange, onLogout, mobileOpen, onCloseMobile }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#081120", color: "#edf2f7" }}>
      <Box sx={{ px: 3, py: 3 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: "rgba(125, 211, 252, 0.16)", display: "grid", placeItems: "center" }}>
            <BookOpen size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              LMS Admin
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(237, 242, 247, 0.72)" }}>
              Secure control center
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.18)" }} />

      <List sx={{ px: 1.25, py: 1.5, flex: 1 }}>
        {navigation.map((item) => (
          <ListItemButton
            key={item.key}
            selected={activeSection === item.key}
            onClick={() => onSectionChange(item.key)}
            sx={{
              mb: 0.75,
              borderRadius: 2,
              color: "inherit",
              "&.Mui-selected": {
                bgcolor: "rgba(125, 211, 252, 0.12)",
                border: "1px solid rgba(125, 211, 252, 0.2)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => window.location.reload()}
          sx={{
            mb: 1.25,
            color: "#edf2f7",
            borderColor: "rgba(237, 242, 247, 0.2)",
            textTransform: "none",
          }}
        >
          Refresh
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogOut size={16} />}
          onClick={onLogout}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? 288 : 96,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? 288 : 96,
              boxSizing: "border-box",
              borderRight: "none",
              overflowX: "hidden",
              transition: "width 220ms ease",
            },
          }}
        >
          {content}
        </Drawer>
      ) : (
        <Drawer
          open={mobileOpen}
          onClose={onCloseMobile}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 288,
              boxSizing: "border-box",
              borderRight: "none",
            },
          }}
        >
          {content}
        </Drawer>
      )}
    </>
  );
}

export default Sidebar;