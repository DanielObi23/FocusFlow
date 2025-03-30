import { useEffect, useState} from "react"
import axios from "axios"
import { FaInfo } from "react-icons/fa";
import toast from "../../../utils/toast";
import WorkExperience from "./WorkExperience";

interface WorkExperienceItem {
    experience_id: string,
    title: string,
    company: string,
    start_date: string,
    end_date: string,
    experience_category: string,
    description: string
}

type email = {
    email: string | null
}

export default function ExperienceSection({email}: email) {

    const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>([])

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        async function getUserData() {
            if (email) {
                try {
                    const response = await axios.post("/api/profile/userExperience", { email });
                    // the sort is to make sure that the work experience is arranged based of the latest work experience
                    setWorkExperience(response.data.work_experience
                        .sort((a: WorkExperienceItem, b: WorkExperienceItem) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime()));
                } catch (error) {
                    console.error(error);
                }
            }
        }
        getUserData();
    }, []);
    
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        if (endDate && new Date(endDate) <= new Date(e.target.value)) {
            setEndDate('');
        }
    };
    
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    function addExperience() {
        // clearing the input field
        (document.querySelector('input[name="title"]') as HTMLInputElement).value = "";
        (document.querySelector('input[name="company"]') as HTMLInputElement).value = "";
        setStartDate('');
        setEndDate('');
        (document.querySelector('select[name="experience_category"]') as HTMLSelectElement).value = "";
        (document.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value = "";
        const modal = document.getElementById('work_experience-modal');
        if (modal) {
            modal.removeAttribute('data-experience-detail');
            (modal as HTMLDialogElement).show();
        }
    }
    
    async function handleExperience(formData: FormData) {
        try {
            const experienceModalOpen = document.getElementById('work_experience-modal');
            if (experienceModalOpen) {
                (experienceModalOpen as HTMLDialogElement).close();
            }
            const title = formData.get("title")
            const company = formData.get("company")
            const startDate = formData.get("start_date")
            const endDate = formData.get("end_date")
            const experienceCategory = formData.get("experience_category")
            const description = formData.get("description")
    
            const modal = document.getElementById('work_experience-modal');
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
            toast({type: 'error', message: "Server error, please try again later"});
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
            toast({type: 'error', message: "Error deleting experience, please try again later"});
            console.error(err);
        }
    }

    async function editExperience(detail: WorkExperienceItem) {
        const modal = document.getElementById('work_experience-modal');
        if (modal) {
            modal.setAttribute('data-experience-detail', JSON.stringify(detail));
            const formattedStartDate = detail.start_date ? new Date(detail.start_date).toISOString().split('T')[0] : '';
            const formattedEndDate = detail.end_date ? new Date(detail.end_date).toISOString().split('T')[0] : '';
            
            setStartDate(formattedStartDate);
            setEndDate(formattedEndDate);
            const form = modal.querySelector('form') as HTMLFormElement;
            
            if (form) {
                (form.querySelector('input[name="title"]') as HTMLInputElement).value = detail.title;
                (form.querySelector('input[name="company"]') as HTMLInputElement).value = detail.company;
                (form.querySelector('select[name="experience_category"]') as HTMLSelectElement).value = detail.experience_category;
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
        <>
            <fieldset className="border-2 flex gap-4 px-5 pb-7 pt-5 mt-5 flex-col w-full">
                <legend className="font-bold text-2xl lg:text-3xl text-primary">&nbsp;&nbsp;Work experience&nbsp;&nbsp;</legend>
                <div className="flex self-end">
                    <button className="btn btn-sm md:btn-md btn-primary font-semibold" onClick={addExperience}>Add Experience</button>
                    <dialog id="work_experience-modal" className="modal">
                        <div className="modal-box w-full">
                            <form action={handleExperience} className="flex flex-col gap-4 w-full">
                                <label className="input validator w-full">
                                    <span className="label"><span className="font-semibold text-lg">Title:</span></span>
                                    <input type="text" name="title" placeholder="e.g Software developer" required/>
                                </label>

                                <label className="input w-full flex validator">
                                    <span className="label"><span className="font-semibold text-lg">Company:</span></span>
                                    <input type="text" name="company" placeholder="e.g Google" required/>
                                </label>

                                <label className="input validator">
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
                                    <label className="input validator">
                                        <span className="label">End date</span>
                                        <input 
                                            type="date" 
                                            name="end_date"
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            min={startDate}
                                            required
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
                                    <button type="submit" className="btn">Save</button>
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
        </>
    )
} 