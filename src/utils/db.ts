// src/utils/db.ts
// import mongoose, { ConnectOptions } from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://nzemba48:KrjaECTCuSSwKdFS@cluster0.cxgzddn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       } as ConnectOptions
//     );
//     console.log("Database is connected");
//   } catch (error: any) {
//     console.log(error.message);
//   }
// };

// export default connectDB;
import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI =
  "mongodb+srv://saintshub:SaintsHub@App@cluster0.cxgzddn.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://capetowntabernacle:EmqmrTUTE9uA9geZ@cluster0.4doa5l1.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    console.log("Database is connected");
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDB;
