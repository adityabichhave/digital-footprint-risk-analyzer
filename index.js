function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// 🔴 PASTE YOUR MONGODB CONNECTION STRING BELOW
const MONGO_URL = "mongodb+srv://datacraft:iacrz2xAexQrnAIn@cluster0.da9jxug.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(MONGO_URL);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("risk_analyzer");
  console.log("MongoDB Connected Successfully");
}

connectDB();

app.post('/login-event', async (req, res) => {
  const event = req.body;
  event.timestamp = new Date();

  await db.collection("login_events").insertOne(event);

  res.json({ message: "Login event stored" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/risk-score/:userId', async (req, res) => {
  const userId = req.params.userId;

  const events = await db.collection("login_events")
    .find({ userId })
    .sort({ timestamp: 1 })
    .toArray();

  if (events.length < 2) {
    return res.json({ userId, riskScore: 0, geoAnomaly: false });
  }

  let geoAnomaly = false;
  const devices = new Set();
  const ips = new Set();

  for (let i = 0; i < events.length; i++) {
    devices.add(events[i].device?.os);
    ips.add(events[i].ip);

    if (i === 0) continue;

    const prev = events[i - 1];
    const curr = events[i];

    if (!prev.location || !curr.location) continue;

    const [lon1, lat1] = prev.location.coordinates;
    const [lon2, lat2] = curr.location.coordinates;

    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const t1 = new Date(prev.timestamp).getTime();
    const t2 = new Date(curr.timestamp).getTime();

    const diffHours = (t2 - t1) / (1000 * 60 * 60);

    if (diffHours > 0) {
      const speed = distance / diffHours;
      if (speed > 900) geoAnomaly = true;
    }
  }

  let riskScore = 0;
  if (devices.size > 1) riskScore += 20;
  if (ips.size > 1) riskScore += 30;
  if (events.length > 2) riskScore += 25;
  if (geoAnomaly) riskScore += 40;

  res.json({
    userId,
    totalLogins: events.length,
    devices: [...devices],
    ips: [...ips],
    geoAnomaly,
    riskScore
  });
});