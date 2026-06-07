import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Eye, CheckCircle, Trash2, Search, Mail } from "react-feather";
import contactMessagesService from "../services/contactMessagesService";
import { subscribeDataUpdates, publishDataUpdate } from "../services/liveUpdates";

const pageSize = 10;

function ContactMessages({ onStatsRefresh }) {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Detail Modal State
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = async (nextPage = page, nextQuery = search) => {
    setLoading(true);
    setError("");

    try {
      const response = await contactMessagesService.fetchMessages({
        query: nextQuery,
        page: nextPage - 1,
        size: pageSize,
      });

      const data = response.data || {};
      setMessages(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setPage(data.number !== undefined ? data.number + 1 : nextPage);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.error || requestError.message || "Unable to load support messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages(1, "");

    return subscribeDataUpdates(({ resource }) => {
      if (!resource || resource === "contact-messages") {
        loadMessages();
      }
    });
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    loadMessages(1, search.trim());
  };

  const handleViewDetails = async (msg) => {
    setSelectedMessage(msg);
    setDetailOpen(true);
    if (msg.status === "NEW") {
      try {
        await contactMessagesService.markAsRead(msg.id);
        // update local list status
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "READ" } : m))
        );
        publishDataUpdate("contact-messages");
        if (onStatsRefresh) onStatsRefresh();
      } catch (err) {
        console.error("Failed to automatically mark message as read", err);
      }
    }
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
    setSelectedMessage(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactMessagesService.markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "READ" } : m))
      );
      publishDataUpdate("contact-messages");
      if (onStatsRefresh) onStatsRefresh();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to mark message as read");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact message permanently?")) {
      return;
    }

    try {
      await contactMessagesService.deleteMessage(id);
      loadMessages(page, search);
      publishDataUpdate("contact-messages");
      if (onStatsRefresh) onStatsRefresh();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete message");
    }
  };

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          border: "1px solid rgba(148, 163, 184, 0.18)",
          bgcolor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Support Messages
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 720 }}>
                View and manage inquiries and support messages submitted by learners and visitors.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              <Paper
                component="form"
                onSubmit={handleSearchSubmit}
                elevation={0}
                sx={{
                  px: 2,
                  py: 1.15,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                  border: "1px solid rgba(148, 163, 184, 0.24)",
                  bgcolor: "rgba(248, 250, 252, 0.9)",
                }}
              >
                <Search size={16} />
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Search messages by name or email..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  InputProps={{ disableUnderline: true }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }} flexWrap="wrap">
                <Chip label={`${totalElements} messages`} sx={{ fontWeight: 700 }} />
                <Chip color="primary" variant="outlined" label={`Page ${page} of ${Math.max(totalPages, 1)}`} />
              </Stack>
            </Grid>
          </Grid>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={24} sx={{ mr: 1 }} /> Loading messages...
                    </TableCell>
                  </TableRow>
                ) : messages.length > 0 ? (
                  messages.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.status || "NEW"}
                          color={row.status === "NEW" ? "primary" : "default"}
                          variant={row.status === "NEW" ? "filled" : "outlined"}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Message Details">
                            <IconButton color="info" size="small" onClick={() => handleViewDetails(row)}>
                              <Eye size={16} />
                            </IconButton>
                          </Tooltip>
                          {row.status === "NEW" && (
                            <Tooltip title="Mark as Read">
                              <IconButton color="success" size="small" onClick={() => handleMarkAsRead(row.id)}>
                                <CheckCircle size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Message">
                            <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      No support messages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" justifyContent="flex-end">
            <Pagination
              color="primary"
              page={page}
              count={Math.max(totalPages, 1)}
              onChange={(_, nextPage) => loadMessages(nextPage, search)}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Message Details Dialog */}
      <Dialog open={detailOpen} onClose={handleCloseDetails} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 1 }}>
          <Mail size={20} /> Visitor Inquiry
        </DialogTitle>
        <DialogContent dividers>
          {selectedMessage && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  FROM
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  DATE SENT
                </Typography>
                <Typography variant="body2">
                  {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : "-"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  SUBJECT
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main" }}>
                  {selectedMessage.subject}
                </Typography>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  MESSAGE CONTENT
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mt: 0.5,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedMessage.message}
                </Paper>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDetails} variant="contained" sx={{ textTransform: "none", fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default ContactMessages;
