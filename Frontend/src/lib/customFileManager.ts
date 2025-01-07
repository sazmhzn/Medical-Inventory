let customFields = [];

export const addCustomField = (entityType, fieldConfig) => {
  customFields.push({ entityType, ...fieldConfig });
  console.log("Custom Field is");
  console.log(customFields);
};

export const getCustomFields = (entityType) => {
  return customFields.filter((field) => field.entityType === entityType);
};

export const resetCustomFields = (entityType) => {
  customFields = customFields.filter(
    (field) => field.entityType !== entityType
  );
};
