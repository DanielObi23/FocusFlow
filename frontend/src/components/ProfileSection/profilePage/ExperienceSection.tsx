import { useState } from "react"
import { FaInfo } from "react-icons/fa";
import toast from "../../toast";
import WorkExperience from "./WorkExperience";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserExperience, deleteUserExperience, editUserExperience, addUserExperience, WorkExperienceItem, ExperienceItem } from "../../../api/ExperienceApi"
import TruckLoader from "../../TruckLoader";

export default function ExperienceSection() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const queryClient = useQueryClient();

    const { data: workExperience, isLoading: experienceIsLoading } = useQuery({
        queryKey: ["workExperience"],
        queryFn: getUserExperience,
        staleTime: Infinity
    })

    const { mutate: deleteExperienceDetails } = useMutation({
        mutationFn: (experienceId: string) => deleteUserExperience(experienceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workExperience"] });
            const modal = document.getElementById('delete-modal');
            if (!modal) return;
            (modal as HTMLDialogElement).close();
        },
        onMutate: async (experienceId: string) => {
            await queryClient.cancelQueries({ queryKey: ["workExperience"] })
            const previousList = queryClient.getQueryData(["workExperience"])
            queryClient.setQueryData<WorkExperienceItem[]>(["workExperience"], (old) => 
                old ? old.filter((item) => item.experience_id !== experienceId) : []
            );
            const modal = document.getElementById('delete-modal');
            if (!modal) return;
            (modal as HTMLDialogElement).close();
            return { previousList };
        },
        onError: (error) => {
            toast({ type: 'error', message: "Failed to delete experience" });
            console.error(error);
          },
    })
    
    const { mutate: editExperienceDetails } = useMutation({
        mutationFn: (experience: ExperienceItem) => editUserExperience(experience),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workExperience"] });
            const modal = document.getElementById('edit-modal');
            if (!modal) return;
            (modal as HTMLDialogElement).close();
        },
        onError: (error) => {
            toast({ type: 'error', message: "Failed to update experience" });
            console.error(error);
        },
        onMutate: async (experience: ExperienceItem) => {
            await queryClient.cancelQueries({ queryKey: ["workExperience"] })
            const previousList = queryClient.getQueryData(["workExperience"])
            queryClient.setQueryData<WorkExperienceItem[]>(["workExperience"], (old) => 
                old ? old.map(item => {
                    return item.experience_id === experience.experience_id ? 
                        {...item, ...experience} as WorkExperienceItem : item;
                }) : []
            );
            const modal = document.getElementById('edit-modal');
            if (!modal) return;
            (modal as HTMLDialogElement).close();
            return { previousList };
        }
    })

    const { mutate: addExperienceDetails } = useMutation({
        mutationFn: (experience: ExperienceItem) => addUserExperience(experience),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workExperience"] });
            const modal = document.getElementById('work_experience-modal');
            if (!modal) return;
            (modal as HTMLDialogElement).close();
        },
        onError: (error) => {
            toast({ type: 'error', message: "Failed to add experience" });
            console.error(error);
        },
        onMutate: async (experience: ExperienceItem) => {
            await queryClient.cancelQueries({ queryKey: ["workExperience"] })
            const previousList = queryClient.getQueryData(["workExperience"]) || []
            queryClient.setQueryData<WorkExperienceItem[]>(["workExperience"], (old) => {
                if (!old) return [];
                
                const newList = [...old, {
                    experience_id: "temporary", 
                    title: experience.title,
                    company: experience.company,
                    start_date: experience.startDate,
                    end_date: experience.endDate,
                    experience_category: experience.experienceCategory,
                    description: experience.description
                } as WorkExperienceItem];
                
                return newList.sort((a, b) => 
                    new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
                );
            });
            const modal = document.getElementById('edit-modal');
            if (!modal) return;
            (modal as HTMLDialogElement).close();
            return { previousList };
        }
    })
    
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
    
    function handleExperience(formData: FormData) {
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
                const {experience_id} = JSON.parse(existingDetailStr);
                editExperienceDetails({
                    experience_id,
                    title,
                    company,
                    startDate,
                    endDate,
                    experienceCategory,
                    description
                })
    
    
            } else {
                addExperienceDetails({
                    title,
                    company,
                    startDate,
                    endDate,
                    experienceCategory,
                    description
                })
            }
    
        } catch (err) {
            toast({type: 'error', message: "Server error, please try again later"});
            console.error(err);
        }
    }

    function deleteExperience(id: string) {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.setAttribute('data-experience-id', id);
            (modal as HTMLDialogElement).showModal();
        }
    }

    function handleConfirmedDelete() {
        const experienceId = document.getElementById('delete-modal')?.getAttribute('data-experience-id');
        if (!experienceId) return;

        deleteExperienceDetails(experienceId as string);
    }

    function editExperience(detail: WorkExperienceItem) {
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

    interface WorkExperienceDetail {
        experience_id: string;
        jobTitle: string;
        companyName: string;
        startDate: string;
        endDate: string;
        experienceCategory: string;
        roleDescription: string;
        delete: () => void;
        edit: () => void;
    }

    const workExperienceList = workExperience && workExperience.length > 0 
        ? workExperience.map((job: WorkExperienceItem) => {
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
            } as WorkExperienceDetail}/>
        })
        : [];

    return (
        <>
            <fieldset className="border-2 flex gap-4 px-5 pb-7 pt-5 mt-5 flex-col w-full">
                {experienceIsLoading ? <TruckLoader /> :<>
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
                </ul></>}
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