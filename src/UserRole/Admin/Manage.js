import { useState, useEffect } from "react";
import Loading from "../../Components/Loading/Loading";
import api from "../../config";

const Manage = () => {
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [temp, setTemp] = useState(null);
  const [catName, setCatName] = useState("");
  const [tempPrev, setTempPrev] = useState(null);
  const [delConf, setDelConf] = useState(false);
  const [selectedCate, setSelectedCate] = useState(null);

  useEffect(() => {
    getTypes();
  }, []);
  const getTypes = () => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getTypes" }),
    })
      .then((res) => res.json())
      .then(setTypes)
      .finally(() => setLoading(false));
  };
  const addCategory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", "addCategory");
    formData.append("name", catName);
    formData.append("temp", temp);
    setLoading(true);
    fetch(api, {
      method: "POST",
      body: formData,
    })
      .finally(() => {
        setLoading(false);
        setTempPrev(null);
        setCatName('');
        getTypes();
      });
  };
  const handelFile = (e) => {
    setTemp(e.target.files[0]);
    const preview = URL.createObjectURL(e.target.files[0]);
    setTempPrev(preview);
  };
  const delWarn = (cateId) => {
    setDelConf(true);
    setSelectedCate(cateId);
  };
  const deleteItem = () => {
    setLoading(true);
    setDelConf(false);
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "cateDel",
        id: selectedCate,
      })
    })
      .then(res => res.json())
      .then(setTypes)
      .finally(() => {
        setLoading(false);
        getTypes();
      });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="manage-products">
        <h2 className="section-title">Manage Product Types</h2>
        <div className="management-panel">
          <div className="upload-box">
            <label htmlFor="typeImage" className="upload-type-label">
              Upload Type Image
              <input
                id="typeImage"
                type="file"
                className="file-input"
                onChange={handelFile}
                required
              />
            </label>
            {tempPrev && (
              <div className="selected-img">
                <img src={tempPrev} alt="Preview" />
              </div>
            )}
          </div>
          <div className="add-type-box">
            <form onSubmit={addCategory}>
              <input
                type="text"
                className="type-input"
                placeholder="Enter new product type..."
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
              />
              <button className="add-btn">
                Add category
              </button>
            </form>
          </div>
          <div className="vertical-divider"></div>
          <div className="types-list">
            <h3 className="types-title">Available Types</h3>
            <div className="type-items">
              {types.length > 0 ? (
                types.map((type, index) => (
                  <div style={{ position: "relative" }} key={index}>
                    <div className="cross" onClick={() => delWarn(type.id)}>
                      <span className="r"></span>
                      <span className="l"></span>
                    </div>
                    <span className="type-chip">
                      {type.name}
                    </span>
                  </div>
                ))
              ) : (
                <strong>No types availble</strong>
              )}
            </div>
          </div>
        </div>
      </div>
      {delConf && (
        <div className="del-conf-cont parent bg-dark">
          <div className="del-conf-msg">
            <p>Are you sure that you want to delete this category?</p>
            <strong className="danger">
              "This may case to lose all products that has this categoryin the
              store"
            </strong>
            <div className="del-manager-btn">
              <span className="conf" onClick={deleteItem}>Yes! I'am sure</span>
              <span className="cancel" onClick={() => setDelConf(false)}>Cancel</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Manage;
