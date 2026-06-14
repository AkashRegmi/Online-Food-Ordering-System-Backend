const uploadImagesMiddleware = (req, res, next) => {
  uploadImages.array("images", 5)(req, res, (err) => {
    // 1. Multer error (size, etc.)
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: `Each file must be under ${uploadImages.maxSize}MB`,
      });
    }

    if (err) return next(err);

    // 2. Validate each file manually (extra safety)
    if (req.files) {
      for (let file of req.files) {
        if (file.size > uploadImages.maxSize * 1024 * 1024) {
          return res.status(413).json({
            message: `${file.originalname} exceeds ${uploadImages.maxSize}MB`,
          });
        }
      }
    }

    next();
  });
};

//how to use    
// const uploadImages = createUploader({
//   allowedTypes: ["image"],
//   maxSize: 2
// });
// router.post(
//   "/upload",
//   uploadImagesMiddleware,
//   controller
// );
