import { List } from "../../models/List";

export interface CreateCardData {
    cards: string[];
    titleId: string;
}

export interface CardResult {
    success: boolean;
    message: string;
    data?: {
        cards: Array<{
            card: string;
            createdAt: Date;
        }>;
        titleId: string;
    };
}

export const createCard = async (data: CreateCardData): Promise<CardResult> => {
    try {
        const { cards, titleId } = data;

        // Verify that the title exists and add cards to the array
        const title = await List.findById(titleId);
        if (!title) {
            return {
                success: false,
                message: "Title not found",
            };
        }

        // Create array of new cards with timestamps
        const newCards = cards.map((cardContent) => ({
            card: cardContent.trim(),
            createdAt: new Date(),
        }));

        // Add all cards to the cards array
        title.cards.push(...newCards);
        await title.save();

        return {
            success: true,
            message: `${newCards.length} card(s) added successfully`,
            data: {
                cards: newCards,
                titleId: titleId,
            },
        };
    } catch (error) {
        console.error("Create card error:", error);
        return {
            success: false,
            message: "An error occurred while adding the cards",
        };
    }
};

export interface GetAllCardsResult {
    success: boolean;
    message: string;
    data?: {
        card: string;
        titleId: string;
        createdAt: Date;
    }[];
}

export const getCardsByTitleId = async (titleId: string): Promise<GetAllCardsResult> => {
    try {
        // Verify that the title exists
        const title = await List.findById(titleId);
        if (!title) {
            return {
                success: false,
                message: "Title not found",
            };
        }

        // Get all cards from the title's cards array, sorted by newest first
        const cards = title.cards.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return {
            success: true,
            message: "Cards retrieved successfully",
            data: cards.map((card) => ({
                card: card.card,
                titleId: titleId,
                createdAt: card.createdAt,
            })),
        };
    } catch (error) {
        console.error("Get cards by title ID error:", error);
        return {
            success: false,
            message: "An error occurred while retrieving cards",
        };
    }
};

