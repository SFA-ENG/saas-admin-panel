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

export const getPermision = (input) => {
  const permission = stantizedString(input);
  return [`VIEW:${permission}`, `UPDATE:${permission}`];
};

export const generatePermissionToURLMapping = ({ sideMenuConfig }) => {
  const headerTitles = {};
  sideMenuConfig.forEach(
    ({ path: parentPath, allowed_permisions, children }) => {
      if (children) {
        children.forEach(({ path: childPath, allowed_permisions }) => {
          headerTitles[`/${parentPath}/${childPath}`] = allowed_permisions;
        });
      } else {
        headerTitles[`/${parentPath}`] = allowed_permisions;
      }
    }
  );
  return headerTitles;
};

export const getAllowedPermissions = ({ permissionType, sideMenuConfig }) => {
  const permissions = [];
  sideMenuConfig.forEach(({ allowed_permisions }) => {
    const data = allowed_permisions.filter((a) => {
      return a.startsWith(permissionType);
    });
    data.forEach((item) => {
      permissions.push({
        name: item,
        value: item,
      });
    });
  });
  return permissions;
};
