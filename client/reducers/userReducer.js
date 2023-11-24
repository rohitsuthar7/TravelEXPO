export const initialState=localStorage.getItem('user');

export const userReducer=(state,action)=>{
    if(action.type==="USER"){
        return action.payload;
    }
    return state
}