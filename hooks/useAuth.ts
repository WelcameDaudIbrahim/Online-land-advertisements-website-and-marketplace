import { useSession } from "next-auth/react";

const useAuth = () => {
  const session = useSession();

  return session.data?.user;
};
export default useAuth;
