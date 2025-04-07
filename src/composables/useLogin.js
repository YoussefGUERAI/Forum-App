import { projectAuth } from "@/firebase/config"
import { ref } from "vue"

const error = ref(null)

const login = async (email, password) => {
    error.value = null
    try {
        const response = await projectAuth.signInWithEmailAndPassword(email, password)
        error.value = null
        console.log(response)
        return response
    } catch (err) {
      //  console.log('---> Error GEN = ',err)
        //console.log('---> Error CODE = ',err.code)
       // const erreur = JSON.parse(err.message)
        console.log('---> Error MESSAGE : ',JSON.parse(err.message).error.message)
        //console.log('---> Error DATA : ',err.response.message)
        error.value = JSON.parse(err.message).error.message
    }

}

const useLogin = () => {
    return {error, login}
}

export default useLogin