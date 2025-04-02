import {phase} from "../../../api/pathsApi"

export default function skillPhase(step: phase) {
    let objective;
    if (step.type === "Theory") {
        objective = step.checklist?.map(task => <li>{task}</li>)
    } else {
        objective = step.practiceDetails?.deliverables.map(task => <li>{task}</li>)
    }

    const freeResources = step.resources.free.map(resource => <li className="underline hover:decoration-accent">
        <a href={resource.url} target="_blank">{resource.title}</a></li>)

    const paidResources = step.resources.paid.map(resource => <li className="underline hover:decoration-accent">
        <a href={resource.url} target="_blank">{resource.title}</a></li>)

    return (
        <tr>
            <th className="text-base">{step.type}</th>
            <td colSpan={2}>
                <div className="flex flex-col gap-2.5 justify-center items-center">
                    <h1 className="flex gap-1 items-center text-lg font-semibold">{step.title}</h1>
                    <div className="collapse bg-base-100 border-base-300 border w-5/7">
                        <input type="checkbox" />
                        <div className="collapse-title font-bold text-sm text-center">Objective</div>
                        <div className="collapse-content text-sm">
                            {step.type === "Practice" && <div className="flex gap-2 mb-1"><span className="text-lg font-semibold underline">Task:</span><span className="">&nbsp;{step.practiceDetails?.objective}</span></div>}
                            <ul className="list-disc list-outside space-y-1 pl-5 marker:text-blue-500">
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