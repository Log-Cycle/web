import React, { createContext,useState,useEffect } from "react";
import firebase from "../service/firebase"
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user');

        if(recoveredUser){
            setUser(JSON.parse(recoveredUser))
        }

        setLoading(false)
    }, [])
    const checklogin = async (emailLog,password) =>{
        const users = await firebase.getUsers()
        
        const responde = users.find(({email})=>{ return email === emailLog})
        if(responde){
            return  responde.password === password? responde : false
        }else{
            alert("Usuario ou Senha Invalida")
            return false
        }
    }
    const login = async (email, password) => {
        const response = await checklogin(email,password)
        if(response){
            const loggedUSer = {
                email,
                id: response.id
            }
            localStorage.setItem("user",JSON.stringify(loggedUSer))
            setUser(loggedUSer)
            navigate("/maps")
        }
    }
    const logout = () => {
        localStorage.removeItem('user')
        setUser(null)
        navigate("/")
    }
    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, loading, login,logout }}>
            {children}
        </AuthContext.Provider>
    )
}