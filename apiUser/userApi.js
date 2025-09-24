const{baseURL,headers}=require('../config/Config')
class apiUser{
    constructor(request){
        this.request=request;
    }
    async createUser(data){
        return await this.request.post(`${baseURL}/user/createWithList`,{
            headers,
            data
        })

    }
     async getUser(){
        return await this.request.get(`${baseURL}/user/user1`,{
           headers,

        })
     }
     async updateUser(data,username){
        return await this.request.put(`${baseURL}/user/${username}`,{
            headers,
           data 
        })
     }

     async deleteUser(username){
        return await this.request.delete(`${baseURL}/user/${username}`,{
            headers
        })
     }
}
module.exports={apiUser};