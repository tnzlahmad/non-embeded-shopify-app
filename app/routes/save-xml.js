import { json } from '@remix-run/node';
import { put } from '@vercel/blob';

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

  try {
    const { url } = await put(filename, Buffer.from(xmlData), {
      access: 'public',
    });

    console.log('File URL:', url);
    return json({ success: true, url });
  } catch (error) {
    console.error("Error saving XML to Vercel Blob:", error);
    return json({ success: false, error: 'Failed to save XML file' });
  }
};
