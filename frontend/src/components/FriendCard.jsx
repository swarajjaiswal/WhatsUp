import { LANGUAGE_TO_FLAG } from "../constants/index";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { unfriendUserFn } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FriendCard = ({ friend }) => {
  const isNexa = friend.fullname === "Nexa";
  const nexaBio = "Your friendly AI assistant!";
  const queryClient = useQueryClient();

  const { mutate: unfriendMutate, isLoading: isUnfriending } = useMutation({
    mutationFn: () => unfriendUserFn(friend._id),
    onSuccess: () => {
      toast.success(`Unfriended ${friend.fullname}`);
      queryClient.invalidateQueries(["myFriends"]);
    },
    onError: () => {
      toast.error("Failed to unfriend. Please try again.");
    },
  });

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

        {!isNexa ? (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="badge badge-secondary text-xs flex items-center gap-1">
              {getLanguageFlag(friend.nativeLanguage)}
              <span>Native: {friend.nativeLanguage}</span>
            </span>
            <span className="badge badge-outline text-xs flex items-center gap-1">
              {getLanguageFlag(friend.learningLanguage)}
              <span>Learning: {friend.learningLanguage}</span>
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-3">{friend.bio || nexaBio}</p>
        )}

        <Link
          to={isNexa ? "/nexa" : `/chat/${friend._id}`}
          className="btn btn-outline w-full"
        >
          Message
        </Link>

        {!isNexa && (
          <button
            onClick={() => unfriendMutate()}
            className="btn btn-error btn-sm w-full mt-2"
            disabled={isUnfriending}
          >
            {isUnfriending ? "Unfriending..." : "Unfriend"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return <></>;

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

  return <></>;
}
