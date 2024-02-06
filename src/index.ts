// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/authRoutes";
import connectDB from "./utils/db";
import cloudinary from "cloudinary";
import bodyParser from "body-parser";
import path from "path";
import dashboardRouter from "./routes/authDashboard";

dotenv.config({ path: "server/.env" });

// Call the connectDB function to establish the database connection
connectDB();

// Setting up cloudinary configuration
cloudinary.v2.config({
  cloud_name: "ddbiofmni",
  api_key: "629285927862696",
  api_secret: "7i7owfVVo3t860usBWvJqTITMHY",
});

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Use body-parser middleware with increased limit
// app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Use cookie-parser middleware
app.use(cookieParser());

// Mount the routes under the '/api' prefix
app.use("/api", routes);
app.use('/api/dashboard', dashboardRouter);

 // @ts-ignore
// app.use("/api/upload", router_upload);


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
