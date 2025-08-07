"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button } from "@mui/material";
import api from "../../lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function register() {
    try {
      const res = await api.post("/register", { email, password: pwd });
      setMsg(res.data.response);
      router.push("/login");
    } catch (e) {
      setMsg(e.response?.data?.response || "Registration failed");
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <TextField
        fullWidth
        label="Email"
        sx={{ mt: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        sx={{ mt: 2 }}
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      {msg && (
        <Typography color="primary" sx={{ mt: 1 }}>
          {msg}
        </Typography>
      )}
      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={register}>
        Register
      </Button>
      <Button fullWidth sx={{ mt: 1 }} onClick={() => router.push("/login")}>
        Go to Login
      </Button>
    </Container>
  );
}
