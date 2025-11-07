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

        // Create new list item with title
        const newList = new List({
            title: title.trim(),
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
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export const getAllTitles = async (): Promise<GetAllTitlesResult> => {
    try {
        // Get all titles from database, sorted by newest first
        const titles = await List.find().sort({ createdAt: -1 });

        return {
            success: true,
            message: "Titles retrieved successfully",
            data: titles.map((title) => ({
                id: title.id,
                title: title.title,
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

