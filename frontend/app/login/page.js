"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button } from "@mui/material";
import api from "../../lib/api";
import { setToken } from "../../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function login() {
    try {
      const res = await api.post("/login", { email, password: pwd });
      setToken(res.data.response);
      router.push("/notes");
    } catch (e) {
      setErr(e.response?.data?.response || "Login failed");
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Login
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
      {err && (
        <Typography color="error" sx={{ mt: 1 }}>
          {err}
        </Typography>
      )}
      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={login}>
        Login
      </Button>
      <Button fullWidth sx={{ mt: 1 }} onClick={() => router.push("/register")}>
        Go to Register
      </Button>
    </Container>
  );
}
