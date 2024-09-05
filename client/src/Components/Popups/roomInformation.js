import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import "./index.css";
import axios from 'axios';
import { baseUrl } from '../config';

const RoomInformation = ({ openRoomInformation, setOpenRoomInformation, userId, senderId }) => {
    const [userData, setUserData] = useState({ members: [] });
    const [roomUsers, setRoomUsers] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false)
    const [addUserStatus, setAddUserStatus] = useState(false);
    const [allUsers, setAllUsers] = useState([])



    useEffect(() => {
        if (roomUsers.length > 0) { // Ensure roomUsers has been populated
            axios.get(`${baseUrl}users`)
                .then((res) => {
                    const filteredUsers = res.data.filter(user => userData.created_by !== user.id);
                    setAllUsers(filteredUsers);
                })
                .catch((err) => {
                    console.log('Error fetching users:', err);
                });
        }
    }, [roomUsers]);  // Add roomUsers as a dependency


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseUrl}room/${userId}`);
                if (response.data) {
                    // Parse members if it's a string representation of an array
                    const members = typeof response.data.members === 'string'
                        ? JSON.parse(response.data.members)
                        : response.data.members;

                    setUserData({ ...response.data, members });
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const fetchRoomUsers = async () => {
            if (userData && Array.isArray(userData.members) && userData.members.length > 0) {
                const userIds = userData.members.join(','); // Convert array to comma-separated string
                try {
                    const response = await axios.get(`${baseUrl}room-users/${userIds}`);
                    setRoomUsers(response.data);
                } catch (error) {
                    if (error.response) {
                        console.error('Error response status:', error.response.status);
                        console.error('Error response data:', error.response.data);
                    } else if (error.request) {
                        console.error('No response received:', error.request);
                    } else {
                        console.error('Error message:', error.message);
                    }
                }
            } else {
                console.error('Invalid userData:', userData);
            }
        };
        fetchRoomUsers();
    }, [userData, baseUrl]);

    const onAddRoomButtonClick = (userId) => {
        if (userData.members.includes(userId)) {
            // If userId exists, remove it
            setUserData(prevRoomData => ({
                ...prevRoomData,
                members: prevRoomData.members.filter(memberId => memberId !== userId)
            }));
        } else {
            // If userId doesn't exist, add it
            setUserData(prevRoomData => ({
                ...prevRoomData,
                members: [...prevRoomData.members, userId]
            }));
        }
    }
    

    const handleUpdateRoom = () => {
        axios.put(`${baseUrl}room`, {...userData})
        .then((res) => {
            alert("Submitted Successfully")
            window.location.reload()
        })
        .catch((err) => {
            console.log('Error fetching users:', err);
        });
    }


    const userDetails = () => {
        if (!userData) {
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
                    <div className="update-button">Edit</div>
                </div>
                <div className='profile-main-content'>
                <div className="profile-content">
                    <div className="profile-header">
                        <h1 className="profile-name">{userData.room_name}</h1>
                    </div>
                    <div className="profile-details">
                        <p><strong>Room Members:</strong></p>
                        <div className="profile-stats-1">
                            {userData.created_by === senderId && <button className='add-members-button' onClick={() => setAddUserStatus(prevState => !prevState)}>+Add Mumbers</button>}
                            {!addUserStatus
                                ? roomUsers.map(eachUser => {
                                    return (
                                        <p key={eachUser.id}>
                                            {eachUser.fullname}
                                            <span className='admin-status'>
                                                {eachUser.id === userData.created_by && "Admin"}
                                            </span>
                                        </p>
                                    );
                                })
                                : allUsers.map(eachUser => {
                                    const isUserInRoom = userData.members.includes(eachUser.id);
                                    return (
                                        <p key={eachUser.id}>
                                            {eachUser.fullname}
                                            <span className='admin-status'>
                                                <button
                                                    onClick={() =>{
                                                        onAddRoomButtonClick(eachUser.id)
                                                        setIsSubmit(true)
                                                    } }
                                                    className='add-user-to-room'
                                                >
                                                    {isUserInRoom ? "-" : "+add"}
                                                </button>
                                            </span>
                                        </p>
                                    );
                                })
                            }

                        </div>
                    </div>

                    
                </div>
                <div className='edit-button-container'>
                <button onClick={() => setOpenRoomInformation(false)} className="edit-button">Close</button>
                {isSubmit && <button onClick={handleUpdateRoom} className="edit-button">Submit</button>}
                </div>
                
                </div>
            </div>
        );
    };

    return (
        <>
            {openRoomInformation && <div className="blur-background" />}
            <Popup
                open={openRoomInformation}
                onClose={() => setOpenRoomInformation(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "500px",
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    transition: 'opacity 0.5s ease-in-out',
                    backgroundColor: "white",
                    height: "310px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                }}
                className="popup-content"
            >
                {userDetails()}
            </Popup>
        </>
    );
};

export default RoomInformation;
