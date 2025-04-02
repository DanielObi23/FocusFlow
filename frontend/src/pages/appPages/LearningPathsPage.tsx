import AppSideBar from "../../components/ProfileSection/AppSideBar"
import SkillToLearn from "../../components/ProfileSection/learningPathsPage/SkillToLearn"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query" 
import { generatePath, getPaths, Path } from "../../api/pathsApi"
import TruckLoader from "../../components/TruckLoader"
import toast from "../../components/toast";

export default function LearningPathsPage() {
    const queryClient = useQueryClient();
    const { data: learningPaths, isLoading, error } = useQuery({
        queryKey: ['learningPaths'],
        queryFn: getPaths,
        staleTime: Infinity,
        retry: 4
    })
    if (error) toast({type:'error', message: "Error fetching learning paths"});

    const { mutate: createPath, isPending: isPathCreationPending } = useMutation({
        mutationFn: (formData: FormData) => generatePath(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['learningPaths']});
            toast({type:'success', message: "Learning Path generated successfully!"});
        },
        onError: (error) => {
            toast({ type: 'error', message: "Failed to generate path" });
            console.error(error);
        },
    }) 

    const paths = learningPaths?.map((skillPath: Path) => (
        <SkillToLearn 
            key={skillPath.learning_path_id} 
            learning_path_id={skillPath.learning_path_id} 
            path={skillPath.path} 
        />
    ));

    return (
        <AppSideBar>
            { isLoading ? <TruckLoader /> : <div className="p-5 flex flex-col gap-4">

                {isPathCreationPending? 
                <button className="btn text-2xl text-bold py-10 text-accent" disabled>Generating path...</button> : 
                <button className="btn text-2xl text-bold py-10" onClick={()=>{
                    const dialog = document.getElementById('gen_learning_path') as HTMLDialogElement;
                    dialog?.showModal();
                }}>Generate path</button>}

                <dialog id='gen_learning_path' className="modal">
                    <div className="modal-box w-full">
                        <form action={createPath} className="flex flex-col gap-4">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend text-base">What skill do you want to learn?</legend>
                                <input type="text" className="input w-full" name="skill_name" placeholder="e.g React, Graphics Design, CopyWriting" required/>
                                <p className="fieldset-label text-sm">type just the name</p>
                            </fieldset>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend text-base">Skill Category</legend>
                                <select defaultValue="" className="select w-full" name="skill_category" required>
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
                                <p className="fieldset-label text-sm">the more accurate the skill category, the better the response</p>
                            </fieldset>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" className="checkbox" name="use_skills" id="use_skills"/>
                                <label htmlFor="use_skills" className="text-sm">Consider Your Skills</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" className="checkbox" name="use_experience" id="use_experience"/>
                                <label htmlFor="use_experience" className="text-sm">Consider Your Work Experience</label>
                            </div>
                            <div className="flex justify-between">
                                <button className="btn" onClick={()=>{
                                    const dialog = document.getElementById('gen_learning_path') as HTMLDialogElement;
                                    dialog?.close();
                                }}>cancel</button>
                                <button type="submit" className="btn" onClick={()=>{
                                    const dialog = document.getElementById('gen_learning_path') as HTMLDialogElement;
                                    dialog?.close();
                                }}>submit</button>
                            </div>
                        </form>
                    </div>
                </dialog>

                <hr />
                <div className="flex flex-col gap-3">
                    {paths}
                </div>
            </div>}
        </AppSideBar>
        )
}