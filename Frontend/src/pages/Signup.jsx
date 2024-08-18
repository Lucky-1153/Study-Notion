import signupImg from "../assets/Images/signup2.webp"
import Template  from "../components/core/Auth/Template.jsx"
import { useLocation, useParams } from "react-router-dom"

function Signup(){
    const location = useLocation()
    const params = useParams()
    const tab = params.tab
    return (
        <>
        <Template
            title="Join the millions learning to code with StudyNotion for free"
            description1="Build skills for today, tomorrow, and beyond."
            description2="Education to future-proof your career."
            image={signupImg}
            formType="signup"
            tab={tab}
        />
        </>
        
    )
}

export default Signup