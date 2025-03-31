import AppSideBar from "../../components/ProfileSection/AppSideBar";
import SkillCard from "../../components/ProfileSection/skillsPage/SkillCard";
import toast from "../../utils/toast";
import axios from "axios"
import {useState, useEffect, useRef} from "react"

interface Skills {
    name: string;
    years_of_experience: number;
    type: string;
    skill_category: string;
    proficiency: string;
    description: string;
    created_at: string;
    skill_id: string;
}
export default function SkillsPage() {
    const email = localStorage.getItem('email');
    const [skills, setSkills] = useState<Skills[]>([]);
    const [searchItem, setSearchItem] = useState('')
    const [filteredSkills, setFilteredSkills] = useState(skills)
    const [render, forceReRender] = useState(0); // page wasn't rerendering when skill state was changed
    const [loading, setLoading] = useState(true);
    const skillPage = useRef(null)

    useEffect(() => {
        if (skillPage.current) {
            (skillPage.current as HTMLElement).scrollIntoView({ behavior: 'smooth' })
        }
      }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)
        const filteredItems = skills.filter((skill) =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        
        setFilteredSkills(filteredItems);
    }

    function filterByProficiency(proficiency: string) {
        const filteredItems = skills.filter((skill) =>
            skill.proficiency === proficiency
            );
        setFilteredSkills(filteredItems);
    }
    
    function filterByType(type: string) {
        const filteredItems = skills.filter((skill) =>
            skill.type === type
            );
        setFilteredSkills(filteredItems);
    }

    useEffect(() => {
        async function fetchSkills() {
            try {
                const response = await axios.post(`/api/profile/skills/getAllSkills`, {email})
                setSkills(response.data);
                setFilteredSkills(response.data);
                setLoading(false);
            } catch (err) {
                toast({type: 'error', message: "Failed to load skills"})
            }
        }
        fetchSkills();
    }, [render]);

    function addSkill() {
        // clearing the input field
        (document.querySelector('input[name="skill_name"]') as HTMLInputElement).value = "";
        (document.querySelector('input[name="years_of_experience"]') as HTMLInputElement).value = "";
        const typeInput = document.querySelector(`input[name="type"][value="professional"]`) as HTMLInputElement;
        if (typeInput) {
            typeInput.checked = true;
        }
        const proficiencyInput = document.querySelector(`input[name="proficiency"][value="beginner"]`) as HTMLInputElement;
        if (proficiencyInput) {
            proficiencyInput.checked = true;
        }
        (document.querySelector('select[name="skill_category"]') as HTMLSelectElement).value = "";
        (document.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value = "";
        const modal = document.getElementById('skill-modal');
        if (modal) {
            modal.removeAttribute('data-experience-detail');
            (modal as HTMLDialogElement).show();
        }
    }
    
    async function handleSkill(formData: FormData) {
        try {
            const userSkillModal = document.getElementById('skill-modal');
            if (userSkillModal) {
                (userSkillModal as HTMLDialogElement).close();
            }
            const skillName = formData.get("skill_name")
            const yearsOfExperience = formData.get("years_of_experience")
            const yearsOfExperienceInt = parseInt(yearsOfExperience as string || "0");
            const type = formData.get("type")
            const skillCategory = formData.get("skill_category")
            const proficiency = formData.get("proficiency")
            const description = formData.get("description")
    
            const existingDetailStr = userSkillModal?.getAttribute('data-experience-detail');
            if (existingDetailStr) {
                const existingDetail = JSON.parse(existingDetailStr);
                const skillUpdateResponse = await axios.put(`/api/profile/skills/updateSkill/${existingDetail.skill_id}`, {
                    skillName,
                    yearsOfExperienceInt,
                    type,
                    skillCategory,
                    proficiency,
                    description
                });
    
                setSkills(prev => 
                    prev.map(skill => 
                        skill.skill_id === existingDetail.skill_id 
                        ? skillUpdateResponse.data 
                        : skill
                    )
                );
                forceReRender(prev => prev + 1);
            } else {
                const response = await axios.post("/api/profile/skills/addSkill", {
                    skillName,
                    yearsOfExperienceInt,
                    type,
                    skillCategory,
                    proficiency,
                    description,
                    email
                });
    
                setSkills([...skills, response.data]);
                forceReRender(prev => prev + 1);
                toast({type:'success', message: "Skill added successfully"})
            }
    
            const skillModal = document.getElementById('skill-modal');
            if (skillModal) {
                (skillModal as HTMLDialogElement).close();
            }
    
        } catch (err) {
            toast({type: 'error', message: "Error updating experience, please try again later"});
            console.error(err);
        }
    }

    
    async function editSKill(detail: Skills) {
        const modal = document.getElementById('skill-modal');
        if (modal) {
            modal.setAttribute('data-experience-detail', JSON.stringify(detail));
            
            const form = modal.querySelector('form') as HTMLFormElement;
            
            if (form) {
                (form.querySelector('input[name="skill_name"]') as HTMLInputElement).value = detail.name;
                (form.querySelector('input[name="years_of_experience"]') as HTMLInputElement).value = detail.years_of_experience.toString();
                const typeInput = form.querySelector(`input[name="type"][value="${detail.type}"]`) as HTMLInputElement;
                if (typeInput) {
                    typeInput.checked = true;
                }
                const proficiencyInput = form.querySelector(`input[name="proficiency"][value="${detail.proficiency}"]`) as HTMLInputElement;
                if (proficiencyInput) {
                    proficiencyInput.checked = true;
                }
                (form.querySelector('select[name="skill_category"]') as HTMLSelectElement).value = detail.skill_category;
                (form.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value = detail.description;
            }
            
            (modal as HTMLDialogElement).showModal();
        }
    }

    async function deleteSkill(id: string) {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.setAttribute('data-experience-id', id);
            (modal as HTMLDialogElement).showModal();
        }
    }

    async function handleConfirmedDelete() {
        const modal = document.getElementById('delete-modal');
        if (!modal) return;

        const skillId = modal.getAttribute('data-experience-id');
        if (!skillId) return;

        try {
            const response = await axios.delete(`/api/profile/skills/deleteSkill/${skillId}`);
            setSkills(response.data);
            forceReRender(prev => prev + 1);
            (modal as HTMLDialogElement).close();
        } catch (err) {
            toast({type: 'error', message: "Error deleting experience, please try again later"});
            console.error(err);
        }
    }


    function getSkillList(category: string) {
        // I'm using filtered skills because the default value is equal to skills, when i start filtering, i want the filtered list to change but not the actual skill list
        return {skills: filteredSkills
                    .filter(skill => skill.skill_category === category)
                    .map(skill => <SkillCard
                                     key={skill.skill_id}
                                     detail={skill} 
                                     deleteSkill={deleteSkill}
                                     handleEditSkill={editSKill}
                                     />),
                categoryName: category
        }
    }

    const technicalSkills = getSkillList("Technical Skills")
    const designSkills = getSkillList("Design Skills")
    const businessSkills = getSkillList("Business & Management")
    const creativeSkills = getSkillList("Creative Skills")
    const languageSkills = getSkillList("Languages")
    const physicalSkills = getSkillList("Physical & Wellness")
    const culinarySkills = getSkillList("Culinary Skills")
    const musicSkills = getSkillList("Music & Performance")
    const outdoorSkills = getSkillList("Outdoor & Adventure")
    const softSkills = getSkillList("Soft Skills")
    const otherSkills = getSkillList("Other")

    const sectionList = [technicalSkills, designSkills, businessSkills, creativeSkills, languageSkills, physicalSkills, culinarySkills, musicSkills, outdoorSkills, softSkills, otherSkills]

    const section = sectionList
                .filter(section => section.skills.length > 0)
                .map((section) => (
                    <div className="flex flex-col gap-2" key={section.categoryName}>
                        <h1 className="self-start text-2xl font-bold text-primary">{section.categoryName}</h1>
                        <div className="w-full flex gap-2.5 overflow-auto p-2">
                            {section.skills}
                        </div>
                    </div>
                ));
    
            
    return (
        <AppSideBar>
            <div ref={skillPage} className="w-full p-7">
                <div className="w-full border-2 p-7 flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="flex gap-2 items-center w-full lg:w-3/5">
                            <label className="input w-5/7 ">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                                <input
                                    type="search"
                                    value={searchItem}
                                    onChange={handleInputChange}
                                    placeholder='Search'
                                />
                            </label>
                            <button className="btn btn-sm md:btn-md btn-primary font-semibold" onClick={addSkill}>Add New Skill</button>
                            <dialog id='skill-modal' className="modal p-5">
                                <div className="modal-box w-full">
                                    <form action={handleSkill} className="flex flex-col gap-4 w-full">
                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend text-base">Skill Name</legend>
                                            <input type="text" className="input w-full validator" name="skill_name" maxLength={30} placeholder="e.g TypeScript, Adobe XD, Blender" required/>
                                        </fieldset>
                                        
                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend text-base">Years of Experience</legend>
                                            <input type="number" name="years_of_experience" className="input w-full validator" placeholder="e.g. 3, 5, 10" min="0" max="90" required/>
                                            <p className="validator-hint">Must be between be 0 to 100</p>
                                        </fieldset>

                                        <select defaultValue="" className="select w-full" name="skill_category" required>
                                            <option value="" disabled>Select skill category</option>
                                            <option value="Technical Skills">Technical Skills</option>
                                            <option value="Design Skills">Design Skills</option>
                                            <option value="Business & Management">Business & Management</option>
                                            <option value="Creative Skills">Creative Skills</option>
                                            <option value="Languages">Languages</option>
                                            <option value="Physical & Wellness">Physical & Wellness</option>
                                            <option value="Culinary Skills">Culinary Skills</option>
                                            <option value="Music & Performance">Music & Performance</option>
                                            <option value="Outdoor & Adventure">Outdoor & Adventure</option>
                                            <option value="Soft Skills">Soft Skills</option>
                                            <option value="Other">Other</option>
                                        </select>

                                        <fieldset className="fieldset flex gap-5">
                                            <legend className="fieldset-legend text-base">Skill type</legend>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="type" 
                                                    className="radio radio-primary" 
                                                    value={"professional"}
                                                />
                                                <label className="text-sm">Professional</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="type" 
                                                    value={"hobby"}
                                                    className="radio radio-primary" 
                                                />
                                                <label className="text-sm">Hobby</label>
                                            </div>
                                        </fieldset>

                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend text-base">Proficiency Level</legend>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary" 
                                                    value={"beginner"}
                                                    defaultChecked 
                                                />
                                                <label className="text-sm">Beginner</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary"
                                                    value={"intermediate"} 
                                                />
                                                <label className="text-sm">Intermediate</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary" 
                                                    value={"advanced"}
                                                />
                                                <label className="text-sm">Advanced</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary" 
                                                    value={"expert"}
                                                />
                                                <label className="text-sm">Expert</label>
                                            </div>
                                        </fieldset>
                                        
                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend text-base">Short Description</legend>
                                            <textarea className="textarea w-full field-sizing-content" placeholder="Brief notes about your experience" name="description"></textarea>
                                            <div className="fieldset-label">Optional but recommended</div>
                                        </fieldset>

                                        <div className="w-full flex justify-between">
                                            <button type="button" className="btn" onClick={()=>{
                                                const modal = document.getElementById('skill-modal');
                                                if (modal) {
                                                    (modal as HTMLDialogElement).close();
                                                }
                                            }}>Cancel</button>
                                            <button type="submit" className="btn">Save skill</button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                        <div className="flex gap-2 items-center overflow-auto px-2 py-1 lg:w-3/5">
                            <button className="btn btn-neutral btn-md" onClick={() => setFilteredSkills(skills)}>All</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("beginner")}>Beginner</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("intermediate")}>Intermediate</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("advanced")}>Advanced</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("expert")}>Expert</button>
                            <button className="btn btn-accent focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByType("hobby")}>Hobby</button>
                            <button className="btn btn-accent focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByType("professional")}>Professional</button>
                        </div>
                    </div>
                    <hr />
                    {loading?
                        <h1 className="text-4xl font-bold text-gray-600 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">Searching For Skills</h1> :
                        (section.length > 0? section : <h1 className="text-4xl font-bold text-gray-600 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">No Skill Found</h1>)}
                </div>
                <dialog id="delete-modal" className="modal">
                    <div className="modal-box w-full">
                        <div className="flex flex-col gap-2.5">
                            <p className="text-lg text-primary">Are you sure you want to delete this skill?</p>
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
            </div>
        </AppSideBar>
    )
}