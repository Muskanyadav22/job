import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const GlobalContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const GlobalContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // input state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salary, setSalary] = useState(0);
  const [activeEmploymentTypes, setActiveEmploymentTypes] = useState([]);
  const [salaryType, setSalaryType] = useState("Year");
  const [negotiable, setNegotiable] = useState(false);
  const [tags, setTags] = useState([]);
  const [skills, setSkills] = useState([]);
  const [location, setLocation] = useState({
    country: "",
    city: "",
    address: "",
  });

  // Check if token exists on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserProfile(JSON.parse(storedUser));
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const getUserProfile = async (id) => {
    try {
      const res = await axios.get(`/api/v1/user/${id}`);

      setUserProfile(res.data);
    } catch (error) {
      console.log("Error getting user profile", error);
    }
  };

  // handle input change
  const handleTitleChange = (e) => {
    setJobTitle(e.target.value.trimStart());
  };

  const handleDescriptionChange = (e) => {
    setJobDescription(e.target.value.trimStart());
  };

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  };

  const resetJobForm = () => {
    setJobTitle("");
    setJobDescription("");
    setSalary(0);
    setActiveEmploymentTypes([]);
    setSalaryType("Year");
    setNegotiable(false);
    setTags([]);
    setSkills([]);
    setLocation({
      country: "",
      city: "",
      address: "",
    });
  };

  useEffect(() => {
    if (isAuthenticated && userProfile.id) {
      getUserProfile(userProfile.id);
    }
  }, [isAuthenticated]);

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        getUserProfile,
        loading,
        token,
        setToken,
        setUserProfile,
        setIsAuthenticated,
        jobTitle,
        jobDescription,
        salary,
        activeEmploymentTypes,
        salaryType,
        negotiable,
        tags,
        skills,
        location,
        handleTitleChange,
        handleDescriptionChange,
        handleSalaryChange,
        setActiveEmploymentTypes,
        setJobDescription,
        setSalaryType,
        setNegotiable,
        setTags,
        setSkills,
        setLocation,
        resetJobForm,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
