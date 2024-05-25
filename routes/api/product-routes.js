const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { findAll } = require('../../models/ProductTag');

// The `/api/products` endpoint

// get all products
router.get('/', async (_req, res) => {
  // find all products
  try {
    // Returns all data from product, category, and tag tables. 
    const productData = await Product.findAll({
      // Can include Category and Tag tables as relationship is established in respective models and index.js file.
      include: [Category, Tag],
      // Orders by id so that order remains consistant as rows are added/removed/updated
      order: [['id', 'ASC']],
    });
    // Return product data
    res.json(productData);
  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    })
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    // Select by primary key based on id parameter provided in request.
    const productData = await Product.findByPk(req.params.id, {
      // Can include Category and Tag tables as relationship is established in respective models and index.js file.
      include: [Category, Tag],
    });
    // Return specified product data
    res.json(productData);
  } catch (err) {
    // If above fails, return generic error and confirm not succesful.
    res.sendStatus(400).json({
      success: false
    })
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    // Use Destroy method provided by Sequilize 
    const deletedVal = await Product.destroy({
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
