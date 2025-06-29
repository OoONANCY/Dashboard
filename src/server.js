const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const inventoryController = require('./inventoryController');
const notificationService = require('./notificationService');
const analyticsService = require('./analyticsService');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static('public'));

// Inventory routes
app.get('/api/inventory', inventoryController.getInventory);
app.post('/api/update-inventory', inventoryController.updateInventory);

// Notification routes
app.get('/api/notifications', notificationService.getNotifications);
app.post('/api/alerts', notificationService.setAlertPreferences);

// Analytics routes
app.get('/api/analytics/trends', analyticsService.getTrends);
app.get('/api/analytics/category-breakdown', analyticsService.getCategoryBreakdown);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket setup
wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'init', data: inventoryController.getInventory() }));
  notificationService.broadcastUpdates(wss, ws);
});