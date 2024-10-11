const products = require("../Model/products_model");
const User = require("../Model/user_model");
const categories = require("../Model/categories_model");
const subcategories = require("../Model/sub_categories_model");
const orders = require("../Model/order_model");

module.exports = {
  get_adminHome: (req, res) => {
    const admin = req.session.admin;
    admin ? res.render('admin_home', { admin }) : res.redirect('/login');
  },

  get_admin_page: async (req, res) => {
    try {
      const [Products, Customers, Orders] = await Promise.all([
        products.find(),
        User.find(),
        orders.find(),
      ]);

      const admin = req.session.admin;
      admin ? res.render('admin_page', {
        admin,
        products_count: Products.length,
        customers_count: Customers.length,
        orders_count: Orders.length,
      }) : res.redirect('/login');
    } catch (error) {
      console.error(error.message);
    }
  },

  get_admin_profile: (req, res) => {
    const admin = req.session.admin;
    admin ? res.render('admin_profile', { admin }) : res.redirect('/login');
  },

  view_products: async (req, res) => {
    try {
      const [Categories, Products] = await Promise.all([
        categories.find(),
        products.find(),
      ]);

      const admin = req.session.admin;
      admin ? res.render('products', { admin, Products, Categories }) : res.redirect('/login');
    } catch (error) {
      console.error(error.message);
    }
  },

  show_product_details: async (req, res) => {
    try {
      const { _id: product_id } = req.params;
      const [Product, Categories, SubCategories] = await Promise.all([
        products.findById(product_id),
        categories.find(),
        subcategories.find(),
      ]);

      const admin = req.session.admin;
      admin ? res.render('show_product_details', { admin, Product, Categories, SubCategories }) : res.redirect('/login');
    } catch (error) {
      console.error(error.message);
    }
  },

  view_categories: async (req, res) => {
    try {
      const [Products, Categories, Subcategories] = await Promise.all([
        products.find(),
        categories.find(),
        subcategories.find(),
      ]);

      const category = await categories.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category_Id",
            as: "product_details",
          },
        },
      ]);

      const subcategory = await subcategories.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'sub_category_Id',
            as: "Product_Detail",
          },
        },
      ]);

      const admin = req.session.admin;
      admin ? res.render('categories', { admin, Categories, Subcategories, Products, product_detail: category, Product_Detail: subcategory }) : res.redirect('/login');
    } catch (error) {
      console.error(error.message);
    }
  },

  get_category_form: async (req, res) => {
    try {
      const Categories = await categories.find();
      const admin = req.session.admin;
      admin ? res.render('Add_categories_and_subcategories', { admin, Categories }) : res.redirect('/login');
    } catch (error) {
      console.error(error.message);
    }
  },

  add_categories: async (req, res) => {
    try {
      const { categoryName } = req.body;
      const image_filename = req.file.filename;

      const added = await categories.create({ name: categoryName, image: image_filename });
      added ? res.json({ success: true }) : res.status(500).json({ error: "Failed to add category" });
    } catch (error) {
      console.error(error.message);
    }
  },

  add_subcategories: async (req, res) => {
    try {
      const { categoryId, subCategoryName } = req.body;
      await subcategories.create({ name: subCategoryName, category_Id: categoryId });
      res.redirect("/Add_categories");
    } catch (error) {
      console.error(error.message);
    }
  },

  update_category: async (req, res) => {
    try {
      const { categoryName, categoryId } = JSON.parse(req.body.req_body);
      const image_filename = req.file.filename;

      const updated = await categories.updateOne({ _id: categoryId }, { $set: { name: categoryName, image: image_filename } });
      updated.modifiedCount === 1 ? res.json("Updated Successfully") : res.status(500).json({ error: "Update failed" });
    } catch (error) {
      console.error(error.message);
    }
  },

  delete_category: async (req, res) => {
    try {
      const { id: category_id } = req.params;
      const deleted = await categories.deleteOne({ _id: category_id });
      deleted.deletedCount === 1 ? res.json("Deleted Successfully") : res.status(500).json({ error: "Deletion failed" });
    } catch (error) {
      console.error(error.message);
    }
  },

  update_subcategory: async (req, res) => {
    try {
      const { id: subcategory_id } = req.params;
      const { name } = req.body;

      const updated = await subcategories.updateOne({ _id: subcategory_id }, { name });
      updated.modifiedCount === 1 ? res.json("Updated Successfully") : res.status(500).json({ error: "Update failed" });
    } catch (error) {
      console.error(error.message);
    }
  },

  delete_subcategory: async (req, res) => {
    try {
      const { id: subcategory_id } = req.params;
      const deleted = await subcategories.deleteOne({ _id: subcategory_id });
      deleted.deletedCount === 1 ? res.json("Deleted") : res.status(500).json({ error: "Deletion failed" });
    } catch (error) {
      console.error(error.message);
    }
  },

  choose_subcategories: async (req, res) => {
    try {
      const { id: category_id } = req.params;
      const SubCategories = await subcategories.find({ category_Id: category_id });
      res.json(SubCategories);
    } catch (error) {
      console.error(error.message);
    }
  },

  manage_customers: async (req, res) => {
    try {
      const customers = await User.find({ role: { $ne: "Admin" } });
      const admin = req.session.admin;
      admin ? res.render('customers', { admin, customers }) : res.redirect('/login');
    } catch (error) {
      console.error(error.message);
    }
  },

  block_customers: async (req, res) => {
    try {
      const { _id: user_id } = req.params;
      const User_blocked = await User.updateOne({ _id: user_id }, { $set: { blocked: true } });
      User_blocked.modifiedCount === 1 ? res.json("Customer Blocked") : res.status(500).json({ error: "Block failed" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  unblock_customers: async (req, res) => {
    try {
      const { _id: customer_id } = req.params;
      const unblocked = await User.updateOne({ _id: customer_id }, { $set: { blocked: false } });
      unblocked.modifiedCount === 1 ? res.json("Customer Unblocked") : res.status(500).json({ error: "Unblock failed" });
    } catch (error) {
      console.error(error.message);
    }
  },

  manage_orders: async (req, res) => {
    try {
      const Ordered_Products = await orders.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: "products.product_Id",
            foreignField: "_id",
            as: "ordered_items",
          },
        },
        { $unwind: '$ordered_items' },
      ]);

      const admin = req.session.admin;
      admin ? res.render('orders', { admin, Ordered_Products }) : res.redirect('/login');
    } catch (error) {
      console.error(error.message);
    }
  },

  change_Ordered_Prodcut_Status: async (req, res) => {
    try {
      const { status, order_Id } = req.body;
      const updated = await orders.updateOne({ _id: order_Id }, { $set: { status } });
      updated.modifiedCount === 1 ? res.json({ success: true }) : res.status(500).json({ error: "Status change failed" });
    } catch (error) {
      console.error(error.message);
    }
  },

  logout: (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error("Error occurred:", error.message);
      }
      res.redirect("/login");
    });
  }
};
