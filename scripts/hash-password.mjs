import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

if (password.length < 12) {
  console.error("Use a password with at least 12 characters.");
  process.exit(1);
}
 
const hash = bcrypt.hashSync(password, 12);

// Next.js expands "$" in .env files, so every "$" must be escaped.
const escaped = hash.replaceAll("$", "\\$");

console.log("\nPaste this line into your env file:\n");
console.log(`ADMIN_PASSWORD_HASH=${escaped}\n`);