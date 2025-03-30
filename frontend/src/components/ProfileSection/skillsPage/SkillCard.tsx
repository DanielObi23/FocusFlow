import { 
    BookOpen, 
    Briefcase, 
    Star, 
    Calendar, 
    Edit2, 
    Trash2 
} from 'lucide-react';

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

export default function SkillCard({ detail, deleteSkill: handleDeleteSkill, handleEditSkill: handleEditSkill }: { detail: Skills; deleteSkill: (id: string) => Promise<void>; handleEditSkill: (detail: Skills) => Promise<void> }) {
    const getProficiencyDetails = () => {
        switch(detail.proficiency.toLowerCase()) {
            case 'beginner':
                return { color: 'text-blue-500'};
            case 'intermediate':
                return { color: 'text-green-500'};
            case 'advanced':
                return { color: 'text-purple-500'};
            case 'expert':
                return { color: 'text-orange-500'};
            default:
                return { color: 'text-gray-500'};
        }
    };

    const proficiencyDetails = getProficiencyDetails();

    return (
        <div className="flex flex-col rounded-2xl justify-center items-center gap-2 bg-base-100 p-5 shadow-2xl border-2 border-primary/20 hover:border-primary/80 transition-all duration-300">
            <h2 className="text-xl text-center capitalize font-bold w-full">{detail.name}</h2>
            <div className="space-y-3 mt-1 w-full">
                <div className="flex items-center gap-2 text-content">
                    <Briefcase className="w-4 h-4 text-secondary" />
                    <span className="capitalize text-base">{detail.type} Skill</span>
                </div>

                <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${proficiencyDetails.color}`} />
                    <span className={`capitalize text-base ${proficiencyDetails.color}`}>
                        {detail.proficiency} Level
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-secondary" />
                    <span className="text-base">
                        {detail.years_of_experience < 1? "<1" : detail.years_of_experience}&nbsp;
                        {detail.years_of_experience > 1 ? 'years' : 'year'} of experience
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span className="text-base">
                        Added {new Date(detail.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
            
            <div className="mt-2 text-md font-medium text-secondary-content w-full bg-secondary/50 p-4 italic">
                "{detail.description? detail.description : "No description provided by user"}"
            </div>          

            <div className="flex w-full justify-between mt-2">
                <button className="btn btn-info" onClick={() => handleEditSkill(detail)}><Edit2 className="w-4 h-4" /> Edit</button>
                <button className="btn btn-error ml-1.5" onClick={() => handleDeleteSkill(detail.skill_id)}><Trash2 className="w-4 h-4" /> Remove</button>
            </div>
        </div>
    )
}