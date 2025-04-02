import SkillPhase from "./SkillPhase"
import {Path} from "../../../api/pathsApi"
export default function SkillToLearn({path}: Path) {
    const keyConcepts = path.keyConcepts.map(concept => <li>{concept}</li>)
    const phases = path.phases.map(phase => <SkillPhase key={phase.order} {...phase} />)
    return (
        <div className="collapse bg-secondary border border-base-300">
            <input type="checkbox" name="path-accordion" />
            <div className="collapse-title font-semibold font-secondary-content flex flex-col justify-center items-center gap-3 bg-neutral">
                <p className="text-neutral-content font-semibold text-xl xl:text-2xl">{path.title}</p>
                <div className="collapse bg-base-100 border-base-300 border w-4/7">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold text-lg text-center">Key Concepts</div>
                    <div className="collapse-content text-sm">
                        <ul className="list-disc list-inside space-y-1 pl-5 marker:text-blue-500">
                            {keyConcepts}
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
                        {phases}
                    </tbody>
                </table>
            </div>
        </div>
    )
}