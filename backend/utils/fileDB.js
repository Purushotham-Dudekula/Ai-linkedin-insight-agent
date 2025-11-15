import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'processedPosts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

/**
 * Read all processed posts from JSON file
 */
export function readPosts() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

/**
 * Write posts to JSON file
 */
export function writePosts(posts) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing posts:', error);
    return false;
  }
}

/**
 * Add a new processed post
 */
export function addPost(post) {
  const posts = readPosts();
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    ...post,
    timestamp: new Date().toISOString()
  };
  posts.unshift(newPost); // Add to beginning
  writePosts(posts);
  return newPost;
}

/**
 * Get last N posts
 */
export function getRecentPosts(limit = 10) {
  const posts = readPosts();
  return posts.slice(0, limit);
}

/**
 * Delete a post by ID
 */
export function deletePost(id) {
  const posts = readPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  writePosts(filteredPosts);
  return true;
}

/**
 * Delete all posts
 */
export function deleteAllPosts() {
  writePosts([]);
  return true;
}

