import { json } from '@remix-run/node';
import fs from 'fs';
import path from 'path';

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const saveXMLToPublic = (filename, xmlData) => {
  try {
    const publicFolderPath = path.join(process.cwd(), 'public', 'xml-folder');
    ensureDirectoryExists(publicFolderPath);

    const filePath = path.join(publicFolderPath, filename);
    fs.writeFileSync(filePath, xmlData, 'utf8');

    return { success: true, message: 'XML file saved successfully' };
  } catch (error) {
    console.error("Error saving XML file:", error);
    return { success: false, error: 'Failed to save XML file' };
  }
};

export const loader = async () => json({ error: 'Not Found' }, { status: 404 });

export const action = async ({ request }) => {
  const formData = await request.formData();
  if (formData.get("actionType") !== "saveXML") {
    return json({ error: "Invalid action type" }, { status: 400 });
  }

  const xmlData = formData.get('xmlData');
  const feedName = formData.get('feedName');
  const filename = formData.get('filename');

  if (!xmlData || !feedName || !filename) {
    return json({ success: false, error: 'No XML data, feed name, or filename provided' }, { status: 400 });
  }

  const result = saveXMLToPublic(filename, xmlData);
  return json(result);
};
