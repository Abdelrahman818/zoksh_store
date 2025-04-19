import { useState, useEffect } from "react";
import Loading from "../../Components/Loading/Loading"

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [info, setInfo] = useState("");
  const [template, setTemplate] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pType, setPType] = useState('');

  const handleTemplateChange = (e) => {
    const file = e.target.files[0];
    if (file) setTemplate(file);
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };
  const handelTypeChange = (e) => {
    setPType(e.target.value);
  }
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("type", "upload");
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("info", info);
    formData.append("template", template);
    formData.append("pType", pType);
    images.forEach((img) => formData.append("images[]", img));

    const res = await fetch("http://localhost/zoksh-store/src/PHP/back.php", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log(result);
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="add-product-container">
        <h2>Add New Product</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price (EGP)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <select onChange={handelTypeChange}>
            <option defaultValue='shirt'>Shirts</option>
            <option defaultValue='hoodies'>Hoodies</option>
            <option defaultValue='jackets'>Jackets</option>
            <option defaultValue='pullOvers'>Pullovers</option>
            <option defaultValue='sweatShirts'>Sweat shirts</option>
          </select>

          <textarea
            placeholder="Product Info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            required
          ></textarea>

          <label className="upload-label">Upload Product Template *</label>
          <div
            className="custom-image-upload"
            onClick={() => document.getElementById("templateUploadInput").click()}
          >
            <span className="plus-icon">+</span>
            <p>Click to upload product template</p>
          </div>
          <input
            id="templateUploadInput"
            type="file"
            accept="image/*"
            onChange={handleTemplateChange}
            required
            style={{ display: "none" }}
          />

          {template && (
            <div className="template-preview">
              <h4>Template Preview</h4>
              <img src={URL.createObjectURL(template)} alt="Template Preview" />
            </div>
          )}
          
          <label className="upload-label">Upload Product Images *</label>
          <div
            className="custom-image-upload"
            onClick={() => document.getElementById("imageUploadInput").click()}
          >
            <span className="plus-icon">+</span>
            <p>Click to upload product images</p>
          </div>
          <input
            id="imageUploadInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            style={{ display: "none" }}
          />

          {imagePreviews.length > 0 && (
            <div className="preview-grid">
              {imagePreviews.map((src, index) => (
                <img key={index} src={src} alt={`preview-${index}`} />
              ))}
            </div>
          )}

          <button type="submit">Submit Product</button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
