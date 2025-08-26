# PopcornPicks - TMDB API Setup Guide

## Getting Started with TMDB API

To use the movie functionality in PopcornPicks, you need to set up a TMDB (The Movie Database) API key.

### Step 1: Get Your TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account or sign in if you already have one
3. Go to your account settings by clicking your profile icon
4. Navigate to "API" section in the left sidebar
5. Click "Create" to request an API key
6. Choose "Developer" option
7. Fill out the required information:
   - Application Name: PopcornPicks (or any name you prefer)
   - Application URL: http://localhost:8081 (for development)
   - Application Summary: Personal movie discovery app
8. Accept the terms and conditions
9. Copy your API key (v3 auth)

### Step 2: Configure Your Environment

1. Open the `.env.local` file in the root directory of your project
2. Replace `your_tmdb_api_key_here` with your actual API key:
   ```
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```
3. Save the file

### Step 3: Restart the Development Server

After adding your API key, restart the development server:

```bash
npm run dev
```

## What's Fixed

✅ **TMDB API Integration**: Complete integration with The Movie Database API
✅ **Movie Listing**: Trending movies displayed on homepage with real data
✅ **Movie Details**: Click on any movie to see detailed information including:
   - High-quality posters and backdrops
   - Movie overview, ratings, and release dates
   - Cast information with photos
   - Genre tags
   - Runtime, budget, and revenue information
   - Movie trailers (when available)

✅ **Error Handling**: Proper error messages and loading states
✅ **Image Fallbacks**: Placeholder images for missing posters
✅ **Responsive Design**: Works on all screen sizes

## Features Working

- **Browse Movies**: See trending movies on the homepage
- **Movie Details**: Click on any movie card to view full details
- **Search Functionality**: Search for movies by title
- **Genre Display**: See movie genres with proper names
- **Ratings**: View TMDB ratings and vote counts
- **Cast Information**: See cast members with their photos and character names
- **Movie Trailers**: Watch trailers when available
- **Responsive Images**: Optimized image loading with proper fallbacks

## Testing Instructions

1. Make sure your API key is configured in `.env.local`
2. Open the preview browser using the button above
3. You should see trending movies on the homepage
4. Click on any movie card to navigate to the details page
5. Verify that all movie information is displaying correctly
6. Test the trailer functionality if available
7. Try the search functionality

## Troubleshooting

**No movies showing up?**
- Check that your API key is correctly set in `.env.local`
- Make sure there are no extra spaces around the API key
- Restart the development server after adding the API key

**Images not loading?**
- This is normal for movies without poster images
- Placeholder images should appear instead

**API errors?**
- Check the browser console for specific error messages
- Verify your API key is valid and active
- Check your internet connection

## API Rate Limits

TMDB API has the following rate limits:
- 40 requests every 10 seconds
- 1000 requests per day

This should be more than sufficient for normal development and testing.