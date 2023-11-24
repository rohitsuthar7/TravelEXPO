export const getAdminAuth = async() =>{
    const token = localStorage.getItem('token');
    const res = await fetch('/api/auth/admin',{
        method:"GET",
        headers:{
            'x-auth-token':token
        }
    })

    const data = await res.json();

    if(res.status===200){
        return data;
    }else{
        return false;
    }
}