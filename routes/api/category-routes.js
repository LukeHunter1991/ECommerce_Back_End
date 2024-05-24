const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const cats = await Category.findAll({
      include: [Product],
    })
    res.json(cats);
  } catch (err) {
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const cats = await Category.findByPk(req.params.id, {
      include: [Product],
    })
    res.json(cats);
  } catch (err) {
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCat = await Category.create(req.body);
    res.json(newCat);

  } catch (err) {
    res.sendStatus(400).json({
      success: false
    });
  }

});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const newCat = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    res.json(newCat);
  } catch (err) {
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedVal = await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    res.json(deletedVal);
  } catch (err) {
    res.sendStatus(400).json({
      success: false
    })
  }
});

module.exports = router;
