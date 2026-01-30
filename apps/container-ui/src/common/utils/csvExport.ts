/**
 * Utility functions for exporting data to CSV
 */

/**
 * Convert an array of objects to CSV string
 */
export const convertToCSV = (
  data: Record<string, any>[],
  columns?: { key: string; title: string }[]
): string => {
  if (!data || data.length === 0) {
    return "";
  }

  // If columns are provided, use them; otherwise, derive from data keys
  const headers = columns
    ? columns.map((col) => col.title)
    : Object.keys(data[0]);

  const keys = columns ? columns.map((col) => col.key) : Object.keys(data[0]);

  // Create CSV header row
  const csvRows: string[] = [headers.map(escapeCSVValue).join(",")];

  // Create data rows
  data.forEach((row) => {
    const values = keys.map((key) => {
      const value = row[key];
      return escapeCSVValue(formatCSVValue(value));
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};

/**
 * Escape special characters in CSV values
 */
const escapeCSVValue = (value: string): string => {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  // If the value contains comma, newline, or double quote, wrap in quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes("\n") ||
    stringValue.includes('"')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

/**
 * Format values for CSV export
 */
const formatCSVValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (Array.isArray(value)) {
    return value.join("; ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};

/**
 * Trigger download of CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  //@ts-expect-error - navigator.msSaveBlob is not defined in the type definitions
  if (navigator.msSaveBlob) {
    // IE 10+
    //@ts-expect-error - navigator.msSaveBlob is not defined in the type definitions
    navigator.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export data to CSV file
 */
export const exportToCSV = (
  data: Record<string, any>[],
  filename: string,
  columns?: { key: string; title: string }[]
): void => {
  const csvContent = convertToCSV(data, columns);
  if (csvContent) {
    downloadCSV(csvContent, filename);
  }
};

