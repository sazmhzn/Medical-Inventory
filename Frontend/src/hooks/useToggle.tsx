import { useCallback, useState } from "react";

const useToggle = (initialState = false) => {
  const [visible, setVisible] = useState(initialState);
  const toggle = useCallback(() => setVisible((prev) => !prev), []);
  // const setToggleStatus = (value) => setVisibility(value));

  return [visible, toggle];
};

export default useToggle;
