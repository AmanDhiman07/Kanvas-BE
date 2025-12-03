import { List, IList } from "../../models/List";

export interface CreateTitleData {
    title: string;
}

export interface TitleResult {
    success: boolean;
    message: string;
    data?: {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

export const createTitle = async (data: CreateTitleData): Promise<TitleResult> => {
    try {
        const { title } = data;

        // Get the highest position and increment
        const maxPositionList = await List.findOne().sort({ position: -1 }).limit(1);
        const nextPosition = maxPositionList ? (maxPositionList.position || 0) + 1 : 0;

        // Create new list item with title and position
        const newList = new List({
            title: title.trim(),
            position: nextPosition,
        });

        const savedList = await newList.save();

        return {
            success: true,
            message: "Title saved successfully",
            data: {
                id: savedList.id,
                title: savedList.title,
                createdAt: savedList.createdAt,
                updatedAt: savedList.updatedAt,
            },
        };
    } catch (error) {
        console.error("Create title error:", error);
        return {
            success: false,
            message: "An error occurred while saving the title",
        };
    }
};

export interface GetAllTitlesResult {
    success: boolean;
    message: string;
    data?: {
        id: string;
        title: string;
        position: number;
        cards: {
            card: string;
            createdAt: Date;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export const getAllTitles = async (): Promise<GetAllTitlesResult> => {
    try {
        // Get all titles from database, sorted by position
        const titles = await List.find().sort({ position: 1 });

        return {
            success: true,
            message: "Titles retrieved successfully",
            data: titles.map((title) => ({
                id: title.id,
                title: title.title,
                position: title.position || 0,
                cards: title.cards || [],
                createdAt: title.createdAt,
                updatedAt: title.updatedAt,
            })),
        };
    } catch (error) {
        console.error("Get all titles error:", error);
        return {
            success: false,
            message: "An error occurred while retrieving titles",
        };
    }
};

