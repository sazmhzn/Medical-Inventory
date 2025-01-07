import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/custom-forms";
const base64Credentials = btoa("admin:admin123");

export interface CustomFormField {
  name: string;
  label: string;
  type: string;
  defaultValue: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface CustomForm {
  id?: number;
  entityType: string;
  formName: string;
  formConfig: {
    fields: CustomFormField[];
  };
}

// Hook to fetch all custom forms
export const useFetchCustomForms = () => {
  const [data, setData] = useState<CustomForm[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/list`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook to fetch custom forms by entity type
export const useFetchCustomFormsByEntityType = (entityType: string) => {
  const [data, setData] = useState<CustomForm[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!entityType) return;

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${entityType}`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook to fetch a specific custom form
export const useFetchCustomForm = (entityType: string, formName: string) => {
  const [data, setData] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!entityType || !formName) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/entity/${entityType}/form/${formName}`,
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [entityType, formName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Function to create or update a custom form
export const createOrUpdateCustomForm = async (formData: CustomForm) => {
  try {
    const response = await axios.post(`${BASE_URL}/save`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to save the custom form");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error saving the custom form"
    );
  }
};

// Function to update form fields
export const updateFormFields = async (
  entityType: string,
  formName: string,
  operation: string,
  fields: Array<{ [key: string]: any }>
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${entityType}/${formName}/fields?operation=${operation}`,
      fields,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update form fields");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating the form fields"
    );
  }
};

export const deleteFields = async (
  entityType: string,
  formName: string,
  fields: Array<{ name: string }>
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${entityType}/${formName}/fields?operation=delete`,
      fields,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );
    console.log(
      `${BASE_URL}/${entityType}/${formName}/fields/?operation=delete`
    );

    if (response.status !== 200) {
      throw new Error("Failed to delete fields");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting fields"
    );
  }
};

// Function to delete a custom form
export const deleteCustomForm = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to delete the custom form");
    }

    return true;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting the custom form"
    );
  }
};

// Function to update a custom form
export const updateCustomForm = async (id: number, formData: CustomForm) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to update the custom form");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating the custom form"
    );
  }
};
