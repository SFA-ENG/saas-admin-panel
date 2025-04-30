
const AccessControlButton = (props) => {
  return (
    <button
      {...props}
      type="button"
      onClick={props.onClick}
      className="add-user-btn relative flex items-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none transform hover:scale-[1.02]"
    >
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
      <props.icon size={18} className="mr-2" />
      <span>{props.title}</span>
    </button>
  );
};

export default AccessControlButton;
