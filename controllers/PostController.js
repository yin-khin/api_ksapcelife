// const { Post, Category } = require("../models");
// const fs = require("fs");
// const path = require("path");

// // ✅ Helper: Convert plain text with line breaks → HTML
// // Runs on the backend before saving to DB
// // So DB always stores proper HTML, frontend just renders it directly
// const convertTextToHTML = (text) => {
//   if (!text || !text.trim()) return "";

//   // Already has HTML block tags → return as-is (no double convert)
//   if (/<(p|br|div|h[1-6]|ul|ol|li|blockquote)\b/i.test(text)) return text;

//   // Normalize line endings (Windows \r\n → \n)
//   const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

//   // Escape HTML special chars
//   const escaped = normalized
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");

//   // Double newlines → separate <p> paragraphs
//   // Single newlines  → <br> inside same paragraph
//   const blocks = escaped.split(/\n{2,}/);
//   if (blocks.length > 1) {
//     return blocks
//       .map((b) => (b.trim() ? `<p>${b.replace(/\n/g, "<br>")}</p>` : ""))
//       .filter(Boolean)
//       .join("");
//   }

//   // Single block with \n
//   if (escaped.includes("\n")) {
//     return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
//   }

//   // No newlines at all
//   return `<p>${escaped}</p>`;
// };

// const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.findAll({
//       include: [{ model: Category, as: "category" }],
//       order: [["createdAt", "DESC"]],
//     });
//     res.json({ success: true, posts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id, {
//       include: [{ model: Category, as: "category" }],
//     });
//     if (!post)
//       return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, post });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.findAll();
//     res.json({ success: true, categories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const createPost = async (req, res) => {
//   try {
//     const imagePaths = req.files
//       ? req.files.map((file) => `/uploads/posts/${file.filename}`)
//       : [];

//     let imageDescriptions = [];
//     if (req.body.image_descriptions) {
//       try {
//         imageDescriptions = JSON.parse(req.body.image_descriptions);
//       } catch {
//         imageDescriptions = [];
//       }
//     }

//     // ✅ Convert content plain text → HTML before saving
//     const htmlContent = convertTextToHTML(req.body.content || "");

//     const post = await Post.create({
//       ...req.body,
//       content: htmlContent,
//       images: imagePaths,
//       image_descriptions: imageDescriptions,
//     });
//     res.status(201).json({ success: true, post });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updatePost = async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (!post)
//       return res.status(404).json({ success: false, message: "Not found" });

//     let updateData = {};

//     if (req.body.title !== undefined) updateData.title = req.body.title;
//     if (req.body.title_kh !== undefined)
//       updateData.title_kh = req.body.title_kh;

//     // ✅ Convert content plain text → HTML before saving
//     if (req.body.content !== undefined) {
//       updateData.content = convertTextToHTML(req.body.content);
//     }

//     if (req.body.category_code !== undefined)
//       updateData.category_code = req.body.category_code;

//     const existingImages = post.images || [];
//     const existingDescriptions = post.image_descriptions || [];

//     if (req.files && req.files.length > 0) {
//       const newImagePaths = req.files.map(
//         (file) => `/uploads/posts/${file.filename}`,
//       );

//       let newDescriptions = [];
//       if (req.body.image_descriptions) {
//         try {
//           newDescriptions = JSON.parse(req.body.image_descriptions);
//         } catch {
//           newDescriptions = [];
//         }
//       }

//       updateData.images = [...existingImages, ...newImagePaths];
//       updateData.image_descriptions = [
//         ...existingDescriptions,
//         ...newDescriptions,
//       ];
//     } else {
//       updateData.images = existingImages;
//       updateData.image_descriptions = existingDescriptions;
//     }

//     await post.update(updateData);

//     const updatedPost = await Post.findByPk(req.params.id, {
//       include: [{ model: Category, as: "category" }],
//     });

//     res.json({ success: true, post: updatedPost });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (!post)
//       return res.status(404).json({ success: false, message: "Not found" });

//     if (post.images && post.images.length > 0) {
//       post.images.forEach((imagePath) => {
//         const fullPath = path.join(__dirname, "..", imagePath);
//         if (fs.existsSync(fullPath)) {
//           fs.unlinkSync(fullPath);
//         }
//       });
//     }

