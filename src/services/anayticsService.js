function getTrends(req, res) {
  const trends = inventory.map(item => ({
    product_name: item.product_name,
    stock_trend: Math.floor(Math.random() * 100),
    date: new Date().toISOString().split('T')[0]
  }));
  res.json(trends);
}

function getCategoryBreakdown(req, res) {
  const breakdown = inventory.reduce((acc, item) => {
    const category = item.product_category_tree.split(' > ')[0];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  res.json(breakdown);
}

module.exports = { getTrends, getCategoryBreakdown };