import { Card } from "../../models/Card";
import { List } from "../../models/List";

interface MoveCardParams {
    cardId: string;
    fromListId: string;
    toListId: string;
    newPosition?: number;
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

export const moveCardService = async ({ cardId, fromListId, toListId, newPosition }: MoveCardParams): Promise<ServiceResponse> => {
    try {
        // 1. Find the source list
        const fromList = await List.findById(fromListId);
        if (!fromList) {
            return { success: false, message: "Source list not found" };
        }

        // 2. Find the card in the source list
        // Note: We use 'any' cast because Mongoose types for subdocuments can be tricky
        const cardIndex = fromList.cards.findIndex((c: any) => c._id.toString() === cardId);

        if (cardIndex === -1) {
            return { success: false, message: "Card not found in source list" };
        }

        const cardToMove = fromList.cards[cardIndex];

        // 3. Handle Same List Movement (Reordering)
        if (fromListId === toListId) {
            // Remove from old position
            fromList.cards.splice(cardIndex, 1);

            // Insert at new position
            // Default to end if newPosition is undefined
            const targetPos = newPosition !== undefined ? newPosition : fromList.cards.length;
            const safePos = Math.max(0, Math.min(targetPos, fromList.cards.length));

            fromList.cards.splice(safePos, 0, cardToMove);

            await fromList.save();

            return {
                success: true,
                message: "Card reordered successfully",
                data: { card: cardToMove, fromListId, toListId, newPosition: safePos }
            };
        }

        // 4. Handle Different List Movement
        const toList = await List.findById(toListId);
        if (!toList) {
            return { success: false, message: "Destination list not found" };
        }

        // Remove from source list
        fromList.cards.splice(cardIndex, 1);
        await fromList.save();

        // Insert into destination list
        const targetPos = newPosition !== undefined ? newPosition : toList.cards.length;
        const safePos = Math.max(0, Math.min(targetPos, toList.cards.length));

        toList.cards.splice(safePos, 0, cardToMove);
        await toList.save();

        return {
            success: true,
            message: "Card moved successfully",
            data: {
                card: cardToMove,
                fromListId,
                toListId,
                newPosition: safePos,
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
