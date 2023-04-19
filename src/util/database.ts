import * as mongoose from "mongoose";

export const connectDB = () => mongoose.connect(process.env.MONGO_DB!);

export const Schema = mongoose.Schema;

export const Model = mongoose.model;
