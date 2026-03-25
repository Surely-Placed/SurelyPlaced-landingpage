import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react-swc";
import contactHandler from "./api/contact";

/** Project root (directory containing this config), not `process.cwd()` — fixes missing env when the shell cwd differs. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Load `.env` as soon as this file runs so `/api/contact` always sees GOOGLE_* / FORM_* in dev.
dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local"), override: true });

export default defineConfig(({ mode }) => {
  // Vite client exposure uses VITE_; server middleware also needs webhook vars.
  Object.assign(
    process.env,
    loadEnv(mode, projectRoot, "VITE_"),
    loadEnv(mode, projectRoot, "GOOGLE_"),
    loadEnv(mode, projectRoot, "FORM_"),
  );

  return {
    plugins: [
      react(),
      // Local dev middleware so /api/contact works under `npm run dev`.
      // On Vercel, the serverless function at /api/contact handles this route.
      {
        name: "local-api-contact",
        configureServer(server) {
          server.middlewares.use("/api/contact", async (req, res, next) => {
            try {
              // Only handle POST; let other methods fall through.
              if (req.method !== "POST") return next();

              let raw = "";
              req.on("data", (chunk) => {
                raw += chunk;
              });
              req.on("end", async () => {
                try {
                  (req as any).body = raw ? JSON.parse(raw) : {};
                } catch {
                  (req as any).body = {};
                }

                // Minimal VercelResponse-like helpers
                (res as any).status = (code: number) => {
                  res.statusCode = code;
                  return res;
                };
                (res as any).json = (obj: unknown) => {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(obj));
                };

                await (contactHandler as any)(req, res);
              });
            } catch (e) {
              return next(e as any);
            }
          });
        },
      },
    ],
    css: {
      devSourcemap: true,
    },
    server: {
      port: 5174,
    },
    resolve: {
      alias: {
        "@": path.resolve(projectRoot, "src"),
      },
    },
  };
});
