// This file includes the axios calls

const axios = require('axios'); // Importing axios library
const BASE = process.env.LEETCODE_API_BASE || 'https://alfa-leetcode-api.onrender.com';


// Fetches Name + Profile
async function fetchProfile(username) {

    const url = `${BASE}/userProfile/${encodeURIComponent(username)}`; // API URL for user profile endpoint
    const { data } = await axios.get(url); // GET Request using Axios
    const name = data?.userProfile?.realName || data?.userProfile?.username || username;
    return { raw: data, name };

}

// Problems solved 
async function fetchSolved(username) {
    
    const url = `${BASE}/${encodeURIComponent(username)}/solved`; // URL For solved problems endpoint 
    const { data } = await axios.get(url); // Calling API for solved stats 
    
    const easy = data?.easySolved ?? data?.easy ?? 0;
    const medium = data?.mediumSolved ?? 0;
    const hard = data?.hardSolved ?? 0;
    // Extracting the solve counts for easy, medium and hard
    // If missing then default to 0 using ?? operator 

    const total = data?.totalSolved ?? (easy + medium + hard); // Extracting total solved if possible, calculating otherwise

    return { raw: data, byDifficulty: { easy, medium, hard }, total}; // Returning data and total 
}


async function getUserStatsSummary(username) {
    const [profile, solved] = await Promise.all([
        fetchProfile(username),
        fetchSolved(username),
    ]);


    return {
        username,
        name: profile.name, 
        solved: {
            total: solved.total,
            byDifficulty: solved.byDifficulty
        },
        typesOfProblemsSolved: {
            byDifficulty: solved.byDifficulty
        }
    };
}

module.exports = { getUserStatsSummary };