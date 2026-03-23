# Video Support Test Checklist

## 1. Admin Panel - Add Property
- [ ] Navigate to `/admin/properties/new`
- [ ] Fill in required fields (title, description, price, etc.)
- [ ] Click "Add Videos" button
- [ ] Select a video file (MP4, WebM, MOV, or AVI)
- [ ] Verify video preview appears with play icon
- [ ] Submit the form
- [ ] Check if property is created successfully

## 2. Admin Panel - Edit Property
- [ ] Navigate to an existing property
- [ ] Click "Edit Property"
- [ ] Verify existing videos are displayed (if any)
- [ ] Add new videos
- [ ] Remove videos (click X button)
- [ ] Save changes
- [ ] Verify changes are saved

## 3. Property Gallery - Frontend
- [ ] Navigate to a property with videos
- [ ] Verify videos appear in gallery with play icon
- [ ] Click on video to open fullscreen
- [ ] Verify video player controls work:
  - [ ] Play/Pause button
  - [ ] Volume control
  - [ ] Progress bar
  - [ ] Fullscreen toggle
- [ ] Verify navigation between images and videos works

## 4. Video Optimization
- [ ] Check network tab for video URLs
- [ ] Verify Cloudinary transformations are applied:
  - Should include `q_auto,f_auto,c_limit,w_1920,vc_auto`
- [ ] Verify videos load quickly and are optimized

## 5. CSP Headers
- [ ] Check browser console for CSP errors
- [ ] Verify no errors related to video playback
- [ ] Verify `media-src` includes `https://res.cloudinary.com`

## 6. Mobile Responsiveness
- [ ] Test on mobile devices
- [ ] Verify video gallery works on touch devices
- [ ] Verify video player is responsive

## 7. Error Handling
- [ ] Try uploading an unsupported video format
- [ ] Verify appropriate error message
- [ ] Try uploading a very large video file
- [ ] Verify upload progress indicator works

## Notes:
- Videos are uploaded to Cloudinary with resource_type: 'video'
- Videos are stored in the 'videos' array field in the Property model
- Video URLs are passed as hidden inputs in the form
- The gallery automatically detects video vs image URLs
