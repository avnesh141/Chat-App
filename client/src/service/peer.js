class PeerService{
    constructor(){
         if(!this.peer){
            this.peer=new RTCPeerConnection();
         }
    }
    async getOffer(){
        if(this.peer){
             const offer=await this.peer.createOffer();
             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
             return offer;
        }
    }

    async getAnswer(offer){
        if(this.peer){
            await this.peer.setRemoteDescription(offer);
            const ans =await this.peer.createAnswer();
            // this.peer.setLocalDescription
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    }

    async setLocalDescription(ans){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }
}

export default new PeerService();