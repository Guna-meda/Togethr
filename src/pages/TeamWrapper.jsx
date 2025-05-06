import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { getTeamById } from '../firebase/teams';
import TeamPage from '../components/TeamPage';

const TeamWrapper = () => {

  const {id} = useParams();
  const [team , setTeam] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      const data = await getTeamById(id);
      setTeam(data);
    }
    fetchPage()
  },[id])

  if (!team) return(
    <div className="text-center mt-10">
      <div className="spinner mx-auto"></div>
    </div>
  );;

  return <TeamPage team={team} teamId={id} />;

}

export default TeamWrapper