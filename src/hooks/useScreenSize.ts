import { useState, useEffect } from 'react';
 
export enum DEVICES {
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop"
}
 
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<DEVICES>(getScreenSize);
 
  function getScreenSize() {
    const width = window.innerWidth;
 
    if (width <= 480) {
      return DEVICES.MOBILE;
    } else if (width <= 992) {
      return DEVICES.TABLET;
    } else {
      return DEVICES.DESKTOP;
    }
  }
 
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };
 
    window.addEventListener('resize', handleResize);
 
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
 
  return screenSize;
};
 
export default useScreenSize;