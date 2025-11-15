import express from 'express';
import { processLinkedInPost } from '../services/julesService.js';
import { addPost, getRecentPosts, deletePost, deleteAllPosts } from '../utils/fileDB.js';
import { isURL, extractLinkedInContent } from '../services/urlExtractor.js';

const router = express.Router();

/**
 * POST /api/process
 * Process a LinkedIn post and generate insights
 * Accepts both text and LinkedIn post URLs
 */
router.post('/process', async (req, res) => {
  try {
    const { postText, postUrl } = req.body;
    let contentToProcess = postText || postUrl;

    if (!contentToProcess || typeof contentToProcess !== 'string' || contentToProcess.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'postText or postUrl is required and must be a non-empty string'
      });
    }

    contentToProcess = contentToProcess.trim();

    // Check if input is a URL
    if (isURL(contentToProcess)) {
      try {
        // Extract content from LinkedIn URL
        contentToProcess = await extractLinkedInContent(contentToProcess);
      } catch (urlError) {
        return res.status(400).json({
          error: 'URL extraction failed',
          message: urlError.message || 'Failed to extract content from the LinkedIn URL'
        });
      }
    }

    // Process the post using Jules API
    const insights = await processLinkedInPost(contentToProcess);

    // Save to local JSON file
    const savedPost = addPost({
      originalPost: contentToProcess,
      originalUrl: isURL(postText || postUrl) ? (postText || postUrl) : null,
      ...insights
    });

    res.json({
      success: true,
      data: {
        id: savedPost.id,
        ...insights
      }
    });
  } catch (error) {
    console.error('Error in /api/process:', error);
    res.status(500).json({
      error: 'Processing failed',
      message: error.message || 'An error occurred while processing the post'
    });
  }
});

/**
 * GET /api/history
 * Get recent processed posts
 */
router.get('/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const posts = getRecentPosts(limit);

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error in /api/history:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message || 'An error occurred while fetching history'
    });
  }
});

/**
 * DELETE /api/history/:id
 * Delete a specific post from history
 */
router.delete('/history/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Post ID must be a valid number'
      });
    }

    deletePost(id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error in /api/history/:id DELETE:', error);
    res.status(500).json({
      error: 'Failed to delete post',
      message: error.message || 'An error occurred while deleting the post'
    });
  }
});

/**
 * DELETE /api/history
 * Delete all posts from history
 */
router.delete('/history', (req, res) => {
  try {
    deleteAllPosts();

    res.json({
      success: true,
      message: 'All history deleted successfully'
    });
  } catch (error) {
    console.error('Error in /api/history DELETE:', error);
    res.status(500).json({
      error: 'Failed to delete history',
      message: error.message || 'An error occurred while deleting history'
    });
  }
});

export default router;

