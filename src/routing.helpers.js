export const stantizedString = (input) => {
  return input
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toUpperCase()
    .split(" ")
    .join("_");
};

export const generateHeaderTitles = ({ sideMenuConfig }) => {
  const headerTitles = {};
  sideMenuConfig.forEach(
    ({ label: parentLabel, path: parentPath, children }) => {
      if (!children) {
        headerTitles[`/${parentPath}`] = parentLabel;
      } else {
        children.forEach(({ label: childrenLabel, path: childPath }) => {
          headerTitles[`/${parentPath}/${childPath}`] = childrenLabel;
        });
      }
    }
  );

  return { headerTitles };
};

export const getPermision = (input, publish = false) => {
  const permission = stantizedString(input);
  return [
    `VIEW:${permission}`,
    `UPDATE:${permission}`,
    `CREATE:${permission}`,
    `DELETE:${permission}`,
    ...(publish ? [`PUBLISH:${permission}`] : []),
  ];
};

export const generatePermissionToURLMapping = ({ sideMenuConfig }) => {
  const headerTitles = {};
  sideMenuConfig.forEach(
    ({
      path: parentPath,
      allowed_permisions,
      children,
      is_public_route = false,
    }) => {
      if (children) {
        children.forEach(
          ({
            path: childPath,
            allowed_permisions,
            is_public_route = false,
          }) => {
            headerTitles[`/${parentPath}/${childPath}`] = {
              allowed_permisions,
              is_public_route: is_public_route,
            };
          }
        );
      } else {
        headerTitles[`/${parentPath}`] = {
          allowed_permisions,
          is_public_route: is_public_route,
        };
      }
    }
  );
  return headerTitles;
};
