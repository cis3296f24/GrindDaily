import LinearProgress from '@mui/material/LinearProgress';
import { Gauge } from '@mui/x-charts/Gauge';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.png';

function Progress () {

    const { userId } = useParams();
    const [challenges, setChallenges] = useState([]);

    const [totalDifficulties, setTotalDifficulties] = useState(0);

    const [progress, setProgress] = useState(0);
    const [levels, setLevels] = useState(0);
    const [leftOverExp, setLeftOverExp] = useState(0);

    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:9000/api/challenge/${userId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then((response) => response.json())
        .then((data) => 
            {
                if(!data.error) {
                    console.log('Challenges Successfully Retrieved', data);
                    setChallenges(data.challenges);

                    const total = data.challenges.reduce((accumulate, challenge) => accumulate + challenge.difficulty, 0);
                    setTotalDifficulties(total);

                    const levels = Math.floor(total / 20);
                    const leftover = total % 20;
                    const progressPercentage = (leftover / 20) * 100;

                    setLevels(levels);
                    setLeftOverExp(leftover);
                    setProgress(progressPercentage);
                }
                else {
                    console.log('Failed to retrive', data.error);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });

            const fetchUserData = async () => {
                try {
                    const response = await fetch(`http://localhost:9000/api/user/${userId}`);
                    if (!response.ok) {
                        throw new Error('User not found');
                    }
                    const data = await response.json();
                    setUser(data.user); 
                    } catch (err) {
                    console.error(err.message);
                    }
                };
            
            fetchUserData();

    }, [])

    if (!userId || !user) {
        return (
            <div className="text-center mt-12 text-blue-500">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="p-8 mt-8 text-gray-300 min-h-full">
            <div className="bg-neutral-800 p-6 rounded-md shadow-md mb-6 flex items-center gap-4">
                <img
                    src={user.avatarUrl || defaultAvatar}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full"
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">User Information</h1>
                    <p><strong>Name:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Bio:</strong> {user.bio || "No bio available"}</p>
                </div>
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-6">
                {/*Grind History */}
                <div className="lg:w-2/3 bg-neutral-800 p-6 rounded-md shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Grind History</h1>
                    {challenges.length === 0 ? (
                        <p>No Challenge History</p>
                    ) : (
                        <div className="space-y-4">
                            {challenges.map((challenge) => (
                                <div
                                    key={challenge._id}
                                    className="p-4 text-white shadow-sm border-b border-gray-300"
                                >
                                    <h3 className="text-lg font-bold">{challenge.title}</h3>
                                    <p className="text-sm text-gray-400">Genre: {challenge.genre}</p>
                                    <p className="text-sm text-gray-400">Description: {challenge.description}</p>
                                    <p className="text-sm text-gray-400">Duration: {challenge.duration} mins</p>
                                    <p className="text-sm text-gray-400">Difficulty: {challenge.difficulty}</p>
                                    <p className="text-sm text-gray-400">Generated By: {challenge.generatedBy}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

 
                <div className="lg:w-1/3 flex flex-col items-center bg-neutral-800 p-6 lg:h-96 h-auto rounded-md shadow-md">
                    <div className="w-full mb-6">
                        <h3 className="text-lg font-bold mb-2">Level: {levels}</h3>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                '& .MuiLinearProgress-bar': {
                                    background: 'rgb(75, 89, 148)',
                                },
                                background: 'rgb(82 82 82)',
                                height: 8,
                                borderRadius: 5,
                            }}
                        />
                        <p className="text-sm text-gray-400 mt-2">Sigma Progress: {challenges.length}/300</p>
                    </div>
                    <Gauge
                        width={200}
                        height={200}
                        value={challenges.length || 0}
                        valueMin={0}
                        valueMax={300}
                        title="Your Sigma Progress"
                        sx={{
                            '& .MuiGauge-referenceArc': {
                                fill: 'rgb(82 82 82)',
                            },
                            '& .MuiGauge-valueArc': {
                                fill: 'rgb(152, 98, 166)',
                            },
                            '& .MuiGauge-valueText': {
                                display: 'none',
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Progress;
