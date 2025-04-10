import { projectAuth } from "@/firebase/config"
import { ref } from "vue"

const error = ref(null)

const signup = async (email, password, displayName) => {
    error.value = null
    try {
        const response = await projectAuth.createUserWithEmailAndPassword(email, password)

        if(!response)
            throw new Error('Could not signup')
        console.log(response.user)
        
        //update the value of displayName
        await response.user.updateProfile({displayName: displayName})
        error.value = null
        return response
    } catch (err) {
        console.log(err)
        error.value = err.message
    }

}

const useSignup = () => {
    return {error, signup}
}

export default useSignup