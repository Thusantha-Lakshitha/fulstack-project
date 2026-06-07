import { useEffect, useMemo, useState } from "react";
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
  MenuItem,
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
} from "@mui/material";
import { Edit2, Plus, Search, Trash2 } from "react-feather";
import adminService from "../services/adminService";
import { publishDataUpdate } from "../services/liveUpdates";

const pageSize = 10;

function buildInitialForm(fields) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = field.defaultValue ?? "";
    return accumulator;
  }, {});
}

function toFormValue(value, field) {
  if (value === null || value === undefined) {
    return field.defaultValue ?? "";
  }

  if (field.type === "number") {
    return value;
  }

  if (field.valueType === "boolean") {
    return Boolean(value);
  }

  return value;
}

function normalizePayload(values, fields) {
  return fields.reduce((payload, field) => {
    const rawValue = values[field.name];

    if (field.type === "number") {
      payload[field.name] = rawValue === "" || rawValue === null ? null : Number(rawValue);
      return payload;
    }

    if (field.valueType === "boolean") {
      payload[field.name] = rawValue === true || rawValue === "true";
      return payload;
    }

    payload[field.name] = rawValue;
    return payload;
  }, {});
}

function AdminResourcePanel({
  title,
  resource,
  description,
  fields,
  columns,
  statsLabel,
  onStatsRefresh,
  defaultValues,
  renderRowActions,
}) {
  const initialForm = useMemo(
    () => ({ ...buildInitialForm(fields), ...defaultValues }),
    [defaultValues, fields]
  );

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRows(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const loadRows = async (nextPage = page, nextQuery = search) => {
    setLoading(true);
    setError("");

    try {
      const response = await adminService.fetchResource(resource, {
        query: nextQuery,
        page: nextPage - 1,
        size: pageSize,
      });

      const data = response.data || {};
      setRows(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setPage(data.number !== undefined ? data.number + 1 : nextPage);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || `Unable to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingRow(null);
    setFormData(initialForm);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    const nextForm = fields.reduce((accumulator, field) => {
      accumulator[field.name] = toFormValue(row[field.name], field);
      return accumulator;
    }, {});
    setFormData({ ...initialForm, ...nextForm });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = normalizePayload(formData, fields);

    try {
      if (editingRow) {
        await adminService.updateResource(resource, editingRow.id, payload);
      } else {
        await adminService.createResource(resource, payload);
      }

      closeDialog();
      await loadRows(page, search);
      if (onStatsRefresh) {
        await onStatsRefresh();
      }

      publishDataUpdate(resource);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || `Unable to save ${title.toLowerCase()}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${title.toLowerCase().slice(0, -1)}?`)) {
      return;
    }

    setError("");

    try {
      await adminService.deleteResource(resource, id);
      await loadRows(page, search);
      if (onStatsRefresh) {
        await onStatsRefresh();
      }

      publishDataUpdate(resource);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || `Unable to delete ${title.toLowerCase()}`);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await loadRows(1, search.trim());
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
          <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 720 }}>
                {description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={openCreate}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 2.25 }}
            >
              Add {title.slice(0, -1)}
            </Button>
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
                  placeholder={`Search ${title.toLowerCase()}`}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  InputProps={{ disableUnderline: true }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }} flexWrap="wrap">
                <Chip label={`${totalElements} ${statsLabel}`} sx={{ fontWeight: 700 }} />
                <Chip color="primary" variant="outlined" label={`Page ${page} of ${Math.max(totalPages, 1)}`} />
              </Stack>
            </Grid>
          </Grid>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.key} sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 700, borderBottomColor: "rgba(148, 163, 184, 0.24)" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                      Loading {title.toLowerCase()}...
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow key={row.id} hover>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render ? column.render(row) : row[column.key]}
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {renderRowActions ? renderRowActions(row) : null}
                          <IconButton color="primary" onClick={() => openEdit(row)}>
                            <Edit2 size={16} />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(row.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                      No {title.toLowerCase()} found.
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
              onChange={(_, nextPage) => loadRows(nextPage, search)}
            />
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingRow ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                  <TextField
                    fullWidth
                    select={field.type === "select"}
                    type={field.type === "textarea" ? "text" : field.type || "text"}
                    multiline={field.type === "textarea"}
                    rows={field.type === "textarea" ? field.rows || 4 : undefined}
                    name={field.name}
                    label={field.label}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    helperText={field.helperText || " "}
                    required={field.required !== false}
                  >
                    {field.options ? field.options.map((option) => (
                      <MenuItem key={String(option.value)} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )) : null}
                  </TextField>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={closeDialog} color="inherit" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: "none", fontWeight: 700 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default AdminResourcePanel;