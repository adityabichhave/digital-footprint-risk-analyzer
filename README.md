# 🔐 Digital Footprint Risk Analyzer

A geo-anomaly based login risk detection system that analyzes user login behavior to detect suspicious activity such as impossible travel.

🚀 Built by **Team Stack Overflow Warriors**

---

## 📌 Problem Statement

Traditional authentication systems rely only on passwords or OTPs and fail to detect suspicious behavior after login.

This project analyzes **digital footprints** like:
- Login frequency
- Geo-location changes
- Time-based anomalies

to identify **account takeover risks**.

---

## 💡 Key Features

- ✅ Login behavior analysis
- 🌍 Geo-anomaly detection (Impossible Travel)
- 📊 Risk score visualization (Pie Chart)
- 🗺️ Global login activity map
- 🚨 High / Medium / Low risk classification
- ☁️ MongoDB Atlas integration

---

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB Atlas

### Frontend
- HTML5
- CSS3 (Dark Theme UI)
- JavaScript
- SVG & CSS animations

### Database
- MongoDB (NoSQL, Event-based storage)

---

## 🧠 How It Works

1. Login events are stored in MongoDB with timestamp and location.
2. When a User ID is analyzed:
   - Login count is calculated
   - Geo locations are compared
   - Impossible travel is detected
3. A risk score is generated and visualized.
4. High-risk users are flagged with alerts.

---

## 📂 Project Structure

