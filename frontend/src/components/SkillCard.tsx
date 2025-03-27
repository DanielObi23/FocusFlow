interface Skills {
    name: string;
    years_of_experience: number;
    type: string;
    skill_category: string;
    proficiency: string;
    description: string;
    created_at: string;
    skill_id: string;
}

export default function SkillCard({ detail }: { detail: Skills }) {
    return (
        <div className="flex flex-col rounded-2xl justify-center items-center gap-2 bg-base-100 p-3 shadow-2xl border-2 border-primary/20 hover:border-primary/80 transition-all duration-300">
            <h2 className="text-lg capitalize font-semibold">{detail.name}</h2>
            <div className="flex gap-1 items-center">
                <div className="badge badge-primary capitalize">{detail.type}</div> <div className="badge badge-primary h-1 max-w-0.1"></div> <div className="badge badge-primary capitalize">{detail.proficiency}</div>
            </div>
            <p className="badge badge-neutral">Years of exp: {detail.years_of_experience}</p>
            <p>Added {detail.created_at.split("T")[0]}</p>
            <div className="flex w-full justify-between">
                <button className="btn btn-info">Edit</button>
                <button className="btn btn-error ml-1.5">Remove</button>
            </div>
        </div>
    )
}