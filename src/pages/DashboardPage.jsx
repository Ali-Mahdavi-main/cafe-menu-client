import { apiFetch } from "../services/api"
import { useEffect, useState } from "react"

function DashboardPage(){
    const [cafe, setCafe] = useState(null)

    useEffect(()=> {
        loadCafe()
    }, [])

    async function loadCafe() {
        const response = await apiFetch("/auth/me");

        const data = await response.json();

        if(response.ok){
            setCafe(data)
        }
    }

    return(
        <div>
            <h1>Dashboard</h1>
            {cafe && (
                <>
                    <h2>{cafe.cafeName}</h2>
                    <p>{cafe.userName}</p>
                    <p>{cafe.cafeId}</p>
                </>
            )}
            
            </div>
        
    )
}
export default DashboardPage