import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl, Button } from "react-bootstrap";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    if (!currentUser) {
      navigate("/Kambaz/Account/Signin");
    } else {
      setProfile(currentUser); // 将 currentUser 写入 state
    }
  }, [currentUser]);

  const signout = () => {
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <FormControl
            value={profile.username}
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          <FormControl
            type="password"
            value={profile.password}
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />
          <FormControl
            value={profile.firstName}
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
          <FormControl
            value={profile.lastName}
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
          <FormControl
            type="date"
            value={profile.dob}
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <FormControl
            value={profile.email}
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="form-control mb-2"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
