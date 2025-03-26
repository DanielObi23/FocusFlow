interface WorkExperienceItem {
    experience_id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string;
    experienceCategory: string;
    roleDescription: string;
    delete: (experience_id: string) => void
    edit: (experience_id: any) => void
}

interface WorkExperienceProps {
    detail: WorkExperienceItem;
}
export default function WorkExperience({ detail }: WorkExperienceProps) {
    return (
        <li className="card bg-base-100 shadow-2xl border-2 border-primary/20 hover:border-primary/80 transition-all duration-300 mb-4">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-primary capitalize">{detail.jobTitle}<span className="hidden md:inline">&nbsp;-&nbsp;</span><span className="text-base-content block md:inline md:text-primary">{detail.companyName}</span></h3>
                        <p className="text-base-content/70 text-sm md:text-base mt-1">{detail.startDate} <span className="font-semibold text-2xl">-</span> {detail.endDate}</p>
                    </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                    <div className="badge badge-outline badge-secondary mr-2 md:badge-lg">{detail.experienceCategory}</div>
                    <div className="flex gap-3">
                        <button className="btn btn-info btn-sm md:btn-md" onClick={() => detail.edit({detail})}>Edit</button>
                        <button className="btn btn-error btn-sm md:btn-md" onClick={() => detail.delete(detail.experience_id)}>Delete</button>
                    </div>                    
                </div>
                
                <fieldset className="mt-3 border-2 p-5">
                    <legend className="text-base md:text-xl font-semibold text-base-content">&nbsp;&nbsp;Role&nbsp;&nbsp;</legend>
                    <p className="text-base-content/80 md:text-lg">
                        {detail.roleDescription}
                    </p>
                </fieldset>
            </div>
        </li>
    )
}