export default function SkillToLearn() {
    return (
        <div className="collapse bg-secondary border border-base-300">
            <input type="checkbox" name="path-accordion" />
            <div className="collapse-title font-semibold font-secondary-content flex flex-col justify-center items-center gap-3 bg-neutral">
                <p className="text-neutral-content font-semibold text-xl xl:text-2xl">React Development for Backend Veterans</p>
                <div className="collapse bg-base-100 border-base-300 border w-4/7">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold text-lg text-center">Key Concepts</div>
                    <div className="collapse-content text-sm">
                        <ul className="list-disc list-inside space-y-1 pl-5 marker:text-blue-500">
                            <li>Component-based architecture</li>
                            <li>React Hooks</li>
                            <li>State management</li>
                            <li>JSX</li>
                            <li>React Router</li>
                            <li>API integration</li>
                            <li>Performance optimization</li>
                            <li>Frontend-backend integration</li>
                            <li>Modern JavaScript (ES6+)</li>
                            <li>Single-page applications</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="collapse-content text-sm bg-neutral border-t-4 overflow-auto">
                <table className="table table-zebra min-w-4xl">
                    {/* head */}
                    <thead>
                        <tr>
                            <th className="text-lg xl:text-xl text-secondary">Type</th>
                            <th className="text-center text-lg xl:text-xl text-secondary" colSpan={2}>Phases</th>
                            <th className="text-lg xl:text-xl text-secondary">Free Resources</th>
                            <th className="text-lg xl:text-xl text-secondary">Paid Resources</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* row 1 */}
                    <tr>
                        <th className="text-base">Theory</th>
                        <td colSpan={2}>
                            <div className="flex flex-col gap-2.5 justify-center items-center">
                                <h1 className="flex gap-1 items-center text-lg font-semibold">React Fundamentals & Modern JavaScript</h1>
                                <div className="collapse bg-base-100 border-base-300 border w-5/7">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-semibold text-sm text-center">Objective</div>
                                    <div className="collapse-content text-sm">
                                        <ul className="list-disc list-inside space-y-1 pl-5 marker:text-blue-500">
                                            <li>Understand modern JavaScript features (ES6+)</li>
                                            <li>Learn React component architecture</li>
                                            <li>Master JSX syntax</li>
                                            <li>Understand props and state</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <ul className="list-disc list-outside space-y-3">
                                <li className="underline hover:decoration-accent"><a href="https://scrimba.com/learn/learnreact" target="_blank">Scrimba - Learn React for Free</a></li>
                                <li className="underline hover:decoration-accent"><a href="https://www.freecodecamp.org/learn/front-end-development-libraries/#react" target="_blank">freeCodeCamp - React Course</a></li>
                            </ul>
                        </td>
                        <td>
                            <ul className="list-disc list-outside space-y-3">
                                <li className="underline hover:decoration-accent"><a href="https://scrimba.com/learn/react" target="_blank">Scrimba - The React Bootcamp</a></li>
                            </ul>
                        </td>
                    </tr>

                    {/* row 2 */}
                    <tr>
                        <th className="text-base">Practice</th>
                        <td colSpan={2}>
                            <div className="flex flex-col gap-2.5 justify-center items-center">
                                <h1 className="flex gap-1 items-center text-lg font-semibold">React Hooks & State Management</h1>
                                <div className="collapse bg-base-100 border-base-300 border w-5/7">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-semibold text-sm text-center">Objective</div>
                                    <div className="collapse-content text-sm space-y-3">
                                        <p><span className="text-base underline">Task:</span> Create a full-stack application that integrates your backend expertise with React frontend</p>
                                        <ul className="list-disc list-inside space-y-1 pl-5 marker:text-blue-500">
                                            <li>Implement useState for local component state</li>
                                            <li>Use useEffect for side effects</li>
                                            <li>Create custom hooks</li>
                                            <li>Implement useContext for state sharing</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <ul className="list-disc list-outside space-y-3">
                                <li className="underline hover:decoration-accent"><a href="https://scrimba.com/learn/reacthooks" target="_blank">Scrimba - Learn React Hooks</a></li>
                                <li className="underline hover:decoration-accent"><a href="https://www.freecodecamp.org/news/react-hooks-fundamentals/" target="_blank">freeCodeCamp - React Hooks Tutorial</a></li>
                            </ul>
                        </td>
                        <td>
                            <ul className="list-disc list-outside space-y-3">
                                <li className="underline hover:decoration-accent"><a href="https://www.codecademy.com/learn/react-101" target="_blank">Codecademy - Learn React</a></li>
                            </ul>
                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
    )
}