// api_routes.js - Complete API Routes for Recipe & Buy Links

import express from 'express';
import geminiResponse from './gemini.js';   // ⚠️ Adjust path to your gemini.js file
import blinkitResponse from './blinkit.js'; // ⚠️ Adjust path to your blinkit.js file

const router = express.Router();

// ========================================
// 📚 GEMINI RECIPE/INFO ROUTE
// ========================================
router.post('/gemini/recipe', async (req, res) => {
  try {
    const { category, productName } = req.body;
    
    // Validation
    if (!category || !productName) {
      console.log('❌ Missing parameters:', { category, productName });
      return res.status(400).json({ 
        success: false, 
        message: 'Category and productName are required' 
      });
    }

    console.log('📚 Fetching recipe/info for:', productName, `(${category})`);
    
    // Call Gemini AI function
    const content = await geminiResponse(category, productName);
    
    console.log('✅ Content generated successfully');
    
    res.json({ 
      success: true, 
      content: content 
    });
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate content',
      error: error.message 
    });
  }
});

// ========================================
// 🛒 BLINKIT SHOPPING LINKS ROUTE
// ========================================
router.post('/blinkit/links', async (req, res) => {
  try {
    const { category, productName } = req.body;
    
    // Validation
    if (!category || !productName) {
      console.log('❌ Missing parameters:', { category, productName });
      return res.status(400).json({ 
        success: false, 
        message: 'Category and productName are required' 
      });
    }

    console.log('🛒 Fetching shopping links for:', productName, `(${category})`);
    
    // Call Blinkit function
    const links = await blinkitResponse(category, productName);
    
    console.log('✅ Links generated successfully');
    console.log('Links:', links);
    
    res.json({ 
      success: true, 
      links: links 
    });
    
  } catch (error) {
    console.error('❌ Blinkit API Error:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate shopping links',
      error: error.message 
    });
  }
});

// ========================================
// 🧪 TEST ROUTE (Optional - for debugging)
// ========================================
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API routes are working!',
    routes: [
      'POST /api/gemini/recipe',
      'POST /api/blinkit/links'
    ]
  });
});

export default router;
