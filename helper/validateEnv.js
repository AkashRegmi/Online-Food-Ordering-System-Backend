import env from "dotenv";
env.config();
const requiredEnv = ["PORT", "MONGO_URL", "NODE_ENV"];
export const validateEnv = () => {
  const missingEnv = [];
  requiredEnv.forEach((value) => {
    if (!process.env[value]) {
      missingEnv.push(value);
    }
  });
  if (missingEnv.length > 0) {
    console.log("\n Missing required environment variables:");
    missingEnv.forEach((key) => {
      console.error(`   - ${key}`);
    });
    console.error("\n Please check your .env file and restart the server.\n");

    process.exit(1);
  }
};
