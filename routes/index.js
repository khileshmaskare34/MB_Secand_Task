var express = require('express');
var router = express.Router();
const productController = require('../controllers/productControllers');
const paymentController = require('../controllers/paymentContoller');
const db = require('../config/db')
const multer = require('multer')
const path = require('path');
const Item = require('../models/item');
const { createCheckoutSession } = require('../controllers/checkoutControllers');
const { handleStripeWebhook } = require('../controllers/webhookController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}


router.get('/item', (req, res)=>{
  res.render('addItem')
})

router.post('/item', (req, res)=>{
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send('Error: No File Selected!');
      } else {
       
        const newItem = new Item({
          itemName: req.body.itemname,
          price: req.body.price,
          image: req.file.filename
        })

        newItem.save().then((doc) => {
          console.log(doc);
          res.redirect('/products');
        });
      }
    }
  });
})
router.get('/cart', (req, res)=>{
  res.render('cartPage');
})

router.post('/cart', async (req, res) => {
  try {
    const itemID = req.body.id;
    console.log("cart Info", itemID);

    // Use await to handle the asynchronous operation
    const cartItem = await Item.findById(itemID);

    if (!cartItem) {
      return res.status(404).send({ error: "Item not found" });
    }

    console.log("===", cartItem);

    // Send the found item back to the client
    res.render('cartPage', {
    cartItem: cartItem,
    key: 1

    })
  } catch (error) {
    console.error("Error finding item:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
router.post('/create-payment-intent', paymentController.createPaymentIntent);

router.get('/products', productController.getProducts);
router.post('/create-checkout-session',createCheckoutSession );

router.get('/success', (req, res)=>{
  res.render('success')
})

router.get('/cancel', (req, res)=>{
  res.send("cancel ho gaya")
})

// Handle Stripe webhook events
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
