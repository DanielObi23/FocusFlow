import PathSideBar from "../../../components/PathSection/PathSideBar"

export default function LearningPathsPage() {
    function generatePath() {
        return
    }

    return (
        <PathSideBar>
            <div className="p-5 flex flex-col gap-4">
                <div className="flex gap-3">
                    <label className="input">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                        <input type="search" required placeholder="Search"/>
                    </label>
                    <button className="btn" onClick={()=>{
                        const dialog = document.getElementById('gen_learning_path') as HTMLDialogElement;
                        dialog?.showModal();
                    }}>Generate path</button>
                    <dialog id='gen_learning_path' className="modal">
                        <div className="modal-box w-full">
                            <form action={generatePath} className="flex flex-col gap-4">
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend text-base">What skill do you want to learn?</legend>
                                    <input type="text" className="input w-full" placeholder="e.g React, Graphics Design, CopyWriting" />
                                    <p className="fieldset-label text-sm">type just the name</p>
                                </fieldset>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="checkbox" value={"useSkills"}/>
                                    <label className="text-sm">Consider Your Skills</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="checkbox" value={"useExperience"}/>
                                    <label className="text-sm">Consider Your Work Experience</label>
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
                </div>
                <hr />
                <div className="flex flex-col gap-3">
                    <div className="collapse bg-secondary border border-base-300">
                        <input type="radio" name="my-accordion-1" defaultChecked />
                        <div className="collapse-title font-semibold font-secondary-content flex justify-between">
                            <h1>How do I create an account? </h1>
                            <div
                                className="radial-progress bg-primary text-primary-content border-primary border-4"
                                style={{ "--value": "70", "--size": "4rem", "--thickness": "0.5rem" } as React.CSSProperties} aria-valuenow={70} role="progressbar">
                                70%
                            </div>
                        </div>
                        <div className="collapse-content text-sm font-secondary-content">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
                    </div>
                    <div className="collapse bg-secondary border border-base-300">
                        <input type="radio" name="my-accordion-1" />
                        <div className="collapse-title font-semibold font-secondary-content flex justify-between">
                            <h1>I forgot my password. What should I do?</h1> 
                            <div className="radial-progress" style={{ "--value": "70", "--size": "4rem", "--thickness": "0.5rem" } as React.CSSProperties} aria-valuenow={70} role="progressbar">70%</div>
                        </div>
                        <div className="collapse-content text-sm font-secondary-content">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
                    </div>
                    <div className="collapse bg-secondary border border-base-300">
                        <input type="radio" name="my-accordion-1" />
                        <div className="collapse-title font-semibold font-secondary-content">How do I update my profile information?</div>
                        <div className="collapse-content text-sm font-secondary-content">
                            <ul className="steps steps-vertical">
                                <li className="step step-primary">Register</li>
                                <li className="step step-primary">Choose plan</li>
                                <li className="step">Purchase</li>
                                <li className="step">Receive Product</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </PathSideBar>
        )
}