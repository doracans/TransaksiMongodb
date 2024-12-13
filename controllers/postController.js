import Post from "../model/postModel.js"

const tambahData = async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
 
        
        return res.status(201).json({
            status: "Success",
            data: newPost
        })
    } catch (error) {
        res.status(400).json({
            status:'fail',
            message:error.errors
        })
    }
}

const tampilData = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json({
      status: "Success",
      data: posts,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const detailPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    return res.status(200).json({
      status: "Success",
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const updatePost = async (req, res) => {
  try {
      const updateData = await Post.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators:true,
    });

    return res.status(200).json({
      status: "Success",
      data: updateData,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.errors,
    });
  }
};

const delPost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "Success",
     message:"Data berhasil dihapus"
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
export { tambahData, tampilData, detailPost, updatePost, delPost};
