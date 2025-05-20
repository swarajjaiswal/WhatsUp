
import { LANGUAGE_TO_FLAG } from "../constants/index";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
   <div className="card bg-base-200 hover:shadow-md transition-shadow">
  <div className="card-body p-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="avatar size-12">
        <img src={friend.profilePic} alt={friend.fullname} />
      </div>

   <div className="flex flex-col space-y-1">
  <h3 className="font-semibold truncate">{friend.fullname}</h3>
  {friend.location && (
    <span className="badge badge-secondary badge-sm self-start flex items-center gap-1">
      <MapPin className="size-3.5" />
      {friend.location}
    </span>
  )}
</div>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-3">
      <span className="badge badge-secondary text-xs">
        {getLanguageFlag(friend.nativeLanguage)} Native: {friend.nativeLanguage}
      </span>
      <span className="badge badge-outline text-xs">
        {getLanguageFlag(friend.learningLanguage)} Learning: {friend.learningLanguage}
      </span>
    </div>

    <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
      Message
    </Link>
  </div>
</div>

  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
