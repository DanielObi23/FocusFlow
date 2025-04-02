import SkillPhase from "./SkillPhase"
import { Path, deletePath, completePath } from "../../../api/pathsApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "../../toast"

export default function SkillToLearn({learning_path_id, path}: Path) {
    const keyConcepts = path.keyConcepts.map((concept, index) => <li key={`concept-${index}`}>{concept}</li>)
    const phases = path.phases.map(phase => <SkillPhase key={phase.order} {...phase} />)

    const queryClient = useQueryClient()
    const { mutate: deletePathDetails } = useMutation({
        mutationFn: (id: string) => deletePath(id),
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

    const { mutate: completePathDetails } = useMutation({
        mutationFn: (id: string) => completePath(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [['learningPaths'], ['skills']],
            })
            toast({ type: 'success', message: "Skill successfully added to your list" });
        },
        onError: (error) => {
            console.error("Error completing path:", error)
            toast({ type: 'error', message: "Failed to complete path" });
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

    function handleConfirmedDeletion() {
        console.log("Deleting path with ID:", learning_path_id);
        deletePathDetails(learning_path_id as string);
    }

    function handleConfirmedCompletion() {
        console.log("Completing path with ID:", learning_path_id);
        completePathDetails(learning_path_id as string);
    }

    // do the same but for complete, toast on success, skill added to user skill list. optimistic delete from

    return (
        <div className="collapse bg-secondary border border-base-300">
            <input type="checkbox" name="path-accordion" />
            <div className="collapse-title font-semibold font-secondary-content flex flex-col lg:flex-row w-full justify-center lg:justify-between items-center gap-3 p-6 bg-neutral">
                <p className="text-neutral-content font-semibold text-xl md:text-2xl text-center">{path.title}</p>
                <div className="collapse bg-base-100 border-base-300 border lg:w-3/7">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold text-lg text-center">Key Concepts</div>
                    <div className="collapse-content text-sm">
                        <ul className="list-disc list-outside space-y-1 pl-5 marker:text-blue-500">
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
                            <th className="text-base md:text-lg lg:text-xl font-semibold text-secondary">Type</th>
                            <th className="text-center text-base md:text-lg lg:text-xl font-semibold text-secondary" colSpan={2}>Phases</th>
                            <th className="text-base md:text-lg lg:text-xl font-semibold text-secondary">Free Resources</th>
                            <th className="text-base md:text-lg lg:text-xl font-semibold text-secondary">Paid Resources</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phases}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={5}>
                                <div className="w-full flex justify-between">
                                    <button className="btn btn-error lg:btn-lg mt-2" onClick={() => {
                                        const modal = document.getElementById(`delete-modal-${learning_path_id}`);
                                        if (modal) {
                                            (modal as HTMLDialogElement).showModal();
                                        }
                                    }}>Delete</button>
                                    <button className="btn btn-success lg:btn-lg mt-2" onClick={() => {
                                        const modal = document.getElementById(`complete-modal-${learning_path_id}`);
                                        if (modal) {
                                            (modal as HTMLDialogElement).showModal();
                                        }
                                    }}>Complete</button>
                                </div>                                
                            </th>
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
                            onClick={handleConfirmedDeletion}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </dialog>
            <dialog id={`complete-modal-${learning_path_id}`} className="modal">
                <div className="modal-box w-full">
                    <div className="flex flex-col gap-2.5">
                        <p className="text-lg text-primary">Are you sure you have completed each task?</p>
                        <p className="text-sm text-gray-600">This action cannot be undone.</p>
                    </div>
                    <div className="w-full flex justify-between mt-4">
                        <button 
                            type="button" 
                            className="btn" 
                            onClick={() => {
                                const modal = document.getElementById(`complete-modal-${learning_path_id}`);
                                if (modal) {
                                    (modal as HTMLDialogElement).close();
                                }
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success" 
                            onClick={handleConfirmedCompletion}
                        >
                            Complete
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}