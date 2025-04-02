import SkillPhase from "./SkillPhase"
import { Path, deletePathDetails } from "../../../api/pathsApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "../../toast"

export default function SkillToLearn({learning_path_id, path}: Path) {
    const keyConcepts = path.keyConcepts.map(concept => <li>{concept}</li>)
    const phases = path.phases.map(phase => <SkillPhase key={phase.order} {...phase} />)

    const queryClient = useQueryClient()
    const { mutate: deletePath } = useMutation({
        mutationFn: (id: string) => deletePathDetails(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['learningPaths'],
            })
        },
        onError: (error) => {
            console.error("Error deleting path:", error)
            toast({ type: 'error', message: "Failed to delete path" });
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["learningPaths"] })
            const previousList = queryClient.getQueryData(["learningPaths"])
            queryClient.setQueryData<Path[]>(["learningPaths"], (old) =>
                old?.filter(item => item.learning_path_id!== learning_path_id)
            )
            return { previousList }
        }
    })

    function handleConfirmedDelete() {
        console.log("Deleting path with ID:", learning_path_id);
        deletePath(learning_path_id as string);
    }

    // do the same but for complete

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
                    <tfoot>
                        <tr>
                            <th><button className="btn btn-error btn-lg" onClick={() => {
                                const modal = document.getElementById(`delete-modal-${learning_path_id}`);
                                if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                }
                            }}>Delete</button></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th><button className="btn btn-success btn-lg">Complete</button></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <dialog id={`delete-modal-${learning_path_id}`} className="modal">
                <div className="modal-box w-full">
                    <div className="flex flex-col gap-2.5">
                        <p className="text-lg text-primary">Are you sure you want to delete this path?</p>
                        <p className="text-sm text-gray-600">This action cannot be undone.</p>
                    </div>
                    <div className="w-full flex justify-between mt-4">
                        <button 
                            type="button" 
                            className="btn" 
                            onClick={() => {
                                const modal = document.getElementById(`delete-modal-${learning_path_id}`);
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
    )
}