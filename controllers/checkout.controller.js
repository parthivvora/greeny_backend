const { default: mongoose } = require("mongoose");
const {
  responseStatusCode,
  responseStatusText,
} = require("../helper/responseHelper");
const cartModel = require("../models/cart");
const orderModel = require("../models/order");
const stripe = require("stripe")(
  "sk_test_51N6VgwSC7XJMZAFO5OubMNX8SeuQlulgS2POlFksmCPW4oHNCIJIJAPy08F96Xw3CXUpvcE5IM5AHVlz3fw36zZb00hd2Q5zy0"
);

// Checkout
exports.checkout = async (req, res) => {
  try {
    const { cartId } = req.body;
    const userId = req.userId;

    const cartData = await cartModel.aggregate([
      {
        $match: {
          _id: { $eq: new mongoose.Types.ObjectId(cartId) },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
        },
      },
      {
        $project: {
          "productDetails.productName": 1,
          "productDetails.productImage": 1,
          "productDetails.productPrice": 1,
          quantity: 1,
          "userDetails._id": 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
        },
      },
    ]);
    if (cartData.length > 0) {
      var raw = "";
      Object.keys(cartData).forEach((key) => {
        raw = cartData[key];
        raw.productDetails.productImage =
          `${process.env.IMAGE_URL}/products/` +
          raw.productDetails.productImage;
      });

      const { quantity, productDetails, userDetails } = cartData[0];
      const isUserExits = await checkCustomerExists(userDetails.email);

      var session = "";
      if (isUserExits) {
        session = await stripe.checkout.sessions.create({
          customer: isUserExits.id,
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: productDetails.productName,
                  images: [productDetails.productImage],
                },
                unit_amount: productDetails.productPrice * 100,
              },
              quantity: quantity,
            },
          ],
          metadata: {
            cartId: cartId,
            userId: userId,
          },
          success_url: `http://localhost:7000/api/user/success?session_id={CHECKOUT_SESSION_ID}&success=true&frontend_url=http://localhost:3000/`,
          cancel_url: "http://localhost:5000/cancel.html",
        });
      } else {
        const newUser = await stripe.customers.create({
          name: userDetails.name,
          email: userDetails.email,
        });
        session = await stripe.checkout.sessions.create({
          customer: newUser.id,
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: productDetails.productName,
                  images: [productDetails.productImage],
                },
                unit_amount: productDetails.productPrice * 100,
              },
              quantity: quantity,
            },
          ],
          metadata: {
            cartId: cartId,
            userId: userId,
          },
          success_url: `http://localhost:7000/api/user/success?session_id={CHECKOUT_SESSION_ID}&success=true&frontend_url=http://localhost:3000/`,
          cancel_url: "http://localhost:5000/cancel.html",
        });
      }

      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        // cartData: cartData,
        session: session.url,
      });
    }
  } catch (error) {
    console.log("🚀 ~ exports.checkout= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

async function checkCustomerExists(email) {
  try {
    const customers = await stripe.customers.list({ email: email });
    if (customers.data.length > 0) {
      return customers.data[0];
    }
  } catch (error) {
    console.error("Error checking customer:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
}

// Order confirm and Store order details
exports.orderAdd = async (req, res) => {
  try {
    const { session_id } = req.query;
    const paymentData = await stripe.checkout.sessions.retrieve(session_id);

    if (paymentData.payment_status == "paid") {
      const newObj = {
        cartId: paymentData.metadata.cartId,
        userId: paymentData.metadata.userId,
        paymentMethod: "card",
        paymentId: paymentData.payment_intent,
        paymentStatus: "paid",
        totalAmount: paymentData.amount_total / 100,
      };
      await orderModel.create(newObj);
      //   return res.status(responseStatusCode.SUCCESS).json({
      //     status: responseStatusText.SUCCESS,
      //     message: "Your order are confirmed...!",
      //     data: paymentData,
      //   });
      return res.redirect("http://localhost:3000");
    } else {
      return res.status(responseStatusCode.INTERNAL_SERVER).json({
        status: responseStatusText.ERROR,
        message: "Your payment are unsuccessful...!",
      });
    }
  } catch (error) {
    console.log("🚀 ~ exports.orderAdd= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all orders for Admin
exports.getAllOrder = async (req, res) => {
  try {
    const orderData = await orderModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          orderDate: 1,
          orderStatus: 1,
          deliveryStatus: 1,
          "userDetails._id": 1,
          "userDetails.name": 1,
        },
      },
    ]);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      orderData: orderData,
    });
  } catch (error) {
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all payment for Admin
exports.getAllPayments = async (req, res) => {
  try {
    const paymentData = await orderModel.aggregate([
      {
        $project: {
          _id: 1,
          paymentId: 1,
          totalAmount: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          paymentDate: "$orderDate",
        },
      },
    ]);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      paymentData,
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllPayments= ~ error:", error.message);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Update order delivery status by Admin using orderId
exports.updateOrderDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    await orderModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(orderId),
      },
      {
        $set: {
          deliveryStatus: "Confirmed",
        },
      },
      {
        new: true,
      }
    );
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your order has been confirmed",
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllPayments= ~ error:", error.message);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
