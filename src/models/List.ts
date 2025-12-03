import mongoose, { Schema, Document } from "mongoose";

export interface ICardItem {
    card: string;
    createdAt: Date;
}

export interface IList extends Document {
    title: string;
    cards: ICardItem[];
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

const CardItemSchema: Schema = new Schema(
    {
        card: {
            type: String,
            required: [true, "Card content is required"],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const ListSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        cards: {
            type: [CardItemSchema],
            default: [],
        },
        position: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const List = mongoose.model<IList>("List", ListSchema);

