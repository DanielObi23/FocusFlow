export default function SkillCard() {
    return (
        <div className="flex flex-col rounded-2xl justify-center items-center gap-2 bg-base-100 p-3 shadow-2xl border-2 border-primary/20 hover:border-primary/80 transition-all duration-300">
            <h2 className="text-lg">React</h2>
            <div className="badge badge-primary">Advanced</div>
            <p>Added Jan 15, 2025</p>
            <div className="flex w-full justify-between">
                <button className="btn btn-info">Edit</button>
                <button className="btn btn-error ml-1.5">Remove</button>
            </div>
        </div>
    )
}