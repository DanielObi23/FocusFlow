import AppSideBar from "../../../components/ProfileSideBar";
import SkillCard from "../../../components/SkillCard";
import { toast, Bounce } from 'react-toastify';
import axios from "axios"
import {useState, useEffect} from "react"
//import {Link} from "react-router-dom"

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
    const [filteredSkills, setfilteredSkills] = useState(skills)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)
        const filteredItems = skills.filter((skill) =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        
        setfilteredSkills(filteredItems);
    }

    function filterByProficiency(proficiency: string) {
        const filteredItems = skills.filter((skill) =>
            skill.proficiency === proficiency
            );
        //console.log()
        setfilteredSkills(filteredItems);
    }
    
    function filterByType(type: string) {
        const filteredItems = skills.filter((skill) =>
            skill.type === type
            );
        setfilteredSkills(filteredItems);
    }

    useEffect(() => {
        async function fetchSkills() {
            try {
                const response = await axios.post(`/api/profile/skills/getAllSkills`, {email})
                setSkills(response.data);
                setfilteredSkills(response.data);
            } catch (err) {
                toast.error("Failed to load skills", {
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
            }
        }
        fetchSkills();
    }, [email]);

    async function addSkill(formData: FormData) {
        try {
            const modal = document.getElementById('add_skill-modal');
            if (modal) {
                (modal as HTMLDialogElement).close();
            }
            const skillName = formData.get("skill_name")
            const yearsOfExperience = formData.get("years_of_experience")
            const yearsOfExperienceInt = parseInt(yearsOfExperience as string || "0");
            const type = formData.get("type")
            const skillCategory = formData.get("skill_category")
            const proficiency = formData.get("proficiency")
            const description = formData.get("description")

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

            if (response.status === 201) {
                toast.success(`Skill has been added`, {
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
            }
        } catch (error) {
            toast.error(`Server error, please try again later`, {
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
            console.error(error)
        }
    }

    function getSkillList(category: string) {
        // I'm using filtered skills because the default value is equal to skills, when i start filtering, i want the filtered list to change but not the actual skill list
        return {skills: filteredSkills
                    .filter(skill => skill.skill_category === category)
                    .map(skill => <SkillCard key={skill.skill_id} detail={skill} />),
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

    const sectionList = [technicalSkills, designSkills, businessSkills, creativeSkills, languageSkills, physicalSkills, culinarySkills, musicSkills, outdoorSkills, softSkills]

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
            <div className="w-full p-7">
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
                            <button className="btn btn-sm md:btn-md btn-primary font-semibold" onClick={() => {
                                const modal = document.getElementById('add_skill-modal');
                                if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                }
                            }}>Add New Skill</button>
                            <dialog id='add_skill-modal' className="modal p-5">
                                <div className="modal-box w-full">
                                    <form action={addSkill} className="flex flex-col gap-4 w-full">
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
                                        </select>

                                        <fieldset className="fieldset flex gap-5">
                                            <legend className="fieldset-legend text-base">Skill type</legend>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="type" 
                                                    className="radio radio-primary" 
                                                    value={"professional"}
                                                    defaultChecked 
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
                                                const modal = document.getElementById('add_skill-modal');
                                                if (modal) {
                                                    (modal as HTMLDialogElement).close();
                                                }
                                            }}>Cancel</button>
                                            <button type="submit" className="btn">Add skill</button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                        <div className="flex gap-2 items-center overflow-auto px-2 py-1 lg:w-3/5">
                            <button className="btn btn-neutral btn-md" onClick={() => setfilteredSkills(skills)}>All</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("beginner")}>Beginner</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("intermediate")}>Intermediate</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("advanced")}>Advanced</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByProficiency("expert")}>Expert</button>
                            <button className="btn btn-accent focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByType("hobby")}>Hobby</button>
                            <button className="btn btn-accent focus:outline-2 focus:outline-offset-3 btn-sm" onClick={() => filterByType("professional")}>Professional</button>
                        </div>
                    </div>
                    <hr />
                    {section.length > 0? section : <h1 className="text-4xl font-bold text-gray-600 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">No Skills Found</h1>}
                </div>
            </div>
        </AppSideBar>
    )
}