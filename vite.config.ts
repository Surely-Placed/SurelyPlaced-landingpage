import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import contactHandler from "./api/contact";

export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_) so the local dev middleware
  // can read your CONTACT_EMAIL_* values.
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

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
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
