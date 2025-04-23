import BackButton from "Components/BackButton/BackButton";
import React from "react";

const withBackButton = (WrappedComponent) => {
  const ComponentWithBackButton = (props) => {
    return (
      <React.Fragment>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <BackButton />
        </div>
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  };

  return ComponentWithBackButton;
};
export default withBackButton;
