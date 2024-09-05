import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import "./index.css"
import axios from 'axios';
import { baseUrl } from '../config';

const EditUserInformation = ({ openEditUserInformation, setOpenEditUserInformation, userId }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phoneno: "",
        dateofbirth: "",
        address: "",
    });


    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await axios.get(`${baseUrl}users/${userId}`);
                setFormData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoomData();
    }, [userId]);



    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        axios
            .put(`${baseUrl}users/${userId}`, formData)
            .then(() => {
                console.log("User Updated Successfully");
                localStorage.setItem('senderData', JSON.stringify(formData))
                window.location.reload()
            })
            .catch((err) => {
                console.error("Error updating user:", err);
            });
    };



    const userDetails = () => {
        return (
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
                            onClick={() => setOpenEditUserInformation(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="dashboard-edit-buttons2">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <>
            {openEditUserInformation && <div className="blur-background" />}

            <Popup
                open={openEditUserInformation}
                onClose={() => setOpenEditUserInformation(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "370px",
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    transition: 'opacity 0.5s ease-in-out',
                    backgroundColor: "white",
                    height: "460px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                }}
                className="popup-content"
            >

                <>
                    {userDetails()}
                </>

            </Popup>
        </>
    );
};

export default EditUserInformation;
