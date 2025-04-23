const isBrowser = () => typeof window !== "undefined";
const compareViewPort = (size) => {
  return (
    isBrowser() &&
    window.matchMedia &&
    window.matchMedia(`(max-width: ${size}px)`).matches
  );
};

const isMobile = () => compareViewPort("1023");

export { isMobile };
