import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { initDatabase, getDb } from "./src/lib/db.ts";
import { hashPassword, comparePassword, generateToken, verifyToken } from "./src/lib/auth.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for development, re-enable for production
  }));
  app.use(cors());
  app.use(express.json());

  // Database initialization
  try {
    await initDatabase();
  } catch (error) {
    console.warn("Database initialization failed. Ensure MySQL is running and credentials are correct in .env.");
    console.error(error);
  }

  // --- API ROUTES ---

  // Auth Middleware
  const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) return res.status(401).json({ error: 'Access denied: No token provided' });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(403).json({ error: 'Invalid or expired token' });

      // Verify user exists to prevent orphaned sessions/FK errors
      const [rows]: any = await getDb().execute("SELECT id, name, email FROM users WHERE id = ?", [(decoded as any).id]);
      
      if (rows.length === 0) {
        return res.status(401).json({ error: "User session invalid. Please log in again." });
      }

      (req as any).user = { ...decoded, ...rows[0] };
      next();
    } catch (err: any) {
      console.error("Auth middleware error:", err);
      res.status(500).json({ error: "Authentication service error" });
    }
  };

  // 0. Auth: Me (Verify session)
  app.get("/api/auth/me", authenticateToken, (req: any, res: Response) => {
    res.json({ user: req.user });
  });

  // 1. Auth: Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const db = getDb();
      
      // Check if user already exists
      const [existing]: any = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: "Email already registered. Please sign in instead." });
      }

      const hashedPassword = await hashPassword(password);
      
      const [result]: any = await db.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      const token = generateToken({ id: result.insertId, email, name });
      return res.json({ token, user: { id: result.insertId, name, email } });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ error: `Server error during registration: ${error.message || 'Unknown error'}` });
    }
  });

  // 2. Auth: Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const db = getDb();
      
      let [rows]: any = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
      let user = rows[0];

      // If user exists, check password
      if (user) {
        if (await comparePassword(password, user.password)) {
          const token = generateToken({ id: user.id, email: user.email, name: user.name });
          return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }

      // DEMO MODE: If user doesn't exist, create them automatically so trips can be saved
      console.log(`Demo Mode: Creating user ${email} on the fly`);
      const hashedPassword = await hashPassword(password || 'demo_pass');
      const [result]: any = await db.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [email.split('@')[0], email, hashedPassword]
      );
      
      const newUserId = result.insertId;
      const token = generateToken({ id: newUserId, email, name: email.split('@')[0] });
      res.json({ token, user: { id: newUserId, name: email.split('@')[0], email } });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: `Server error during login: ${error.message || 'Unknown error'}` });
    }
  });

  // New Health Check Route
  app.get("/api/health", async (req: Request, res: Response) => {
    try {
      const db = getDb();
      await db.execute("SELECT 1");
      res.json({ status: "ok", database: "connected" });
    } catch (error: any) {
      res.status(500).json({ status: "error", database: "disconnected", message: error.message });
    }
  });

  // 3. Trips: Get all for current user
  app.get("/api/trips", authenticateToken, async (req: any, res: Response) => {
    try {
      const db = getDb();
      const [rows] = await db.execute("SELECT * FROM trips WHERE user_id = ?", [req.user.id]);
      res.json(rows);
    } catch (error: any) {
      console.error("Trips fetch error:", error);
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  // 4. Trips: Create trip
  app.post("/api/trips", authenticateToken, async (req: any, res: Response) => {
    try {
      const { name, description, start_date, end_date, emoji, budget } = req.body;
      console.log(`Creating trip for user ${req.user.id}: ${name}`);
      const db = getDb();
      
      const [result]: any = await db.execute(
        "INSERT INTO trips (user_id, name, description, start_date, end_date, emoji, budget) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [req.user.id, name, description, start_date, end_date, emoji, budget]
      );
      console.log(`Trip created with ID: ${result.insertId}`);
      res.json({ id: result.insertId, ...req.body });
    } catch (error: any) {
      console.error("Trip creation error:", error);
      res.status(500).json({ error: `Failed to create trip: ${error.message}` });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
