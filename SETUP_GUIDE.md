# LinkedIn Clone - Setup Guide

## ✅ Fixed Issues

### 1. Profile Page Routing
**Problem:** The "View Profile" button in the navbar dropdown was not working properly due to conflicting catch-all routes.

**Solution:** Fixed the routing order in `App.tsx` by:
- Removing duplicate catch-all routes
- Placing all specific routes before the catch-all route
- Ensuring proper route precedence

### 2. Landing Page as Default
**Problem:** Need to ensure the landing page is visible when first loading the project.

**Solution:** The routing is now configured to:
- Show the Landing page at `/` for unauthenticated users
- Redirect authenticated users to `/feed` automatically
- Show the Landing page when accessing the root URL

## 🚀 How to Run the Application

### Prerequisites
- Node.js installed
- MongoDB running (or MongoDB Atlas connection)
- Supabase account configured

### Step 1: Start the Backend Server
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:5000`

### Step 2: Start the Frontend
```bash
cd project
npm install
npm run dev
```
The frontend will run on `http://localhost:5173` (or `http://localhost:3000`)

## 📋 Application Flow

### For New Users (Not Logged In)
1. **Landing Page** (`/`) - First page you see with job listings and features
2. **Login** (`/login`) - Click "Login" button in header
3. **Signup** (`/signup`) - Click "Sign Up" button in header

### For Logged In Users
1. **Feed** (`/feed`) - Main feed with posts from all users
2. **Profile** (`/profile`) - Your own profile (click "View Profile" in dropdown)
3. **Other User Profile** (`/profile/:userId`) - View other users' profiles

## 🔧 Profile Page Features

The Profile page now includes:
- ✅ Dynamic user data loading from Supabase
- ✅ Profile header with avatar, name, headline, and location
- ✅ Profile stats (views, connections, weekly analytics)
- ✅ About section (displays user bio)
- ✅ Experience section (placeholder data)
- ✅ Education section (placeholder data)
- ✅ Skills section (placeholder data)
- ✅ Languages section (placeholder data)
- ✅ Conditional "Connect" and "Message" buttons (only shown for other users' profiles)

## 🎯 Testing the Profile Feature

1. **Start both servers** (backend and frontend)
2. **Navigate to** `http://localhost:5173` (or your frontend URL)
3. **You should see the Landing page** with job listings
4. **Click "Login"** or **"Sign Up"** to authenticate
5. **After login**, you'll be redirected to the Feed page
6. **Click on your avatar** in the top-right corner
7. **Click "View Profile"** in the dropdown
8. **You should see your profile page** with your actual data

## 📁 Key Files Modified

1. **`project/src/App.tsx`** - Fixed routing order and removed duplicate catch-all routes
2. **`project/src/pages/Profile.tsx`** - Updated to load dynamic user data and work with routing
3. **`project/src/components/Navbar.tsx`** - Already configured to navigate to profile page

## 🔍 Route Configuration

```typescript
/ → Landing Page (public)
/login → Login Page (public, redirects to /feed if authenticated)
/signup → Signup Page (public, redirects to /feed if authenticated)
/feed → Feed Page (protected)
/profile → Your Profile (protected)
/profile/:userId → Other User's Profile (protected)
* → Redirects to Landing (/) if not authenticated, or Feed (/feed) if authenticated
```

## ⚠️ Important Notes

1. **Backend must be running** for the app to work properly
2. **Supabase credentials** must be configured in `.env` file
3. **MongoDB connection** must be active for backend
4. The profile page displays **actual user data** from Supabase
5. Experience, education, skills, and languages sections currently show **placeholder data** (can be connected to database later)

## 🐛 Troubleshooting

### Profile page not loading?
- Check if backend server is running
- Check browser console for errors
- Verify Supabase connection in `.env` file

### Landing page not showing?
- Clear browser cache
- Check if you're logged in (logged-in users are redirected to /feed)
- Try accessing `http://localhost:5173/` directly

### "View Profile" button not working?
- Check browser console for navigation errors
- Verify the user ID is being passed correctly
- Check if the Profile component is properly imported in App.tsx

## ✨ Next Steps

To fully complete the profile feature, you can:
1. Connect experience, education, skills, and languages to Supabase
2. Add edit functionality for profile sections
3. Add image upload for avatar and cover photo
4. Implement "Connect" and "Message" functionality
5. Add profile completion percentage tracking
