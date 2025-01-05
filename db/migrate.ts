import {db} from "./index";
import {migrate} from "drizzle-orm/neon-http/migrator";

(async () => {
  try {
    await migrate(db, {
      migrationsFolder: "db/migrations",
    });
    console.log("Migration completed");
  } catch (error) {
    console.error("Error during migration: ", error);
    process.exit(1);
  }
})();
