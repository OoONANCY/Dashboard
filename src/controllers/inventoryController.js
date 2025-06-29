const inventory = [
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
       status: 'just added',
       last_updated: new Date()
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
       status: 'price updated',
       last_updated: new Date()
     }
   ];

   function getInventory(req, res) {
     const { brand } = req.query;
     let filteredInventory = inventory;
     if (brand) {
       filteredInventory = inventory.filter(item => item.brand === brand);
     }
     res.json(filteredInventory);
   }

   function updateInventory(req, res) {
     const update = req.body;
     const itemIndex = inventory.findIndex(item => item.pid === update.pid);
     if (itemIndex !== -1) {
       inventory[itemIndex] = { ...inventory[itemIndex], ...update, status: 'price updated', last_updated: new Date() };
     } else {
       inventory.push({ ...update, status: 'just added', last_updated: new Date() });
     }
     res.json({ message: 'Update successful', data: inventory });
   }

   module.exports = { getInventory, updateInventory };