import { useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { getTeamById } from "../firebase/teams";

export const useLoadUserTeams = () => {
  const user = useUserStore((s) => s.user);
  const setTeams = useUserStore((s) => s.setTeams);

  useEffect(() => {
    const load = async () => {
      if (user?.teamIds?.length && useUserStore.getState().teams.length === 0) {
        const data = await Promise.all(user.teamIds.map(getTeamById));
        setTeams(data.filter(Boolean));
      }
    };
    load();
  }, [user]);
};
