import { List } from "../models/List";
import { connectDB } from "../db/db";
import dotenv from "dotenv";

dotenv.config();

/**
 * Migration script to add position field to existing lists
 * This should be run once after adding the position field
 */
const migrateListPositions = async () => {
    try {
        await connectDB();
        console.log("Connected to database");

        // Find ALL lists, sorted by current position (or creation time if pos is same)
        const allLists = await List.find({}).sort({ position: 1, createdAt: 1 });

        console.log(`Found ${allLists.length} lists. Re-normalizing positions...`);

        // Update each list with incremental positions
        for (let i = 0; i < allLists.length; i++) {
            const list = allLists[i];
            list.position = i;
            await list.save();
            console.log(`Updated list "${list.title}" to position ${i}`);
        }

        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrateListPositions();
