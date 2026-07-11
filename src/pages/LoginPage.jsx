import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "@/context/AuthContext";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { refreshUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await apiFetch("/auth/login",{
            method : "POST",
            body : JSON.stringify({
                username,
                password
            }) 
        })
    
        const data = await response.json()

        if (!response.ok) {
            alert(data.message)
            return
        }
        localStorage.setItem("token", data.token);
        
        await refreshUser();

        navigate("/dashboard")
}
    return ( 
        <div>
            <h1>ورود کافه</h1>

            <input 
            type="text" 
            placeholder="نام کاربری"
            value={username}
            onChange={(event)=> setUsername(event.target.value)}
            />

            <input 
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
             />
            <button onClick={handleLogin}>
                ورود
            </button>
        </div>
     );
}

export default LoginPage;