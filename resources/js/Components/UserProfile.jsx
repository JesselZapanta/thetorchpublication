export default function UserProfile({ profile_image_path }) {
    return (
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden cursor-pointer">
            <img
                src={profile_image_path}
                alt={profile_image_path}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
