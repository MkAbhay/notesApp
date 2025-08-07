"use client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Modal,
  TextField,
  Chip,
  Stack,
} from "@mui/material";
import api from "../../lib/api";
import { getToken, clearToken } from "../../lib/auth";
import { parseJwt } from "../../lib/jwt";
import { useDebounce } from "use-debounce";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("new");
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });

  const [searchQuery, setSearchQuery] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 400);

  const router = useRouter();
  const token = getToken();
  const user = token ? parseJwt(token) : null;

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNoteUpdated = (data) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === data.id ? { ...note, ...data } : note
        )
      );
    };

    socket.on("note:updated", handleNoteUpdated);

    return () => {
      socket.off("note:updated", handleNoteUpdated);
    };
  }, [socket]);

  const fetchNotes = async (tags) => {
    try {
      console.log({ tags });
      const queryParams = new URLSearchParams();
      if (tags.length) queryParams.append("tags", tags.join(","));

      const res = await api.get(
        `/notes?user_id=${user.id}&${queryParams.toString()}`
      );
      const allNotes = res.data.response.data || [];
      setNotes(allNotes);

      allNotes.forEach((note) => {
        socket?.emit("note:join", note.id);
      });
    } catch (err) {
      setError(`Failed to load notes | ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      if (!searchQuery.includes(inputValue.trim())) {
        setSearchQuery([...searchQuery, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleDelete = (tagToDelete) => {
    setSearchQuery((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  useEffect(() => {
    fetchNotes(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (modalMode !== "edit" || !editingNote) return;

    const timeout = setTimeout(async () => {
      try {
        const updatedNote = {
          id: editingNote.id,
          title: form.title,
          content: form.content,
          tags: parseTags(form.tags),
          user_id: editingNote.user_id,
        };

        await api.post("/notes", updatedNote);
        socket?.emit("note:update", {
          noteId: editingNote.id,
          data: updatedNote,
        });

        setNotes((prev) =>
          prev.map((n) =>
            n.id === editingNote.id ? { ...n, ...updatedNote } : n
          )
        );
      } catch (err) {
        console.error("Auto-update failed", err);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [form.title, form.content, form.tags]);

  const handleOpenNew = () => {
    setModalMode("new");
    setEditingNote(null);
    setForm({ title: "", content: "", tags: "" });
    setOpen(true);
  };

  const handleOpenEdit = (note) => {
    setModalMode("edit");
    setEditingNote(note);
    setForm({
      title: note.title,
      content: note.content,
      tags: note.tags?.join(", ") || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingNote(null);
    setForm({ title: "", content: "", tags: "" });
  };

  const parseTags = (input) =>
    input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

  const handleSave = async () => {
    const payload = {
      title: form.title,
      content: form.content,
      tags: parseTags(form.tags),
      user_id: user.id,
    };

    try {
      if (modalMode === "new") {
        await api.post("/notes", payload);
      }

      const res = await api.get(`/notes?user_id=${user.id}`);
      const allNotes = res.data.response.data || [];
      setNotes(allNotes);

      allNotes.forEach((note) => {
        socket?.emit("note:join", note.id);
      });

      handleClose();
    } catch (err) {
      alert("Failed to save note.");
    }
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter((n) => n.id !== id));
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;
  if (error)
    return <Typography sx={{ mt: 4, color: "red" }}>{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Your Notes</Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          {searchQuery.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              onDelete={() => handleDelete(tag)}
              sx={{ margin: "2px" }}
            />
          ))}

          <TextField
            variant="standard"
            placeholder="Add tag..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ minWidth: 120, flexGrow: 1 }}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Box>
        <Box>
          <Button variant="contained" onClick={handleOpenNew}>
            + New Note
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={() => {
              clearToken();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {notes.length === 0 ? (
        <Typography>No notes found.</Typography>
      ) : (
        notes.map((note) => (
          <Card key={note.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6">{note.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {note.content}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 1, flexWrap: "wrap" }}
              >
                {(note.tags || []).map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Stack>
              <Button size="small" onClick={() => handleOpenEdit(note)}>
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography variant="h6" mb={2}>
            {modalMode === "edit" ? "Edit Note" : "New Note"}
          </Typography>
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            minRows={3}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tags (comma-separated)"
            fullWidth
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            sx={{ mb: 2 }}
          />
          {modalMode === "new" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Create
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
