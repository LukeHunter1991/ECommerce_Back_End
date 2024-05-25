const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    // Returns all data from category, product tables. 
    const catData = await Category.findAll({
      include: [Product],
      // Orders by id so that order remains consistant as rows are added/removed/updated
      order: [['id', 'ASC']],
    })
    res.json(catData);
  } catch (err) {
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    // Select from Category table left outer join Product table by primary key based on id parameter provided in request.
    const catData = await Category.findByPk(req.params.id, {
      include: [Product],
    })
    // Return specified category data
    res.json(catData);
  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    // Use create method provided by Sequilize to INSERT new tag into category table.
    const newCat = await Category.create(req.body);
    // Returns tag that was created.
    res.json(newCat);

  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    });
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    // Use update method provided by Sequilize to update Category table WHERE id = req.params.id
    const catData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    // Returns an array with the number of rows updated.
    res.json(catData);
  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    // Use Destroy method provided by Sequilize 
    const deletedVal = await Category.destroy({
      // Delete row where ID matches provided ID parameter
      where: {
        id: req.params.id,
      },
    })
    // Returns an array with the number of rows deleted.
    res.json(deletedVal);
  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    })
  }
});

module.exports = router;
