import AppSideBar from "../../../components/ProfileSideBar";
import SkillCard from "../../../components/SkillCard";
export default function SkillsPage() {
    function addSkill() {
        // Add skill logic here
        console.log('Adding skill');
    }
    return (
        <AppSideBar>
            <div className="w-full p-7">
                <div className="w-full border-2 p-7 flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="flex gap-2 items-center w-full lg:w-3/5">
                            <label className="input w-5/7 ">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                                <input type="search" required placeholder="Search"/>
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
                                            <input type="text" className="input w-full" placeholder="e.g TypeScript, Adobe XD, Blender" />
                                        </fieldset>
                                        
                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend text-base">Years of Experience</legend>
                                            <input type="number" className="input w-full" placeholder="e.g. 3, 5, 10" min="0" />
                                        </fieldset>

                                        <select defaultValue="" className="select w-full" name="professional_skill_category" required>
                                            <option value="" disabled>Select skill category</option>
                                            <option value="TechnicalSkills">Technical Skills</option>
                                            <option value="DesignSkills">Design Skills</option>
                                            <option value="BusinessManagement">Business & Management</option>
                                            <option value="CreativeSkills">Creative Skills</option>
                                            <option value="Languages">Languages</option>
                                            <option value="PhysicalAndWellness">Physical & Wellness</option>
                                            <option value="CulinarySkills">Culinary Skills</option>
                                            <option value="SoftSkills">Soft Skills</option>
                                        </select>

                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend text-base">Proficiency Level</legend>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary" 
                                                    defaultChecked 
                                                />
                                                <label className="text-sm">Beginner</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary" 
                                                />
                                                <label className="text-sm">Intermediate</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary" 
                                                />
                                                <label className="text-sm">Advanced</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="radio" 
                                                    name="proficiency" 
                                                    className="radio radio-primary" 
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
                                            <button type="submit" className="btn" onClick={()=>{
                                                const modal = document.getElementById('add_skill-modal');
                                                if (modal) {
                                                    (modal as HTMLDialogElement).close();
                                            }}}>Add skill</button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                        <div className="flex gap-2 items-center overflow-auto px-2 py-1 lg:w-3/5">
                            <button className="btn btn-neutral btn-md">All</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm">Beginner</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm">Intermediate</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm">Advanced</button>
                            <button className="btn btn-secondary focus:outline-2 focus:outline-offset-3 btn-sm">Expert</button>
                        </div>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2">
                        <h1 className="self-start text-lg font-bold">Technical Skills</h1>
                        <div className="w-full flex gap-2.5 overflow-auto">
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="self-start text-lg font-bold">Design Skills</h1>
                        <div className="w-full flex gap-2.5 overflow-auto">
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="self-start text-lg font-bold">Business Management</h1>
                        <div className="w-full flex gap-2.5 overflow-auto">
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                            <SkillCard />
                        </div>
                    </div>
                </div>
            </div>
        </AppSideBar>
    )
}