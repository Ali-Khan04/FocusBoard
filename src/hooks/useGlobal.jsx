import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext.jsx";
export const useGlobal = () => {
  return useContext(GlobalContext);
};
