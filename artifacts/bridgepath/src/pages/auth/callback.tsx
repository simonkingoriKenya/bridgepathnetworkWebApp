import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("bridgepath_user_role") || "job_seeker";
    setLocation(role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
  }, [setLocation]);

  return null;
}
