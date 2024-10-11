const order = require("../Model/order_model")
const products = require("../Model/products_model")
const cart = require("../Model/cart_model")
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();
const Razorpay = require('razorpay');
let crypto = require("crypto")
const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., Gmail
  auth: {
    user: 'abhinandappuabhinand@gmail.com', // Your email
    pass: 'atax ugbb hoyv pblb'  // Your email password
  }
});

var payment_gateway = new Razorpay({ key_id: process.env.Payment_Gateway_Key_Id, key_secret: process.env.Payment_Gateway_Secret_Key })

var { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils');

module.exports = {

  Order_Product: async (req, res) => {
    try {
      console.log("order")

      const user_email = req.session.User.email

      const user_id = req.session.User._id;
      let { pid, adid, T_QTY, T_Price, pay_method, purchased_date } = req.body;
      let date_of_purchased = new Date(purchased_date).toISOString();
      let ids = [];
      pid.map((i) => {
        ids.push(i.product_Id)
      })
      console.log(ids)

      const Items = await products.find({ _id: { $in: ids } });
      console.log(Items)
      let product_name;
      Items.map((pro_detail) => {
        product_name = pro_detail.name
      })

      if (pay_method === 'COD') {
        let order_exist = new order({
          userId: user_id,
          Address_Id: adid,
          products: pid.map(item => ({
            product_Id: item.product_Id.trim(),
            quantity: item.quantity
          })),
          date: date_of_purchased,
          total_Price: T_Price,
          total_Quantity: T_QTY,
          status: "Order Placed"
        });

        let ordered_by_COD = await order_exist.save();

        if (ordered_by_COD) {
          let ids = [];
      pid.map((i) => {
        ids.push(i.product_Id)
      })
      console.log(ids)
          const ordered_item_incart = await cart.findOne({ user_Id: user_id,'items.product_Id':{$in:ids}});
           console.log(ordered_item_incart)
          if (ordered_item_incart) {
         const result = await cart.updateMany(
            { user_Id: user_id, 'items.product_Id': { $in: ids } },
            { $pull: { items: { product_Id: { $in: ids } } } }
        );
            console.log(result)
          }

          const mailOptions = {
            from: '"Electro" abhinandappuabhinand@gmail.com', // Sender's address
            to: user_email, // Receiver's address
            subject: 'Order Confirmation', // Email subject
            text: `Dear Customer you  Order for ${product_name} has Placed successfully  from my store Electro 
                  Please be prepared to pay in cash when the delivery arrives at your doorstep.
                  Thank you for shopping with us!
                  Have a Great Day`
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
          })


          return res.json({ success: true });

        }
      }

      else {
        console.log("hello")
        const options = {
          amount: T_Price * 100,  // amount in the smallest currency unit (paise)
          currency: 'INR',
        };

        let key_Id = process.env.Payment_Gateway_Key_Id
console.log(key_Id)
        const order = await payment_gateway.orders.create(options)
        let order_Id = order.id
        return res.json({ key_Id, order_Id });
      }

    } catch (error) {
      console.log(error.message);

    }


  },

  Payment_Verification: async (req, res) => {
    try {
      const user_id = req.session.User._id;
      const user_email = req.session.User.email

      console.log(req.body)
      const { pay_Id, order_Id, signature, pid, adid, T_QTY, T_Price, purchased_date } = req.body
      let date_of_purchased = new Date(purchased_date).toISOString();

      let ids = [];
      pid.map((i) => {
        ids.push(i.product_Id)
      })
      console.log(ids)

      const Items = await products.find({ _id: { $in: ids } });
      console.log(Items)
      let product_name;
      Items.map((pro_detail) => {
        product_name = pro_detail.name
      })
      let secret = process.env.Payment_Gateway_Secret_Key

      const data = order_Id + '|' + pay_Id;

      let generated_signature = crypto.createHmac('sha256', secret).update(data).digest('hex');


      validatePaymentVerification({ "order_id": order_Id, "payment_id": pay_Id }, signature, secret)
      if (generated_signature === signature) {
        let order_exist = new order({
          userId: user_id,
          Address_Id: adid,
          products: pid.map(item => ({
            product_Id: item.product_Id.trim(),
            quantity: item.quantity
          })),
          date: date_of_purchased,
          total_Price: T_Price,
          total_Quantity: T_QTY,
          status: "Paid"
        });

        let ordered = await order_exist.save();


        //  console.log(ordered)
        if (ordered) {
          pid.map((i) => {
            ids.push(i.product_Id)
          })
          console.log(ids)
    
          const ordered_item_incart = await cart.findOne({ user_Id: user_id,'items.product_Id':{$in:ids}});
           console.log(ordered_item_incart)
          if (ordered_item_incart) {
         const result = await cart.updateMany(
            { user_Id: user_id, 'items.product_Id': { $in: ids } },
            { $pull: { items: { product_Id: { $in: ids } } } }
        );
            console.log(result)
          }
          const mailOptions = {
            from: '"Electro" abhinandappuabhinand@gmail.com', // Sender's address
            to: user_email, // Receiver's address
            subject: 'Order Confirmation', // Email subject
            text: `Dear Customer you are purchased ${product_name} successfully  from my store Electro Thank you for shopping with us! Have a Great Day`
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
          })
          return res.json({ success: true })

        }

      }



    }
    catch (error) {
      console.log(error.message)
    }
  }




}