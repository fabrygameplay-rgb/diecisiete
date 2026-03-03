# 📊 Data Analysis System

Interactive and responsive sales dashboard that simulates real-time data by brand.  
Built entirely with HTML, CSS and Vanilla JavaScript using the Canvas API.

---

## 🚀 Features

- Real-time simulated sales updates (every 5 seconds)
- Brand filtering system
- Dynamic daily and monthly metrics
- Hour-by-hour navigation
- Stop / Resume simulation control
- Multiple interactive charts rendered with Canvas
- Fully responsive design (desktop, tablet, mobile portrait & landscape)
- Horizontal scroll navigation for brands on mobile

---

## 🖥️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Media Queries)
- Vanilla JavaScript
- HTML5 Canvas API

No external libraries or frameworks were used.

---

## 📊 Dashboard Metrics

The system dynamically calculates:

- Daily Sales
- Monthly Sales
- Average Ticket
- Units Sold Today
- Annulment Sales (simulated 2%)

All values update automatically as the simulation progresses.

---

## 📈 Charts Included

- Line Chart – Daily Sales progression
- Bar Chart – Hourly Sales
- Pie Chart – Brand distribution
- Vertical Bar Chart – Monthly Sales
- Horizontal Bar Chart – Monthly comparison
- Variation Chart – Sales fluctuation

All charts are manually drawn using the Canvas API.

---

## 🔄 Simulation Logic

Each brand has a defined profile:

{
  base: number,
  volatility: number
}

Sales are calculated based on:

- Base value
- Random volatility
- Hour-based multiplier (peak hours increase sales)

The fictional business day runs from 08:00 to 20:00, then automatically advances to the next day.

---

## 📱 Responsive Design

Breakpoints implemented:

- 1200px – Medium desktop adjustments
- 900px – Small desktop / tablet
- 600px – Mobile portrait
- 767px (landscape) – Mobile horizontal

Mobile landscape includes horizontal scroll navigation for brand selection.

---

## 🎮 Controls

- Stop / Resume simulation
- Hour navigation (◀ ▶ arrows)
- Brand filter menu

---

## 🧠 What This Project Demonstrates

- DOM manipulation
- State management in JavaScript
- Dynamic data simulation
- Canvas-based chart rendering
- Responsive layout architecture
- Event-driven UI interaction

---

## 👨‍💻 Author

Fabrizio with the "z"
