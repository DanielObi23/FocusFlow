import AppSideBar from "../../components/ProfileSection/AppSideBar";
import axios from "axios";
import toast from "../../components/toast";

export default function Feedback() {
    async function handleSubmit(formData: FormData) {
        try {
            const subject = formData.get("subject");
            const message = formData.get("message");
            const email = localStorage.getItem("email");
            const response = await axios.post(`/api/sendFeedback`, {
                subject,
                message,
                email,
            })

            if (response.status === 200) {
                toast({type:'success', message: "Feedback sent successfully"});
            }
        } catch (err) {
            toast({type:'error', message: "Internal server error, please try again in a few minutes"});
            console.error(err);
        }
    }
    return (
        <AppSideBar>
            <div className="container mx-auto mt-10 md:mt-20 px-4 py-8 w-full">
                <div className="flex flex-col justify-center items-center border-4 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
                    <h1 className="text-3xl sm:text-2xl md:text-5xl lg:text-5xl font-bold text-center mb-6 w-full">Message FocusFlow Team</h1>
                    
                    <form action={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-full">
                    <select name="subject" defaultValue="user issue" className="select w-full md:h-15 md:text-xl" required>
                        <option disabled={true} selected>Select feedback type</option>
                        <option value="Bug issue" className="md:text-base" selected>Bugs</option>
                        <option value="User account issue" className="md:text-base">Account issue</option>
                        <option value="Feature request" className="md:text-base">Feature suggestion</option>
                    </select>
                    
                    <textarea className="textarea w-full field-sizing-content md:text-xl" name="message" placeholder="Message" required></textarea>
                    <button type="submit" className="btn btn-primary w-full mt-4 font-bold">
                        Send Message
                    </button>
                    </form>
                </div>
                </div>
        </AppSideBar>
    )
}