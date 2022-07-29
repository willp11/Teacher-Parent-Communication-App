import { useEffect, useState } from "react"

export const useMessage = () => {

    const [message, setMessage] = useState("");

    useEffect(()=>{
        const reset = setTimeout(()=>{
            setMessage("")
        }, 5000)

        return () => {
            clearTimeout(reset)
        }
    }, [message])

    return [message, setMessage]
}
