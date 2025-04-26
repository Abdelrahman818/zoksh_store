import { useState, useEffect, useRef } from "react";
import Loading from "../../Components/Loading/Loading";
import api from "../../config";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [info, setInfo] = useState("");
  const [template, setTemplate] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pType, setPType] = useState("");
  const [categories, setCategories] = useState([]);

  const templateInputRef = useRef(null);
  const imagesInputRef = useRef(null);

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
  };

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

    const res = await fetch(api, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.msg === "uploaded") {
      setProductName("");
      setPrice("");
      setInfo("");
      setTemplate(null);
      setImages([]);
      setImagePreviews([]);
      setPType("");
      if (templateInputRef.current) templateInputRef.current.value = null;
      if (imagesInputRef.current) imagesInputRef.current.value = null;
    }
    setLoading(false);
  };
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  useEffect(() => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getTypes" }),
    })
      .then((res) => res.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

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

          <select
            required
            value={pType}
            onChange={handelTypeChange}
            style={{ backgroundColor: "#222", color: "#eee" }}
          >
            <option value="" disabled>
              Choose category
            </option>
            {categories.map((e) => (
              <option key={e.id} value={e.name.toLowerCase()}>
                {capitalizeFirst(e.name)}
              </option>
            ))}
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
            onClick={() => templateInputRef.current.click()}
          >
            <span className="plus-icon">+</span>
            <p>Click to upload product template</p>
          </div>

          <input
            ref={templateInputRef}
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
            onClick={() => imagesInputRef.current.click()}
          >
            <span className="plus-icon">+</span>
            <p>Click to upload product images</p>
          </div>
          <input
            ref={imagesInputRef}
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
