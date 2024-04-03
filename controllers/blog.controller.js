const { default: mongoose } = require("mongoose");
const {
  responseStatusText,
  responseStatusCode,
} = require("../helper/responseHelper");
const blogModel = require("../models/blog");
const { createBlogValidation } = require("../validation/blog.validation");
const fs = require("fs");

// Create blog by Admin
exports.createBlog = async (req, res) => {
  try {
    const { error, value } = createBlogValidation.validate(req.body);
    if (error) {
      fs.unlinkSync(req.file.path);
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: error.details[0].message,
      });
    }
    if (!req.file) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: "Please, upload blog image...!",
      });
    }
    const newBlogDate = {
      blogTitle: value.blogTitle,
      blogDescription: value.blogDescription,
      blogImage: req.file.filename,
    };
    blogModel.create(newBlogDate);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your blog is add successfully...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: blog.controller.js:34 ~ exports.createBlog= ~ error:",
      error
    );
    fs.unlinkSync(req.file.path);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all blogs using for users
exports.getAllBlogs = async (req, res) => {
  try {
    const blogData = await blogModel.find();
    if (blogData.length > 0) {
      var row = "";
      Object.keys(blogData).forEach((key) => {
        row = blogData[key];
        row.blogImage = `${process.env.IMAGE_URL}/blog/` + row.blogImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        blogData,
      });
    }
    return res.status(responseStatusCode.FORBIDDEN).json({
      status: responseStatusText.ERROR,
      message: "No blog data here...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: blog.controller.js:58 ~ exports.getAllBlog= ~ error:",
      error
    );
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get single blog details using blogId
exports.getSingleBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blogData = await blogModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(blogId),
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "blogId",
          as: "commentData",
        },
      },
      {
        $addFields: {
          count: {
            $map: {
              input: "$commentData",
              as: "commentData",
              in: 1,
            },
          },
        },
      },
      {
        $project: {
          commentCount: { $size: "$count" },
          _id: 1,
          blogTitle: 1,
          blogDescription: 1,
          blogDate: 1,
          blogImage: 1,
          blogStatus: 1,
          "commentData._id": 1,
          "commentData.name": 1,
          "commentData.message": 1,
          "commentData.isDeleted": 1,
          "commentData.createdAt": 1,
        },
      },
    ]);
    if (blogData) {
      var row = "";
      Object.keys(blogData).forEach((key) => {
        row = blogData[key];
        row.blogImage = `${process.env.IMAGE_URL}/blog/` + row.blogImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        blogData,
      });
    }
    return res.status(responseStatusCode.FORBIDDEN).json({
      status: responseStatusText.ERROR,
      message: "No blog data here...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: blog.controller.js:83 ~ exports.getSingleBlog= ~ error:",
      error
    );
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Update blog details by Admin using blogId
exports.updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { blogTitle, blogDescription } = req.body;
    if (req.file) {
      const { filename } = req.file;
      const updateBlogDetail = {
        blogTitle: blogTitle,
        blogDescription: blogDescription,
        blogDate: Date.now(),
        blogImage: filename,
      };
      await blogModel.updateOne(
        { _id: new mongoose.Types.ObjectId(blogId) },
        { $set: updateBlogDetail },
        { new: true }
      );
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        message: "Your blog details is updated successfully...!",
      });
    }
    const updateBlogDetail = {
      blogTitle: blogTitle,
      blogDescription: blogDescription,
      blogDate: Date.now(),
    };
    await blogModel.updateOne(
      { _id: new mongoose.Types.ObjectId(blogId) },
      { $set: updateBlogDetail },
      { new: true }
    );
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your blog details is updated successfully...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: blog.controller.js:123 ~ exports.updateBlog= ~ error:",
      error
    );
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Update blog status by Admin using blogId (if status false then don't show in Frontend)
exports.updateBlogStatus = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { status } = req.body;
    await blogModel.updateOne(
      { _id: new mongoose.Types.ObjectId(blogId) },
      { $set: { blogStatus: status } },
      { new: true }
    );
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your blog status is updated successfully...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.updateBlogStatus= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Delete blog by Admin using blogId
exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const isBlogAvailable = await blogModel.findOne({
      _id: new mongoose.Types.ObjectId(blogId),
    });
    if (isBlogAvailable) {
      await blogModel.deleteOne({ _id: new mongoose.Types.ObjectId(blogId) });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        message: "Your blog is deleted successfully...!",
      });
    }
    return res.status(responseStatusCode.NOT_FOUND).json({
      status: responseStatusText.ERROR,
      message: "No blog found of your choice for delete...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.deleteBlog ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
