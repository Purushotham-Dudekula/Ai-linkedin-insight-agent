import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

/**
 * Read all users from JSON file
 */
export function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

/**
 * Write users to JSON file
 */
export function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

/**
 * Find user by email
 */
export function findUserByEmail(email) {
  const users = readUsers();
  return users.find(user => user.email === email);
}

/**
 * Find user by ID
 */
export function findUserById(id) {
  const users = readUsers();
  return users.find(user => user.id === id);
}

/**
 * Create a new user
 */
export async function createUser(email, password, name) {
  const users = readUsers();
  
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    email,
    password: hashedPassword,
    name,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  writeUsers(users);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Verify user password
 */
export async function verifyPassword(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

