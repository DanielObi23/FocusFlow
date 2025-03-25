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
        <li className="card bg-base-100 shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 mb-4">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="card-title text-xl font-bold text-primary capitalize">{detail.jobTitle} - {detail.companyName}</h3>
                        <p className="text-base-content/70 text-sm mt-1">{detail.startDate} - {detail.endDate}</p>
                    </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                    <div className="badge badge-outline badge-secondary mr-2">{detail.experienceCategory}</div>
                    <div className="flex gap-3">
                        <button className="btn btn-info btn-sm" onClick={() => detail.edit({detail})}>Edit</button>
                        <button className="btn btn-error btn-sm" onClick={() => detail.delete(detail.experience_id)}>Delete</button>
                    </div>                    
                </div>
                
                <fieldset className="mt-3 border-2 p-5">
                    <legend className="text-base font-semibold text-base-content">&nbsp;&nbsp;Role&nbsp;&nbsp;</legend>
                    <p className="text-base-content/80">
                        {detail.roleDescription}
                    </p>
                </fieldset>
            </div>
        </li>
    )
}