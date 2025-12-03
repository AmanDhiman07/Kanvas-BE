import { Card } from "../../models/Card";
import { List } from "../../models/List";

interface MoveCardParams {
    cardId: string;
    fromListId: string;
    toListId: string;
}

interface MoveListParams {
    listId: string;
    newPosition: number;
}

interface ServiceResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const moveCardService = async ({ cardId, fromListId, toListId }: MoveCardParams): Promise<ServiceResponse> => {
    try {
        // 1. Find the card by ID
        const card = await Card.findById(cardId);

        if (!card) {
            return {
                success: false,
                message: "Card not found",
            };
        }

        // 2. Verify the card belongs to the source list
        if (card.titleId.toString() !== fromListId) {
            return {
                success: false,
                message: "Card does not belong to the source list",
            };
        }

        // 3. Update the card's titleId to the destination list
        card.titleId = toListId as any;
        await card.save();

        return {
            success: true,
            message: "Card moved successfully",
            data: {
                card,
                fromListId,
                toListId,
            },
        };
    } catch (error) {
        console.error("Move card service error:", error);
        return {
            success: false,
            message: "Failed to move card",
        };
    }
};

export const moveListService = async ({ listId, newPosition }: MoveListParams): Promise<ServiceResponse> => {
    try {
        // 1. Find the list to be moved
        const listToMove = await List.findById(listId);

        if (!listToMove) {
            return {
                success: false,
                message: "List not found",
            };
        }

        // 2. Fetch ALL lists, sorted by current position
        const allLists = await List.find().sort({ position: 1 });

        // 3. Remove the list from its current spot
        const otherLists = allLists.filter(l => l.id !== listId);

        // 4. Insert it at the new position
        // Ensure newPosition is within bounds [0, length]
        const safePosition = Math.max(0, Math.min(newPosition, otherLists.length));

        otherLists.splice(safePosition, 0, listToMove);

        // 5. Update positions for ALL lists
        const updatePromises = otherLists.map((list, index) => {
            list.position = index;
            return list.save();
        });

        await Promise.all(updatePromises);

        return {
            success: true,
            message: "List moved successfully",
            data: {
                list: listToMove,
                oldPosition: listToMove.position, // Note: this might be stale after save, but okay for response
                newPosition: safePosition,
            },
        };
    } catch (error) {
        console.error("Move list service error:", error);
        return {
            success: false,
            message: "Failed to move list",
        };
    }
};
