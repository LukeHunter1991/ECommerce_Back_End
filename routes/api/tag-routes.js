const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    // Returns all data from tag, product tables. 
    const cats = await Tag.findAll({
      include: [Product],
      // Orders by id so that order remains consistant as rows are added/removed/updated
      order: [['id', 'ASC']],
    })
    res.json(cats);
  } catch (err) {
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    // Select from tag table left outer join Product table by primary key based on id parameter provided in request.
    const tagData = await Tag.findByPk(req.params.id, {
      include: [Product],
    })
    // Return specified tag data
    res.json(tagData);
  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    // Use create method provided by Sequilize to INSERT new tag into tag table.
    const newTag = await Tag.create(req.body);
    // Returns tag that was created.
    res.json(newTag);

  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    });
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // Use update method provided by Sequilize to update Tag table WHERE id = req.params.id
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    // Returns an array with the number of rows updated.
    res.json(tagData);
  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    })
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    // Use Destroy method provided by Sequilize 
    const deletedVal = await Tag.destroy({
      // Delete row where ID matches provided ID parameter
      where: {
        id: req.params.id
      }
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
