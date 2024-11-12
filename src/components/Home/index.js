import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import "./index.css";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState([]);
  const [editableData, setEditableData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const itemsPerPage = 10;

  const getList = async () => {
    const apiUrl =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    const options = {
      method: "GET",
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    if (response.ok === true) {
      const updatedData = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      setUserData(updatedData);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const handleEdit = (id, newName) => {
    const updatedList = userData.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    );
    setUserData(updatedList);
  };

  const handleDelete = (id) => {
    const updatedList = userData.filter((item) => item.id !== id);
    setUserData(updatedList);
  };

  const handleEditing = (id) => {
    setIsEditing(id);
    const item = filteredSearch.find((user) => user.id === id);
    setEditableData({ name: item.name, email: item.email, role: item.role });
  };

  const handleInputChange = (field, value) => {
    setEditableData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = (id) => {
    setUserData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, ...editableData } : item
      )
    );
    setIsEditing(null);
  };

  const itemSelected = (id) => {
    setSelectedItem((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const inputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const deleteSelectedItems = () => {
    const updatedList = userData.filter(
      (item) => !selectedItem.includes(item.id)
    );
    setUserData(updatedList);
    setSelectedItem([]);
  };

  const filteredSearch = userData.filter((item) => {
    const matchedSearch =
      item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.role.toLowerCase().includes(searchInput.toLowerCase());
    return matchedSearch;
  });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSearch.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = Math.ceil(filteredSearch.length / itemsPerPage);

  const renderUserDetails = () => (
    <div className="container">
      <input
        type="text"
        value={searchInput}
        onChange={inputChange}
        className="search"
        placeholder="Search"
      />
      <table>
        <tr className="list-item">
          <th></th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        <ul className="list-container">
          {currentItems.map((user) => (
            <tr key={user.id} className="list-item">
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={() => itemSelected(user.id)}
                  checked={selectedItem.includes(user.id)}
                />
              </td>
              <td className="heading">
                {isEditing === user.id ? (
                  <input
                    className="input-element"
                    type="text"
                    value={editableData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <span>{user.name}</span>
                )}
              </td>
              <td className="para">
                {isEditing === user.id ? (
                  <input
                    className="input-element"
                    type="text"
                    value={editableData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </td>
              <td className="para">
                {isEditing === user.id ? (
                  <input
                    className="input-element"
                    type="text"
                    value={editableData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                  />
                ) : (
                  <span>{user.role}</span>
                )}
              </td>
              <td className="action">
                <div className="btn-container">
                  <button
                    className="edit-button"
                    onChange={(e) => handleEdit(user.id, e.target.value)}
                    onClick={() =>
                      isEditing === user.id
                        ? handleSave(user.id)
                        : handleEditing(user.id)
                    }
                  >
                    {isEditing === user.id ? <CiSaveDown2 className="save" /> : <FaRegEdit className="edit" />}
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </ul>
      </table>
      <div>
        <button
          className="prev-page"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            className={`first-page ${currentPage === i + 1 ? "active" : ""}`}
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
        className={`next-page ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          next
        </button>
      </div>
      <button onClick={deleteSelectedItems} className="delete-selected">
        Delete Selected
      </button>
    </div>
  );

  return <div>{renderUserDetails()}</div>;
}