//     await post.destroy();
//     res.json({ success: true, message: "Deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const createCategory = async (req, res) => {
//   try {
//     const category = await Category.create(req.body);
//     res.status(201).json({ success: true, category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateCategory = async (req, res) => {
//   try {
//     const category = await Category.findByPk(req.params.code);
//     if (!category)
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" });
//     await category.update(req.body);
//     res.json({ success: true, category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findByPk(req.params.code);
//     if (!category)
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" });

//     const postsCount = await Post.count({
//       where: { category_code: req.params.code },
//     });
//     if (postsCount > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot delete category with existing posts",
//       });
//     }

//     await category.destroy();
//     res.json({ success: true, message: "Category deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   getAllPosts,
//   getPostById,
//   getCategories,
//   createPost,
//   updatePost,
//   deletePost,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// };

const { Post, Category } = require("../models");
const fs = require("fs");
const path = require("path");

// ✅ Convert plain text → HTML
const convertTextToHTML = (text) => {
  if (!text || !text.trim()) return "";

  // already html
  if (/<(p|br|div|h[1-6]|ul|ol|li|blockquote)\b/i.test(text)) {
    return text;
  }

  // normalize line breaks
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // escape html
  const escaped = normalized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // split paragraphs
  const blocks = escaped.split(/\n{2,}/);

  if (blocks.length > 1) {
    return blocks
      .map((b) => (b.trim() ? `<p>${b.replace(/\n/g, "<br>")}</p>` : ""))
      .filter(Boolean)
      .join("");
  }

  return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
};

// ============================
// GET ALL POSTS
// ============================
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET POST BY ID
// ============================
const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET CATEGORIES
// ============================
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// CREATE POST
// ============================
const createPost = async (req, res) => {
  try {
    // image urls
    const imagePaths = req.files
      ? req.files.map(
          (file) => `${process.env.BASE_URL}/uploads/posts/${file.filename}`,
        )
      : [];

    // descriptions
    let imageDescriptions = [];

    if (req.body.image_descriptions) {
      try {
        imageDescriptions = JSON.parse(req.body.image_descriptions);
      } catch (err) {
        imageDescriptions = [];
      }
    }

    // convert content
    const htmlContent = convertTextToHTML(req.body.content || "");

    const post = await Post.create({
      title: req.body.title,
      title_kh: req.body.title_kh,
      content: htmlContent,
      category_code: req.body.category_code,
      images: imagePaths,
      image_descriptions: imageDescriptions,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// UPDATE POST
// ============================
const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let updateData = {};

    // text fields
    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
    }

    if (req.body.title_kh !== undefined) {
      updateData.title_kh = req.body.title_kh;
    }

    if (req.body.content !== undefined) {
      updateData.content = convertTextToHTML(req.body.content);
    }

    if (req.body.category_code !== undefined) {
      updateData.category_code = req.body.category_code;
    }

    // existing images
    const existingImages = post.images || [];
    const existingDescriptions = post.image_descriptions || [];

    // new uploads
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(
        (file) => `${process.env.BASE_URL}/uploads/posts/${file.filename}`,
      );

      let newDescriptions = [];

      if (req.body.image_descriptions) {
        try {
          newDescriptions = JSON.parse(req.body.image_descriptions);
        } catch (err) {
          newDescriptions = [];
        }
      }

      updateData.images = [...existingImages, ...newImagePaths];

      updateData.image_descriptions = [
        ...existingDescriptions,
        ...newDescriptions,
      ];
    } else {
      updateData.images = existingImages;
      updateData.image_descriptions = existingDescriptions;
    }

    await post.update(updateData);

    const updatedPost = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// DELETE POST
// ============================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // delete local files
    if (post.images && post.images.length > 0) {
      post.images.forEach((imageUrl) => {
        try {
          const filename = imageUrl.split("/").pop();

          const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            "posts",
            filename,
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.log("Delete image error:", err);
        }
      });
    }

    await post.destroy();

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// CREATE CATEGORY
// ============================
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// UPDATE CATEGORY
// ============================
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.code);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.update(req.body);

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// DELETE CATEGORY
// ============================
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.code);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const postsCount = await Post.count({
      where: {
        category_code: req.params.code,
      },
    });

    if (postsCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing posts",
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getCategories,
  createPost,
  updatePost,
  deletePost,
  createCategory,
  updateCategory,
  deleteCategory,
};
