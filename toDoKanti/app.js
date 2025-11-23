import express from "express";
import cors from "cors";
import taskRoutes from "./routers/taskRoutes.js";
import userRoutes from "./routers/userRoutes.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Server runs on : ${PORT}`);
});