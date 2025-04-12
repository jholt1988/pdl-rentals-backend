import { seedDatabase } from "../util/testUtils.js";
import { sequelize } from "../models/index.js";

async () => {
    try {
        // await db.sequelize.sync({ force: true });
        await seedDatabase();
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    
    }

}