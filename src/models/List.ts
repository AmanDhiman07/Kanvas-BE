import mongoose, { Schema, Document } from "mongoose";

export interface IList extends Document {
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

const ListSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const List = mongoose.model<IList>("List", ListSchema);

