import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
    card: string;
    titleId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CardSchema: Schema = new Schema(
    {
        card: {
            type: String,
            required: [true, "Card content is required"],
            trim: true,
        },
        titleId: {
            type: Schema.Types.ObjectId,
            ref: "List",
            required: [true, "Title ID is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const Card = mongoose.model<ICard>("Card", CardSchema);


