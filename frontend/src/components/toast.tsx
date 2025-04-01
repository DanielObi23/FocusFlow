import { toast, Bounce } from 'react-toastify';

type Notification = {
    type: "success" | "error" | "info",
    message: string,
}
export default function toastMessage(notification: Notification) {
    return (
        toast[notification.type](notification.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        })
    )
}