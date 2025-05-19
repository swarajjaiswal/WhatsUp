import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useUserAuth = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user,
    error: authUser.error,
  };
};

export default useUserAuth;
