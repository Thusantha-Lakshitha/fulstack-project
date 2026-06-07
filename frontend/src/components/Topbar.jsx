import { Menu as MenuIcon, Shield, User } from "react-feather";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

function Topbar({ title, subtitle, onMenuClick }) {
  const username = localStorage.getItem("username") || "Administrator";
  const role = localStorage.getItem("role") || "ADMIN";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(8, 17, 32, 0.7)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
      }}
    >
      <Toolbar sx={{ minHeight: 84, px: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ color: "inherit", display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuIcon size={20} />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(226, 232, 240, 0.72)" }}>
              {subtitle}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.25} alignItems="center">
            <Chip
              icon={<Shield size={14} />}
              label={role}
              variant="outlined"
              sx={{ color: "#dbeafe", borderColor: "rgba(96, 165, 250, 0.3)" }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(56, 189, 248, 0.16)", color: "#e0f2fe" }}>
                <User size={18} />
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  {username}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(226, 232, 240, 0.68)" }}>
                  Admin account
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;