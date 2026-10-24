import { Hono } from "hono";
import { auth } from "./middleware/auth";
import studentRoutes from "./routes/students";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono();

app.use(prettyJSON({ space: 4, force: true }));

app.get("/", (c) => {
    return c.json({ message: "Student API is running" })
});

app.use("/api/*", auth);
app.route("/api/v1/students", studentRoutes);

app.notFound((c) => {
    return c.json({ error: "Not found" }, 404)
});

app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
});

export default app;
