let notifications = [];
let alertPreferences = {};

function getNotifications(req, res) {
  const { category, type, urgency } = req.query;
  let filteredNotifications = notifications;
  if (category) filteredNotifications = filteredNotifications.filter(n => n.category === category);
  if (type) filteredNotifications = filteredNotifications.filter(n => n.type === type);
  if (urgency) filteredNotifications = filteredNotifications.filter(n => n.urgency === urgency);
  res.json(filteredNotifications);
}

function setAlertPreferences(req, res) {
  alertPreferences = req.body;
  res.json({ message: 'Preferences saved', data: alertPreferences });
}

function broadcastUpdates(wss, ws) {
  setInterval(() => {
    const item = inventory[Math.floor(Math.random() * inventory.length)];
    const priceChange = (Math.random() - 0.5) * 10;
    item.discounted_price = Number((parseFloat(item.discounted_price) + priceChange).toFixed(2));
    item.status = 'price updated';
    item.last_updated = new Date();

    const notification = {
      message: `${item.product_name} ${item.status} at ${item.last_updated.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`,
      category: item.product_category_tree.split(' > ')[0],
      type: item.status,
      urgency: 'medium',
      timestamp: item.last_updated
    };
    notifications.push(notification);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update', data: inventory, notification }));
      }
    });
  }, 5000);
}

module.exports = { getNotifications, setAlertPreferences, broadcastUpdates };