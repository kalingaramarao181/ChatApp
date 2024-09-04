import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { baseUrl } from "../config";
import "./index.css";

// Modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    width: "400px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Added box shadow
  },
};

const Admin = () => {
  const [userData, setUserData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserData, setDeleteUserData] = useState({userId: "", userName: ""});
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneno: "",
    dateofbirth: "",
    address: "",    
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenDelete, setModalIsOpenDelete] = useState(false);
  


  useEffect(() => {
    axios
      .get(`${baseUrl}users`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`${baseUrl}users/${deleteUserData.userId}`)
      .then(() => {
        setUserData(userData.filter((user) => user.id !== deleteUserData.userId));
        setModalIsOpenDelete(false)
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullname: user.fullname,
      email: user.email,
      phoneno: user.phoneno,
      dateofbirth: user.dateofbirth,
      address: user.address,
      password: user.password
    });
    setModalIsOpen(true); // Open the modal
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`${baseUrl}users/${editingUser.id}`, formData)
      .then(() => {
        setUserData(
          userData.map((user) =>
            user.id === editingUser.id ? { ...user, ...formData } : user
          )
        );
        setModalIsOpen(false); // Close the modal after submission
        setEditingUser(null); // Clear the editing state
      })
      .catch((err) => {
        console.error("Error updating user:", err);
      });
  };

  const editUserPopup = () => {
    return <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setModalIsOpen(false)}
    style={customStyles}
    contentLabel="Edit User"
  >
    <div>
      <h3>Edit User</h3>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label className="dashboard-lable">Full Name:</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleFormChange}
            className="dashboard-edit-input"
          />
        </div>
        <div>
          <label className="dashboard-lable">Email:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            className="dashboard-edit-input"
          />
        </div>
        <div>
          <label className="dashboard-lable">Phone No:</label>

          <input
            type="text"
            name="phoneno"
            value={formData.phoneno}
            onChange={handleFormChange}
            className="dashboard-edit-input"
          />
        </div>
        <div>
          <label className="dashboard-lable">Date of Birth:</label>

          <input
            type="date"
            name="dateofbirth"
            value={formData.dateofbirth}
            onChange={handleFormChange}
            className="dashboard-edit-input"
          />
        </div>
        <div>
          <label className="dashboard-lable">Address:</label>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            className="dashboard-edit-input"
          />
        </div>
        <div className="dashboard-button-container">
          <button
            type="button"
            className="dashboard-edit-buttons1"
            onClick={() => setModalIsOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="dashboard-edit-buttons2">
            Save
          </button>
        </div>
      </form>
    </div>
  </Modal>
  }

  const deleteUserPopup = () => {
    return <Modal
    isOpen={modalIsOpenDelete}
    onRequestClose={() => setModalIsOpenDelete(false)}
    style={customStyles}
    contentLabel="Delete User"
  >
    <div>
      <h5>Are you sure you want to Delete User ('{deleteUserData.userName}')</h5>
        <div className="dashboard-button-container">
          <button
            type="button"
            className="dashboard-edit-buttons1"
            onClick={() => setModalIsOpenDelete(false)}
          >
            Cancel
          </button>
          <button type="button" onClick={handleDelete} className="dashboard-edit-buttons2">
            Delete
          </button>
        </div>
        </div>

  </Modal>
  }

  return (
      <div className="orders-page">
        <div className="sidebar">
          <h2 className="admin-heading">Admin</h2>
          <ul>
            <li>Dashboard</li>
            <li className="active">Users</li>
            <li>Statistic</li>
            <li>Product</li>
            <li>Trash Bin</li>
            <li>LogOut</li>
          </ul>
        </div>
        <div className="orders-content">
          <div className="orders-header">
            <h2>Users</h2>
          </div>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>FullName</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>DateOfBirth</th>
                <th>Address</th>
                <th>Delete</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneno}</td>
                  <td>{user.dateofbirth}</td>
                  <td>{user.address}</td>
                  <td>
                    <button
                      className="action-button-delete"
                      onClick={() =>  {
                        setModalIsOpenDelete(true)
                        setDeleteUserData({...deleteUserData, userId: user.id, userName: user.fullname })
                      }}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      className="action-button-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editUserPopup()}
          {deleteUserPopup()}
        </div>
      </div>
  );
};

export default Admin;
