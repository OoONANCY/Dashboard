const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// In-memory store for inventory data with your dataset fields
let inventory = [
  {
    product_url: 'http://example.com/item1',
    product_name: 'Item X',
    product_category_tree: 'Clothing > Men > Shirts',
    pid: 'P001',
    retail_price: 19.99,
    discounted_price: 17.99,
    image: 'http://example.com/image1.jpg',
    is_FK_Advantage_product: true,
    description: 'A stylish men\'s shirt',
    product_rating: 4.5,
    overall_rating: 4.2,
    brand: 'BrandX',
    product_specifications: { size: 'M', color: 'Blue' },
    status: 'just added'
  },
  {
    product_url: 'http://example.com/item2',
    product_name: 'Item Y',
    product_category_tree: 'Electronics > Phones',
    pid: 'P002',
    retail_price: 299.99,
    discounted_price: 279.99,
    image: 'http://example.com/image2.jpg',
    is_FK_Advantage_product: false,
    description: 'Latest smartphone model',
    product_rating: 4.8,
    overall_rating: 4.6,
    brand: 'TechY',
    product_specifications: { storage: '128GB', color: 'Black' },
    status: 'price updated'
  }
];

// Serve static files (for frontend if needed)
app.use(express.static('public'));

// API to get current inventory
app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});

// API to update inventory (simulate Pathway integration)
app.post('/api/update-inventory', express.json(), (req, res) => {
  const update = req.body;
  const itemIndex = inventory.findIndex(item => item.pid === update.pid);
  if (itemIndex !== -1) {
    inventory[itemIndex] = { ...inventory[itemIndex], ...update, status: 'price updated' };
  } else {
    inventory.push({ ...update, status: 'just added' });
  }
  broadcastUpdate();
  res.json({ message: 'Update successful', data: inventory });
});

// Simulate real-time updates (e.g., from Pathway)
setInterval(() => {
  const item = inventory[Math.floor(Math.random() * inventory.length)];
  const priceChange = (Math.random() - 0.5) * 10; // Calculate change
  item.discounted_price = Number((parseFloat(item.discounted_price) + priceChange).toFixed(2));
  item.status = 'price updated';
  broadcastUpdate();
}, 5000); // Update every 5 seconds for demo

// WebSocket setup for real-time updates
function broadcastUpdate() {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'update', data: inventory }));
    }
  });
}

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'init', data: inventory }));
  console.log('Client connected');
});

const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflict
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});