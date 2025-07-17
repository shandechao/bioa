# BIXoa
## 📸 Photo Upload and Review App

A simple full-stack web app that allows users to:

- Start the device camera in browser
- Start camera and Capture a photo
- Upload the photo to the backend
- Get a link to review the uploaded photo
  
---

## 🚀 How to Run

Make sure Docker is installed.

```bash
docker build -t yourAppName ./photo-repo
docker run -p 3000:3000 yourAppName
```

---

## 🧩 System Design

### Frontend (Next.js + React)

- Camera logic is implemented in `components/CameraPanel.tsx`
- Uses `navigator.mediaDevices.getUserMedia()` to access the user's camera
- Displays a `<video>` element with fixed size **420x420 pixels**
- When the user clicks "Capture", a frame from the video stream is drawn onto a `<canvas>` element
- The canvas image is then converted to a `Blob` and uploaded to the backend using `fetch()`

### Backend (Next.js API Route)

- Upload endpoint is located at: `app/api/upload/route.ts`
- Accepts `POST` requests with multipart/form-data
- Validates:
  - Maximum image dimensions: **600x600 pixels**
- On success:
  - Saves the image to `/public/uploads/`
  - Returns a public URL for reviewing the uploaded photo

---

## ▶️ Run API Test

### Test URL:
/api/upload

### Command
```bash
python __test__/upload.test.py
```
### Results
✅ [user_15] 382x239 - status=200
✅ [user_16] 210x288 - status=200
✅ [user_17] 330x797 - status=400
✅ [user_18] 577x528 - status=200
✅ [user_19] 595x677 - status=400
✅ [no_photo] 0x0 - status=400
✅ [not_image] 100x100 - status=500

---








