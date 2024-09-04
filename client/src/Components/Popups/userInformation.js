import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import "./index.css"
import axios from 'axios';
import { baseUrl } from '../config';

const UserInformation = ({ openRoomInformation, setopenRoomInformation, userId }) => {
    const [roomData, setroomData] = useState(null);


    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await axios.get(`${baseUrl}room/${userId}`);
                setroomData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoomData();
    }, [userId]);



    const roomDetails = () => {
        if (!roomData) {
            return <div>Loading...</div>;
        }
        return (
            <div className="profile-card">
                <div className="profile-picture-container">
                    <img
                        src="https://th.bing.com/th/id/R.c3631c652abe1185b1874da24af0b7c7?rik=XBP%2fc%2fsPy7r3HQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-user-icon-circled-user-icon-2240.png&ehk=z4ciEVsNoCZtWiFvQQ0k4C3KTQ6wt%2biSysxPKZHGrCc%3d&risl=&pid=ImgRaw&r=0"
                        alt="Profile"
                        className="profile-picture"
                    />
                    <div className="update-button">Update</div>
                </div>
                <div className="profile-content">
                    <div className="profile-header">
                        <h1 className="profile-name">{roomData.fullname}</h1>
                        
                    </div>
                    <p className="profile-location">{roomData.location}</p>
                    <div className="profile-details">
                        <p><strong>Email:</strong> {roomData.email}</p>
                        <p><strong>Date of Birth:</strong> {roomData.dateofbirth}</p>
                        <p><strong>Address:</strong> {roomData.address}</p>
                    </div>
                    <div className="profile-stats">
                        <div className="profile-rating">
                            <strong>Online Status:</strong> {roomData.loginstatus === 1 ? "Online" : roomData.lastseen}
                        </div>
                    </div>
                    <button onClick={() => setopenRoomInformation(false)} className="edit-button">Close</button>
                </div>
            </div>
        )
    }

    return (
        <>
            {openRoomInformation && <div className="blur-background" />}

            <Popup
                open={openRoomInformation}
                onClose={() => setopenRoomInformation(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "500px",
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    transition: 'opacity 0.5s ease-in-out',
                    backgroundColor: "white",
                    height: "280px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                }}
                className="popup-content"
            >

                <>
                    {roomDetails()}
                </>

            </Popup>
        </>
    );
};

export default UserInformation;
