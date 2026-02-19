// src/utils/fileUtils.js

export const generateFileName = (file) => {
  if (!file || !file.name) {
    throw new Error("Invalid file object");
  }

  const ext = file.name.split(".").pop();

  // Add randomness to avoid duplicate names
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  const name = `${uniqueSuffix}.${ext}`;
  console.log("Generated file name:", name);
  return name;
};
