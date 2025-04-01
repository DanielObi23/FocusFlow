export default function SkillToLearn() {
    return (
        <div className="collapse bg-secondary border border-base-300">
            <input type="radio" name="path-accordion" />
            <div className="collapse-title font-semibold font-secondary-content flex justify-between">
                <h1>React Development for Backend Veterans</h1>
                <div
                    className="radial-progress bg-primary text-primary-content border-primary border-4"
                    style={{ "--value": "70", "--size": "4rem", "--thickness": "0.5rem" } as React.CSSProperties} aria-valuenow={70} role="progressbar">
                    70%
                </div>
            </div>
            <div className="collapse-content text-sm font-secondary-content">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
        </div>
    )
}