import { json } from '@remix-run/node';
import { updateProductFeedURL } from '../utitls/update.feed';

export const action = async ({ request }) => {
  try {
    const { feedName, productFeedURL } = await request.json();
    const { success, result, error } = await updateProductFeedURL(feedName, productFeedURL);

    if (success) {
      return json({ success: true, result });
    } else {
      return json({ success: false, error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in update-feed-url action:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
