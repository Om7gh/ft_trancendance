import axios from "axios";

async function areFriends(cookie, userID){
	try {
		const response = await axios.request({
			url: `http://identity:4000/friends/${userID}`,
				headers:{
					Cookie: cookie
				}
			});
		return (response.status === 200);
	}
	catch (error){
		console.error("error happend while fetching friend status: ", error);
		return (false);
	}
}

export default areFriends;