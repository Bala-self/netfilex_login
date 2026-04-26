const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-app-name.vercel.app" 
  ]
}));app.use(express.json());

const MOCK_USERS = [
  { email: "user@netflix.com", password: "password123", username: "Netflix User" },
  { email: "admin@netflix.com", password: "admin123", username: "Admin" },
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "Incorrect email or password. Please try again." });
  }

  res.status(200).json({
    message: "Login successful",
    user: { email: user.email, username: user.username },
  });
});


app.post("/signup", (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  const existing = MOCK_USERS.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  MOCK_USERS.push({ username, email, password });
  console.log("New user registered:", { username, email });
  res.status(201).json({ message: "Account created successfully." });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log("\nMock Credentials:");
  MOCK_USERS.forEach((u) =>
    console.log(`   Email: ${u.email} | Password: ${u.password}`)
  );
});