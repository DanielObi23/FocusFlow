import {phase} from "../../../api/pathsApi"

export default function skillPhase(step: phase) {
    let objective;
    if (step.type === "Theory") {
        objective = step.checklist?.map((task, index) => <li key={`checklist-${index}`}>{task}</li>)
    } else {
        objective = step.practiceDetails?.deliverables.map((task, index) => <li key={`deliverable-${index}`}>{task}</li>)
    }

    const freeResources = step.resources.free.map((resource, index) => (
        <li key={`free-${index}`} className="underline hover:decoration-accent md:text-base">
            <a href={resource.url} target="_blank">{resource.title}</a>
        </li>
    ))

    const paidResources = step.resources.paid.map((resource, index) => (
        <li key={`paid-${index}`} className="underline hover:decoration-accent md:text-base">
            <a href={resource.url} target="_blank">{resource.title}</a>
        </li>
    ))

    return (
        <tr>
            <th className="text-sm md:text-base">{step.type}</th>
            <td colSpan={2}>
                <div className="flex flex-col gap-2.5 justify-center items-center">
                    <h1 className="text-sm md:text-base lg:text-lg font-semibold text-center">{step.title}</h1>
                    <div className="collapse bg-base-100 border-base-300 border w-6/7">
                        <input type="checkbox" />
                        <div className="collapse-title font-bold text-sm text-center ">Objective</div>
                        <div className="collapse-content text-sm border-secondary border-t-2">
                            {step.type === "Practice" && <div className="flex gap-2 mt-2 mb-1"><span className="md:text-base lg:text-lg font-semibold underline">Task:</span><span className="">&nbsp;{step.practiceDetails?.objective}</span></div>}
                            <ul className="list-disc list-outside space-y-1 pl-5 marker:text-blue-500 mt-2">
                                {objective}
                            </ul>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <ul className="list-disc list-outside space-y-3">
                    {freeResources}
                </ul>
            </td>
            <td>
                <ul className="list-disc list-outside space-y-3">
                    {paidResources}
                </ul>
            </td>
        </tr>
    )
}