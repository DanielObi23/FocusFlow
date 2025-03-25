import { useEffect, useState } from "react"
import axios from "axios"
import AppSideBar from "../../../components/AppSideBar";
import { FaInfo } from "react-icons/fa";
import { toast, Bounce } from 'react-toastify';
import avatar from "../../../assets/avatar.avif";
import WorkExperience from "../../../components/WorkExperience";

interface UserProfile {
    username: string,
    email: string,
    profile_image_url: string | null,
    created_at: string,
    first_name: string | null,
    last_name: string | null,
    phone_number: string | null,
}

interface WorkExperienceItem {
    experience_id: string,
    title: string,
    company: string,
    start_date: string,
    end_date: string,
    experience_category: string,
    description: string
}

export default function ProfilePage() {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        username: "",
        email: "",
        profile_image_url: null,
        created_at: "",
        first_name: null,
        last_name: null,
        phone_number: null
    })
    const email = localStorage.getItem("email");

    const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>([])

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        async function getUserData() {
            if (email) {
                try {
                    const response = await axios.post("/api/profile/userData", { email });
                    setUserProfile(response.data.profile);
                    setWorkExperience(response.data.work_experience);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        getUserData();
    }, [email]);
    
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        if (endDate && new Date(endDate) <= new Date(e.target.value)) {
            setEndDate('');
        }
    };
    
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            const image = formData.get("image")
            const firstName = formData.get("first_name")
            const lastName = formData.get("last_name")
            const phoneNumber = formData.get("number")
    
            const urlResponse = await axios.get("/api/profile/profileUrl")
            const uploadUrl = urlResponse.data.profile_image_url;
    
            if (image instanceof File) {
                await axios.put(uploadUrl, image, {
                    headers: {
                        'Content-Type': image.type
                    }
                });
    
                const imageUrl = uploadUrl.split('?')[0];
    
                const response = await axios.patch("/api/profile/updateProfile", {
                    imageUrl, 
                    firstName, 
                    lastName, 
                    phoneNumber, 
                    email
                });
    
                setUserProfile(response.data);
                window.location.reload()
            }
        } catch (err) {
            toast.error(`Error updating info, please try again later`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            console.error(err);
        }
    }

    async function handleExperience(formData: FormData) {
        try {
            const title = formData.get("title")
            const company = formData.get("company")
            const startDate = formData.get("start_date")
            const endDate = formData.get("end_date")
            const experienceCategory = formData.get("experience_category")
            const description = formData.get("description")
    
            const modal = document.getElementById('edit-modal');
            const existingDetailStr = modal?.getAttribute('data-experience-detail');
            
            if (existingDetailStr) {
                const existingDetail = JSON.parse(existingDetailStr);
                const workExperienceResponse = await axios.put(`/api/profile/updateWorkExperience/${existingDetail.experience_id}`, {
                    title,
                    company,
                    startDate,
                    endDate,
                    experienceCategory,
                    description,
                    email
                });
    
                setWorkExperience(prev => 
                    prev.map(job => 
                        job.experience_id === existingDetail.experience_id 
                        ? workExperienceResponse.data 
                        : job
                    )
                );
            } else {
                const workExperienceResponse = await axios.post(`/api/profile/addWorkExperience`, {
                    title,
                    company,
                    startDate,
                    endDate,
                    experienceCategory,
                    description,
                    email
                });
                setWorkExperience(prev => [...prev, workExperienceResponse.data]);
            }
    
            const experienceModal = document.getElementById('work_experience-modal') || document.getElementById('edit-modal');
            if (experienceModal) {
                (experienceModal as HTMLDialogElement).close();
            }
    
        } catch (err) {
            toast.error(`Error updating experience, please try again later`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            console.error(err);
        }
    }

    async function deleteExperience(id: string) {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.setAttribute('data-experience-id', id);
            (modal as HTMLDialogElement).showModal();
        }
    }

    async function handleConfirmedDelete() {
        const modal = document.getElementById('delete-modal');
        if (!modal) return;

        const experienceId = modal.getAttribute('data-experience-id');
        if (!experienceId) return;

        try {
            await axios.delete(`/api/profile/deleteWorkExperience/${experienceId}`);

            setWorkExperience(prev => 
                prev.filter(job => job.experience_id !== experienceId)
            );
            (modal as HTMLDialogElement).close();
        } catch (err) {
            toast.error(`Error deleting experience, please try again later`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            console.error(err);
        }
    }

    async function editExperience(detail: WorkExperienceItem) {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.setAttribute('data-experience-detail', JSON.stringify(detail));
            
            const form = modal.querySelector('form') as HTMLFormElement;
            
            if (form) {
                (form.querySelector('input[name="title"]') as HTMLInputElement).value = detail.title;
                (form.querySelector('input[name="company"]') as HTMLInputElement).value = detail.company;
                (form.querySelector('input[name="start_date"]') as HTMLInputElement).value = detail.start_date;
                (form.querySelector('input[name="end_date"]') as HTMLInputElement).value = detail.end_date || '';
                
                const categorySelect = form.querySelector('select[name="experience_category"]') as HTMLSelectElement;
                categorySelect.value = detail.experience_category;
                
                (form.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value = detail.description;
            }
            
            (modal as HTMLDialogElement).showModal();
        }
    }

    const workExperienceList = workExperience.map(job => {
        return <WorkExperience key={job.experience_id} detail={{
            experience_id: job.experience_id,
            jobTitle: job.title,
            companyName: job.company,
            startDate: job.start_date,
            endDate: job.end_date,
            experienceCategory: job.experience_category,
            roleDescription: job.description,
            delete: () => deleteExperience(job.experience_id),
            edit: () => editExperience(job)
        }}/>
    });

    return (
        <AppSideBar>
            <div className="flex items-center justify-center flex-col gap-5">
                <div className="flex justify-between items-center border-2 p-7 w-2/3 mt-5 flex-col gap-4">
                    <div className="flex justify-between w-full">
                        <div className="flex">
                            <div className="avatar flex flex-col">
                                <div className="w-24 rounded-full">
                                    <img 
                                        src={userProfile.profile_image_url && userProfile.profile_image_url.length > 0 ? userProfile.profile_image_url : avatar} 
                                        alt="Profile" 
                                    />
                                </div>
                            </div>
                            <div className="ml-4 self-center">
                                <h1 className="font-bold text-start text-primary text-lg capitalize">{userProfile.username}</h1>
                                <p>Member since {new Date(userProfile.created_at).toDateString()}</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button className="btn btn-primary font-semibold" onClick={() => {
                                const modal = document.getElementById('profile-modal');
                                if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                }
                            }}>Edit Info</button>
                            <dialog id="profile-modal" className="modal">
                                <div className="modal-box w-full">
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                                        <div className="flex gap-1">
                                            <input type="file" name="image" className="file-input w-full" /> 
                                            <div className="tooltip tooltip-left" data-tip="Profile image">
                                                <p className="btn"><FaInfo /></p>
                                            </div>
                                        </div>

                                        <label className="input w-full">
                                            <span className="label"><span className="font-semibold text-lg">First name:</span></span>
                                            <input type="text" name="first_name" placeholder="e.g John" defaultValue={userProfile.first_name || ""} />
                                        </label>

                                        <label className="input w-full">
                                            <span className="label"><span className="font-semibold text-lg">Last name:</span></span>
                                            <input type="text" name="last_name" placeholder="e.g Smith" defaultValue={userProfile.last_name || ""}/>
                                        </label>

                                        <label className="input w-full">
                                            <span className="label"><span className="font-semibold text-lg">Contact:</span></span>
                                            <input type="tel" name="number" placeholder="+44 7800 000000" defaultValue={userProfile.phone_number || ""}/>
                                        </label>
                                        <div className="w-full flex justify-between">
                                            <button type="button" className="btn" onClick={()=>{
                                                const modal = document.getElementById('profile-modal');
                                                if (modal) {
                                                    (modal as HTMLDialogElement).close();
                                                }
                                            }}>Cancel</button>
                                            <button type="submit" className="btn">Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                    </div>
                    <div className="flex p-7 w-full justify-between font-semibold gap-3">
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;First name&nbsp;&nbsp;</legend>
                            <p className="text-accent italic capitalize">{userProfile.first_name || "Add your first name"}</p>
                        </fieldset>
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;Last name&nbsp;&nbsp;</legend>
                            <p className="text-accent italic capitalize">{userProfile.last_name || "Add your last name"}</p>
                        </fieldset>
                    </div>
                    <div className="flex p-7 w-full justify-between font-semibold gap-3">
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;Email&nbsp;&nbsp;</legend>
                            <p className="text-accent italic">{userProfile.email}</p>
                        </fieldset>
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;Phone number&nbsp;&nbsp;</legend>
                            <p className="text-accent italic">{userProfile.phone_number || "Add your contact number"}</p>
                        </fieldset>
                    </div>
                </div>

                <fieldset className="border-2 p-7 w-2/3 flex flex-col gap-3">
                    <legend className="font-bold text-2xl text-primary">&nbsp;&nbsp;Work experience&nbsp;&nbsp;</legend>
                    <div className="flex self-end">
                        <button className="btn btn-primary font-semibold" onClick={() => {
                            const modal = document.getElementById('work_experience-modal');
                            if (modal) {
                                (modal as HTMLDialogElement).showModal();
                            }
                        }}>Add Experience</button>
                        <dialog id="work_experience-modal" className="modal">
                            <div className="modal-box w-full">
                                <form action={handleExperience} className="flex flex-col gap-4 w-full">
                                    <label className="input w-full">
                                        <span className="label"><span className="font-semibold text-lg">Title:</span></span>
                                        <input type="text" name="title" placeholder="e.g Software developer" required/>
                                    </label>

                                    <label className="input w-full flex">
                                        <span className="label"><span className="font-semibold text-lg">Company:</span></span>
                                        <input type="text" name="company" placeholder="e.g Google" />
                                    </label>

                                    <label className="input">
                                        <span className="label">Start date</span>
                                        <input 
                                            type="date" 
                                            name="start_date" 
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            required
                                        />
                                    </label>

                                    <div className="flex gap-1.5">
                                        <label className="input">
                                            <span className="label">End date</span>
                                            <input 
                                                type="date" 
                                                name="end_date"
                                                value={endDate}
                                                onChange={handleEndDateChange}
                                                min={startDate}
                                            />
                                        </label>
                                        <div className="tooltip tooltip-left" data-tip="Select today if current job">
                                            <p className="btn"><FaInfo /></p>
                                        </div>
                                    </div>

                                    <select defaultValue="" className="select w-full" name="experience_category" required>
                                        <option value="" disabled>Select the type of experience</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Intern">Intern</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Volunteer">Volunteer</option>
                                        <option value="Hobby">Hobby</option>
                                    </select>

                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Your role</legend>
                                        <textarea className="textarea w-full field-sizing-content" placeholder="Description" name="description"></textarea>
                                        <div className="fieldset-label">Optional but recommended</div>
                                    </fieldset>

                                    <div className="w-full flex justify-between">
                                        <button type="button" className="btn" onClick={()=>{
                                            const modal = document.getElementById('work_experience-modal');
                                            if (modal) {
                                                (modal as HTMLDialogElement).close();
                                            }
                                        }}>Cancel</button>
                                        <button type="submit" className="btn" onClick={()=>{
                                            const modal = document.getElementById('work_experience-modal');
                                            if (modal) {
                                                (modal as HTMLDialogElement).close();
                                        }}}>Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </dialog>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                        {workExperienceList}
                    </ul>
                </fieldset>
                <dialog id="delete-modal" className="modal">
                    <div className="modal-box w-full">
                        <div className="flex flex-col gap-2.5">
                            <p className="text-lg text-primary">Are you sure you want to delete this experience?</p>
                            <p className="text-sm text-gray-600">This action cannot be undone.</p>
                        </div>
                        <div className="w-full flex justify-between mt-4">
                            <button 
                                type="button" 
                                className="btn" 
                                onClick={() => {
                                    const modal = document.getElementById('delete-modal');
                                    if (modal) {
                                        (modal as HTMLDialogElement).close();
                                    }
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-error" 
                                onClick={handleConfirmedDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </dialog>
                <dialog id="edit-modal" className="modal">
                    <div className="modal-box w-full">
                        <form action={handleExperience} className="flex flex-col gap-4 w-full">
                            <label className="input w-full">
                                <span className="label"><span className="font-semibold text-lg">Title:</span></span>
                                <input type="text" name="title" placeholder="e.g Software developer" required/>
                            </label>

                            <label className="input w-full flex">
                                <span className="label"><span className="font-semibold text-lg">Company:</span></span>
                                <input type="text" name="company" placeholder="e.g Google" />
                            </label>

                            <label className="input">
                                <span className="label">Start date</span>
                                <input 
                                    type="date" 
                                    name="start_date" 
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    required
                                />
                            </label>

                            <div className="flex gap-1.5">
                                <label className="input">
                                    <span className="label">End date</span>
                                    <input 
                                        type="date" 
                                        name="end_date"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        min={startDate}
                                    />
                                </label>
                                <div className="tooltip tooltip-left" data-tip="Select today if current job">
                                    <p className="btn"><FaInfo /></p>
                                </div>
                            </div>

                            <select defaultValue="" className="select w-full" name="experience_category" required>
                                <option value="" disabled>Select the type of experience</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Intern">Intern</option>
                                <option value="Contract">Contract</option>
                                <option value="Volunteer">Volunteer</option>
                                <option value="Hobby">Hobby</option>
                            </select>

                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Your role</legend>
                                <textarea className="textarea w-full field-sizing-content" placeholder="Description" name="description"></textarea>
                                <div className="fieldset-label">Optional but recommended</div>
                            </fieldset>

                            <div className="w-full flex justify-between">
                                <button type="button" className="btn" onClick={()=>{
                                    const modal = document.getElementById('edit-modal');
                                    if (modal) {
                                        (modal as HTMLDialogElement).close();
                                    }
                                }}>Cancel</button>
                                <button type="submit" className="btn" onClick={()=>{
                                    const modal = document.getElementById('edit-modal');
                                    if (modal) {
                                        (modal as HTMLDialogElement).close();
                                }}}>Save changes</button>
                            </div>
                        </form>
                    </div>
                </dialog>
                <div className="w-2/3 mb-4.5">
                    <div className="divider divider-error text-error">Danger Zone</div>
                    <button className="btn btn-error w-full">DELETE ACCOUNT</button>
                </div>
            </div>
        </AppSideBar>
    )
}