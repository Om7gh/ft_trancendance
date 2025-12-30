import api from '@/services/clientHttpService';

async function inviteRedirection(userId: string){
	try {
		await api.get(`/pongGame/remote/inviteFriend?fid=${userId}`);
	}
	catch (error: any){
		console.log(error.message);
	}
}

export default inviteRedirection;